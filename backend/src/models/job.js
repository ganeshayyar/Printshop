const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JobSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  files: [{ path: String, originalName: String, mimeType: String, pages: Number, size: Number }],
  settings: Object,
  price: Number,
  currency: String,
  payment: Object,
  queue: Number,
  status: { type: String, default: 'uploaded' },
  printer: { type: Schema.Types.ObjectId, ref: 'Printer' },
  assignedAt: Date, startedAt: Date, finishedAt: Date, error: String
}, { timestamps: true });
module.exports = mongoose.model('Job', JobSchema);
