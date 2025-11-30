const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  token: String,
  type: String,
  expiresAt: Date
}, { timestamps: true });
module.exports = mongoose.model('Token', TokenSchema);
