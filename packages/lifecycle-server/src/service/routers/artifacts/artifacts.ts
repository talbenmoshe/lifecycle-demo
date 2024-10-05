import {
  GetArtifactRequest,
  GetArtifactResponse,
  UpdateArtifactRequest,
  UpdateArtifactResponse,
} from "../../../api/artifacts.api";
import { publicProcedure, router } from "../../utils";
import { TRPCError } from "@trpc/server";

export function initArtifactsRouter() {
  return router({
    getArtifact: publicProcedure
      .input(GetArtifactRequest)
      .output(GetArtifactResponse)
      .query(async ({ input }) => {
        if (!input.artifact_id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing artifact_id",
          });
        }

        return {
          artifact: {
            id: input.artifact_id, //TODO
            ga_version: "1.0.0", //TODO
            rc_versions: [], //TODO
          },
        };
      }),
    updateArtifact: publicProcedure
      .input(UpdateArtifactRequest)
      .output(UpdateArtifactResponse)
      .query(async ({ input }) => {
        if (!input.artifact_id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing artifact_id",
          });
        }

        return {
          artifact: {
            id: input.artifact_id, //TODO
            ga_version: "1.0.0", //TODO
            rc_versions: [], //TODO
          },
        };
      }),
  });
}
