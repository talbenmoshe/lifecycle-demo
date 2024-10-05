import { initHealthRouter, initArtifactsRouter } from "./routers";
import { router } from "./utils";

export function createRouter() {
  return router({
    health: initHealthRouter(),
    artifacts: initArtifactsRouter(),
  });
}

export { createContext } from "./context";
