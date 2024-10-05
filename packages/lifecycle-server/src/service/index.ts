import { initHealthRouter, initArtifactsRouter } from "./routers";
import { router } from "./utils";

export function createRouter() {
  return router({
    health: initHealthRouter(),
    report: initArtifactsRouter(),
  });
}

export { createContext } from "./context";
