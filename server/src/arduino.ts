const five = require("johnny-five");
let led: any;
let isOn = false;
try {
  const board = new five.Board({
    port: "COM3",
  });

  board.on("ready", () => {
    led = new five.Led(13);
    led.off();
  });
} catch (error) {
  console.error(error);
}

export function toggleLed() {
  led.on();
  setTimeout(function () {
    led.off();
  }, 1000);

  return isOn;
}
