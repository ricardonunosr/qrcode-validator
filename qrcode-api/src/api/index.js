const express = require('express');

const qrcode = require('./qrcode/qrcode.routes');

const router = express.Router();

router.use('/qrcode', qrcode);

module.exports = router;
