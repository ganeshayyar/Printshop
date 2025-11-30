const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PrinterSchema = new Schema({
  name: String,
  type: String,
  endpoint: String,
  capabilities: Object,
  status: { online: Boolean, lastSeen: Date, state: String },
  currentJobId: { type: Schema.Types.ObjectId, ref: 'Job' }
}, { timestamps: true });
module.exports = mongoose.model('Printer', PrinterSchema);
