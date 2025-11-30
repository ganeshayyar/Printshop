const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/register', async (req,res)=>{
  try{
    const { name,email,phone,password } = req.body;
    const u = await authService.createUser({ name,email,phone,password });
    res.json({ ok:true, userId: u._id });
  }catch(err){ res.status(400).json({ error: err.message }); }
});

router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const out = await authService.loginWithPassword(email, password);
    res.json({ ok:true, user: { id: out.user._id, email: out.user.email }, accessToken: out.accessToken, refreshToken: out.refreshToken });
  }catch(err){ res.status(401).json({ error: err.message }); }
});

router.post('/token/refresh', async (req,res)=>{
  try{
    const { refreshToken } = req.body;
    const out = await authService.refreshToken(refreshToken);
    res.json({ ok:true, accessToken: out.accessToken, refreshToken: out.refreshToken });
  }catch(err){ res.status(401).json({ error: err.message }); }
});

router.get('/verify-email', async (req,res)=>{
  try{
    const { token } = req.query;
    if(!token) return res.status(400).json({ error: 'token required' });
    await authService.verifyEmail(token);
    res.json({ ok:true, message: 'email verified' });
  }catch(err){ res.status(400).json({ error: err.message }); }
});

// 2FA endpoints
router.post('/2fa/generate', async (req,res)=>{
  try{
    const s = authService.generate2faSecret();
    res.json({ ok:true, secret: s.base32, otpauth: s.otpauth_url });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.post('/2fa/verify', async (req,res)=>{
  try{
    const { token, secret } = req.body;
    const ok = authService.verify2fa(token, secret);
    res.json({ ok });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
