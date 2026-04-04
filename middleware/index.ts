import { RouteController } from "nextfastapi";
import { FlowContext } from "./flow";
import SessionInjector from "./injector/session";

const controller = new RouteController<FlowContext>().use(SessionInjector);

controller.onError((err, _, $, next) => {
  console.log(err);

  return next();
});

export default controller;
