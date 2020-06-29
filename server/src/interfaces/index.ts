import { NullableId } from "@feathersjs/feathers";

interface QRcode {
  _id?: NullableId;
  uuid: string;
  qrcode: string;
  validUntil?: Date;
  type?: string;
  associatedName?: string;
}

export default QRcode;
