import { z } from "zod";

export const Artifact = z.object({
  id: z.string().readonly(),
  staticsVersion: z.string().optional(),
  rcVersions: z.string().array().optional().readonly(),
});

export const GetArtifactRequest = z.object({
  artifactId: z.string().optional(),
});

export const GetArtifactResponse = z.object({
  artifact: Artifact,
});

export const UpdateArtifactRequest = z.object({
  artifactId: z.string().optional(),
  newStaticsVersion: z.string().optional(),
});

export const UpdateArtifactResponse = z.object({
  artifact: Artifact,
});
