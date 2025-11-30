const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Job = require('../models/job');
const fs = require('fs');
const uploadDir = process.env.STORAGE_PATH || path.join(__dirname,'../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, uploadDir),
  filename: (req,file,cb)=> cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.array('files', 10), async (req,res)=>{
  const files = req.files.map(f=>({ path: f.path, originalName: f.originalname, mimeType: f.mimetype, size: f.size }));
  const job = new Job({ user: req.body.user || null, files, settings: JSON.parse(req.body.settings || '{}'), status: 'uploaded', price: 0, currency: 'USD' });
  await job.save();
  res.json({ ok:true, jobId: job._id, files });
});

router.get('/:id', async (req,res)=>{
  const job = await Job.findById(req.params.id);
  if(!job) return res.status(404).json({error:'not found'});
  res.json(job);
});

router.get('/', async (req,res)=>{
  const jobs = await Job.find().sort({ createdAt: -1 }).limit(50);
  res.json(jobs);
});

module.exports = router;
