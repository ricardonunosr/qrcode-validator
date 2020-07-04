import { Service, MemoryServiceOptions } from "feathers-memory";
import { Application } from "../../declarations";
import CheckCOMPort from "../../Utils/COMPort";

const Readline = require("@serialport/parser-readline");
const superagent = require("superagent");
const SerialPort = require("serialport");

export class Scanner extends Service {
  constructor(options: Partial<MemoryServiceOptions>, app: Application) {
    super(options);

    let scanner = new SerialPort("COM4", {
      baudRate: 9600,
    });

    const parser = scanner.pipe(new Readline({ delimiter: "\r" }));
    parser.on("data", async (data: string) => {
      const qrcode = await superagent.get(
        `http://localhost:3030/qrcode?uuid=${data}`
      );
      console.log(`DATA:${data}`);
      console.log(qrcode.body.data[0]._id);
      await superagent.delete(
        `http://localhost:3030/qrcode/${qrcode.body.data[0]._id}`
      );
    });

    this.create({ status: false });
    setInterval(async () => {
      if (process.env.SCANNER_SERIAL_NUMBER) {
        await CheckCOMPort(app, "scanner", process.env.SCANNER_SERIAL_NUMBER);
      }
    }, 1000);
  }
}
