import { Service, MemoryServiceOptions } from "feathers-memory";
import { Application } from "../../declarations";
import CheckCOMPort from "../../Utils/COMPort";

export class Microcontroller extends Service {
  constructor(options: Partial<MemoryServiceOptions>, app: Application) {
    super(options);

    this.create({ status: false });
    setInterval(async () => {
      if (process.env.MICRO_CONTROLLER_SERIAL_NUMBER) {
        await CheckCOMPort(
          app,
          "microcontroller",
          process.env.MICRO_CONTROLLER_SERIAL_NUMBER
        );
      }
    }, 1000);
  }
}
