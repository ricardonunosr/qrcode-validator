const SerialPort = require("serialport");

import { Application } from "../declarations";

const CheckCOMPort = async (
  app: Application,
  serviceName: string,
  serialNumber: string
) => {
  const service = app.service(serviceName);

  let ports = await SerialPort.list();
  const scannerPort = ports.filter(
    (port: any) => port.serialNumber === serialNumber
  );
  // @ts-ignore: Unreachable code error
  const object = await service.get(0);
  if (scannerPort.length !== 0) {
    if (!object.status) {
      // @ts-ignore: Unreachable code error
      service.update(0, { status: true });
      // @ts-ignore: Unreachable code error
      service.emit("status", { status: true });
    }
  } else {
    if (object.status) {
      // @ts-ignore: Unreachable code error
      service.update(0, { status: false });
      // @ts-ignore: Unreachable code error
      service.emit("status", { status: false });
    }
  }
};

export default CheckCOMPort;
