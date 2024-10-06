import z from "zod";
import { DEV_SERVER_PORT } from "../constants";

export const envSchema = z.object({
  PORT: z.coerce.number().int().default(DEV_SERVER_PORT),
  NODE_ENV: z.string().default("development"),
  HOST: z.string().default("localhost"),
  LIFECYCLE_CLIENT_URL: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
