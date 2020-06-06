const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const { generateQR } = require('./qrcode');
const QRCode = require('../../models/qrcode');

router.get('/', async (req, res, next) => {
  try {
    const entries = await QRCode.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const entrie = await QRCode.findOne({ uuid: id });
    res.json(entrie);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const uuid = uuidv4().toString();
    const qrcode = await generateQR(uuid);
    const qrCode = new QRCode({ uuid });
    await qrCode.save();
    res.json({ url: qrcode });
    res.status(201);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await QRCode.deleteOne({ uuid: id });
    res.status(204);
    res.json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
