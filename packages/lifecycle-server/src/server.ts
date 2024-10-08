import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { createContext, createRouter } from "./service";
import { ROUTER_PREFIX } from "./constants";
import { config, env } from "./config";

import "reflect-metadata";

export const startServer = async (): Promise<void> => {
  const server = fastify({
    logger: config[env.NODE_ENV].logger,
  });

  await server.register(fastifyTRPCPlugin, {
    prefix: ROUTER_PREFIX,
    trpcOptions: { router: createRouter(), createContext },
  });

  await server.register(sensible);

  await server.register(cors, {
    origin: env.LIFECYCLE_CLIENT_URL,
    credentials: true,
  });

  await server.register(helmet);

  try {
    await server.listen({ port: env.PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
