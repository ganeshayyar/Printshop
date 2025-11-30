const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, index: true },
  phone: String,
  passwordHash: String, twoFA: { enabled: { type: Boolean, default: false }, secret: String },
  roles: { type: [String], default: ['user'] },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
