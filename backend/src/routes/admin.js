const express = require('express');
const router = express.Router();
const Printer = require('../models/printer');
const Job = require('../models/job');

router.get('/printers', async (req,res)=>{
  const printers = await Printer.find();
  res.json(printers);
});

router.post('/printers', async (req,res)=>{
  const p = new Printer(req.body);
  await p.save();
  res.json(p);
});

router.post('/queue/:jobId/assign', async (req,res)=>{
  const { printerId } = req.body;
  const job = await Job.findById(req.params.jobId);
  if(!job) return res.status(404).json({ error: 'job not found' });
  job.printer = printerId; job.status = 'queued';
  await job.save();
  res.json({ ok:true, jobId: job._id });
});

module.exports = router;
