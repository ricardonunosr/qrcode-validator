import Types from './Types';

export interface QRCode {
  _id: string;
  type: Types;
  uuid: string;
  qrcode: string;
  validUntil: Date;
  associatedName: string;
  createdAt: Date;
  updatedAt: string;
  __v: number;
}
