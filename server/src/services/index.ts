import { Application } from "../declarations";
import qrcode from "./qrcode/qrcode.service";
import scanner from "./scanner/scanner.service";
import microcontroller from './microcontroller/microcontroller.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(qrcode);
  app.configure(scanner);
  app.configure(microcontroller);
}
