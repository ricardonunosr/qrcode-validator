// Initializes the `microcontroller` service on path `/microcontroller`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { Microcontroller } from "./microcontroller.class";
import hooks from "./microcontroller.hooks";

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    microcontroller: Microcontroller & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    events: ["status"],
  };

  // Initialize our service with any options it requires
  app.use("/microcontroller", new Microcontroller(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("microcontroller");

  service.hooks(hooks);
}
