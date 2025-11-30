const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const User = require('../models/user');
const Token = require('../models/token');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT || 587),
  auth: { user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '' }
});

async function hashPassword(password){ return bcrypt.hash(password, 10); }
async function verifyPassword(password, hash){ return bcrypt.compare(password, hash); }

function signAccessToken(user){ return jwt.sign({ sub: String(user._id), roles: user.roles }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }); }
function signRefreshToken(user){ return jwt.sign({ sub: String(user._id) }, JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }); }

async function createUser({ name, email, phone, password }){
  const existing = await User.findOne({ email });
  if(existing) throw new Error('Email already registered');
  const passwordHash = await hashPassword(password);
  const u = new User({ name, email, phone, passwordHash, roles: ['user'], isVerified: false });
  await u.save();
  // create verification token
  const token = crypto.randomBytes(24).toString('hex');
  await Token.create({ user: u._id, token, type: 'verify', expiresAt: new Date(Date.now()+1000*60*60*24) });
  // send email (if SMTP configured)
  try{
    const url = `${FRONTEND_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      to: u.email,
      subject: 'Verify your email',
      text: 'Verify: ' + url,
      html: `<p>Verify your email by clicking <a href="${url}">here</a></p>`
    });
  }catch(err){
    console.warn('Email send failed:', err.message);
  }
  return u;
}

async function verifyEmail(tokenStr){
  const t = await Token.findOne({ token: tokenStr, type: 'verify' });
  if(!t) throw new Error('Invalid or expired token');
  const u = await User.findById(t.user);
  if(!u) throw new Error('User not found');
  u.isVerified = true; await u.save();
  await t.delete();
  return u;
}

async function loginWithPassword(email, password){
  const u = await User.findOne({ email });
  if(!u) throw new Error('Invalid credentials');
  const ok = await verifyPassword(password, u.passwordHash);
  if(!ok) throw new Error('Invalid credentials');
  const access = signAccessToken(u);
  const refresh = signRefreshToken(u);
  // persist refresh token
  await Token.create({ user: u._id, token: refresh, type: 'refresh', expiresAt: new Date(Date.now()+1000*60*60*24*7) });
  return { user: u, accessToken: access, refreshToken: refresh };
}

async function refreshToken(oldRefresh){
  try{
    const payload = jwt.verify(oldRefresh, JWT_REFRESH_SECRET);
    const stored = await Token.findOne({ token: oldRefresh, type: 'refresh' });
    if(!stored) throw new Error('Refresh token not found');
    const u = await User.findById(payload.sub);
    const access = signAccessToken(u);
    const refresh = signRefreshToken(u);
    // replace token
    await stored.delete();
    await Token.create({ user: u._id, token: refresh, type: 'refresh', expiresAt: new Date(Date.now()+1000*60*60*24*7) });
    return { accessToken: access, refreshToken: refresh };
  }catch(err){
    throw new Error('Invalid refresh token');
  }
}

// 2FA (TOTP)
function generate2faSecret(){ return speakeasy.generateSecret({ length: 20 }); }
function verify2fa(token, secret){ return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 }); }

module.exports = { createUser, verifyEmail, loginWithPassword, refreshToken, generate2faSecret, verify2fa };
