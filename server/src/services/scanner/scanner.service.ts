// Initializes the `scannertest2` service on path `/scannertest-2`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { Scanner } from "./scanner.class";
import hooks from "./scanner.hooks";

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    scanner: Scanner & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    events: ["status"],
  };

  // Initialize our service with any options it requires
  app.use("/scanner", new Scanner(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("scanner");

  service.hooks(hooks);
}
