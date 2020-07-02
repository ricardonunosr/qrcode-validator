// Initializes the `qrcode` service on path `/qrcode`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { Qrcode } from "./qrcode.class";
import createModel from "../../models/qrcode.model";
import hooks from "./qrcode.hooks";

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    qrcode: Qrcode & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
  };

  // Initialize our service with any options it requires
  app.use("/qrcode", new Qrcode(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("qrcode");

  service.hooks(hooks);
}
