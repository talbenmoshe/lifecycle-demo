import { findOneArtifact } from "../../../mock-data/utils";
import {
  GetArtifactRequest,
  GetArtifactResponse,
  ListArtifactsResponse,
  UpdateArtifactRequest,
  UpdateArtifactResponse,
} from "../../../api/artifacts.api";
import { publicProcedure, router } from "../../utils";
import { TRPCError } from "@trpc/server";
import { createConfigurationClient } from "../../../configuration-client";
import { mockArtifacts } from "../../../mock-data";

export function initArtifactsRouter() {
  return router({
    getArtifact: publicProcedure
      .input(GetArtifactRequest)
      .output(GetArtifactResponse)
      .query(async ({ input }) => {
        const { artifactId } = input;
        if (!artifactId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing artifactId",
          });
        }
        const { getConfiguration } = createConfigurationClient();
        const staticsVersion = await getConfiguration(
          artifactId,
          "staticsVersion"
        );
        const artifact = await findOneArtifact(artifactId);
        if (!artifact) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Artifact not found",
          });
        }
        return {
          artifact: {
            ...artifact,
            staticsVersion,
          },
        };
      }),
    updateArtifact: publicProcedure
      .input(UpdateArtifactRequest)
      .output(UpdateArtifactResponse)
      .query(async ({ input }) => {
        const { artifactId } = input;
        if (!artifactId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing artifactId",
          });
        }
        const { setConfiguration } = createConfigurationClient();
        const { newStaticsVersion } = input;
        const artifact = await findOneArtifact(artifactId);
        if (!artifact) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Artifact not found",
          });
        }
        if (!artifact.rcVersions.includes(newStaticsVersion)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid statics version",
          });
        }
        await setConfiguration(artifactId, "staticsVersion", newStaticsVersion);
        return {
          artifact: { ...artifact, staticsVersion: newStaticsVersion },
        };
      }),
    list: publicProcedure.output(ListArtifactsResponse).query(() => {
      return {
        artifacts: Object.values(mockArtifacts),
      };
    }),
  });
}
