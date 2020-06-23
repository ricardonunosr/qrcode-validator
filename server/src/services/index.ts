import { Application } from '../declarations';
import qrcode from './qrcode/qrcode.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(qrcode);
}
