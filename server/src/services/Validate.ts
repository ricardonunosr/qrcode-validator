import app from "../app";
import express from "@feathersjs/express";
import QRcode from "../interfaces";
import Types from "../constants";
import { toggleLed } from "../arduino";

const router = express.Router();

router.get("/qrcodes/validate/:uuid", async (req, res) => {
  const uuid = req.params["uuid"];
  const qrcodeService = app.service("qrcode");
  const qrcodeData: any = await qrcodeService.find({
    query: {
      uuid: uuid,
    },
  });
  let flag = false;
  const qrcode: QRcode = qrcodeData.data[0];
  if (qrcode !== undefined) {
    flag = true;
    if (qrcode.type === Types.Temporary) {
      const validUntil = qrcode.validUntil;
      const now = new Date();
      // @ts-ignore: Unreachable code error
      if (validUntil < now) flag = false;
    }

    if (qrcode.type === Types.OneTime) {
      // @ts-ignore: Unreachable code error
      qrcodeService.remove(qrcode._id);
    }
  }

  if (flag) {
    //toggleLed();
    res.json({ Message: `Validated qrcode ${uuid} with success` });
  } else {
    res.json({ Message: `Couldnt Validate qrcode ${uuid} with success` });
  }
});

export default router;
