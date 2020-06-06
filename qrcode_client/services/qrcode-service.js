const axios = require('axios');

async function getQRCode(id) {
  try {
    const {data} = await axios.get(
      `http://192.168.1.170:5050/api/v1/qrcode/${id}`,
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function deleteQRCode(id) {
  try {
    await axios.delete(`http://192.168.1.170:5050/api/v1/qrcode/${id}`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {getQRCode, deleteQRCode};
