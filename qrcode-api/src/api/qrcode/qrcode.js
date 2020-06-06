const QRCode = require('qrcode');

const generateQR = async (uuid) => {
  try {
    const uri = await QRCode.toDataURL(uuid);
    return uri;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { generateQR };
