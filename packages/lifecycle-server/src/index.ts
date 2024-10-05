import { createRouter } from "./service";
import { startServer } from "./server";

export type LifecycleServerRouter = ReturnType<typeof createRouter>;

startServer();
