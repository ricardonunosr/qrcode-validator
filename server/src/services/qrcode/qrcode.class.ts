import { Service, MongooseServiceOptions } from "feathers-mongoose";
import { Application } from "../../declarations";
import { Params } from "@feathersjs/feathers";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import Types from "../../constants";
import QRcode from "../../interfaces";

export class Qrcode extends Service<QRcode> {
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  async create(data: QRcode, params?: Params) {
    const uuid = uuidv4().toString();
    const qrcode = await QRCode.toDataURL(uuid);

    data.uuid = uuid;
    data.qrcode = qrcode;
    data.type = data.type?.toLowerCase();
    if (data.type === Types.Definitive || data.type === Types.Temporary) {
      if (
        data.validUntil === undefined ||
        data.associatedName?.trim() === undefined
      ) {
        throw new Error(
          "If QRCode is definitive or temporary validUntil or associatedName can't be undefined "
        );
      }
      if (data.type === Types.Definitive) data.validUntil = undefined;
    }

    return super.create(data, params);
  }
}
