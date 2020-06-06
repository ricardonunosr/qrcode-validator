import axios from 'axios';

export async function getQRCode(id: string) {
  try {
    const { data } = await axios.get(
      `http://192.168.1.170:5050/api/v1/qrcode/${id}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllQRCode() {
  try {
    const { data } = await axios.get(`http://192.168.1.170:5050/api/v1/qrcode`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteQRCode(id: string) {
  try {
    await axios.delete(`http://192.168.1.170:5050/api/v1/qrcode/${id}`);
  } catch (error) {
    console.error(error);
  }
}

export async function generateQRCode() {
  try {
    const { data } = await axios.post(
      `http://192.168.1.170:5050/api/v1/qrcode`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}
