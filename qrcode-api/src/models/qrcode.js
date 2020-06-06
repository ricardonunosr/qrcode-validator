const mongoose = require('mongoose');

const { Schema } = mongoose;

const qrcodeSchema = new Schema({
  uuid: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const QRCode = mongoose.model('QRCode', qrcodeSchema);

module.exports = QRCode;
