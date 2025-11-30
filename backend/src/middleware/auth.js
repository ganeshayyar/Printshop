const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

async function auth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({ error: 'missing auth' });
  const parts = h.split(' ');
  if(parts.length!==2) return res.status(401).json({ error: 'invalid auth' });
  const token = parts[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    const u = await User.findById(payload.sub);
    if(!u) return res.status(401).json({ error: 'user not found' });
    req.user = u; next();
  }catch(err){ return res.status(401).json({ error: 'invalid token' }); }
}
module.exports = auth;
