import express from "@feathersjs/express";
const scannerRouter = express.Router();
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const superagent = require("superagent");

let scanner: any;
let response: {};

scanner = new SerialPort("COM4", {
  baudRate: 9600,
});

setInterval(async () => {
  let ports = await SerialPort.list();
  const scannerPort = ports.filter(
    (port: any) => port.serialNumber === "YS72404M0284"
  );
  if (scannerPort.length !== 0) {
    response = { Message: "Connected" };
  } else {
    response = { Message: "Not Connected" };
  }
  console.log(response);
}, 1000);

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

scannerRouter.get("/scanner", async (req, res) => {
  return res.json(response);
});

export default scannerRouter;
