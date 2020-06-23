import { Service, MongooseServiceOptions } from "feathers-mongoose";
import { Application } from "../../declarations";
import { Params } from "@feathersjs/feathers";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

interface QRcode {
  uuid: string;
  qrcode: string;
}

export class Qrcode extends Service<QRcode> {
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  async create(data: QRcode, params?: Params) {
    const uuid = uuidv4().toString();
    const qrcode = await QRCode.toDataURL(uuid);

    const qrcodeData = { uuid, qrcode };

    return super.create(qrcodeData, params);
  }
}
