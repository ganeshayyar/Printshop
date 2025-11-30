const Job = require('../models/job');
const Printer = require('../models/printer');

class QueueManager {
  constructor(){
    this.io = null;
    this.processing = new Map();
    this.pollInterval = Number(process.env.DEFAULT_PRINTER_POLL_INTERVAL || 3000);
    this.timer = null;
  }
  init(io){
    this.io = io;
    this.startLoop();
  }
  startLoop(){
    if(this.timer) return;
    this.timer = setInterval(()=> this.dispatch(), this.pollInterval);
  }
  async dispatch(){
    try{
      const job = await Job.findOne({ status: { $in: ['paid','queued','uploaded'] }, printer: null }).sort({ createdAt: 1 });
      if(!job) return;
      const printers = await Printer.find({ 'status.online': true });
      const free = printers.find(p => !this.processing.has(String(p._id)));
      if(!free) return;
      job.printer = free._id; job.status = 'printing'; job.assignedAt = new Date(); await job.save();
      this.processing.set(String(free._id), String(job._id));
      // Simulate printing by timeout
      setTimeout(async ()=>{
        job.status = 'printed'; job.finishedAt = new Date(); await job.save();
        this.processing.delete(String(free._id));
        if(this.io) this.io.emit('job:update', { jobId: job._id, status: job.status });
      }, 5000); // simulated 5s print time
      if(this.io) this.io.emit('job:update', { jobId: job._id, status: job.status });
    }catch(err){
      console.error('Queue dispatch error', err);
    }
  }
}

module.exports = new QueueManager();
