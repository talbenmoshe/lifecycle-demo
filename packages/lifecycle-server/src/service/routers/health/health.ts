import { HealthCheckResponse } from "../../../api/health.api";
import { publicProcedure, router } from "../../utils";

export function initHealthRouter() {
  return router({
    healthCheck: publicProcedure.output(HealthCheckResponse).query(() => {
      return { status: "ok" };
    }),
  });
}
