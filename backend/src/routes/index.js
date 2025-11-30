const express = require('express');
const router = express.Router();
const auth = require('./auth');
const jobs = require('./jobs');
const admin = require('./admin');

router.use('/auth', auth);
router.use('/jobs', jobs);
router.use('/admin', admin);

router.get('/healthz', (req,res)=>res.json({ok:true}));

module.exports = router;
