import { z } from "zod";

export const Artifact = z.object({
  id: z.string().readonly(),
  ga_version: z.string().optional(),
  rc_versions: z.string().array().optional(),
});

export const GetArtifactRequest = z.object({
  artifact_id: z.string().optional(),
});

export const GetArtifactResponse = z.object({
  artifact: Artifact,
});

export const UpdateArtifactRequest = z.object({
  artifact_id: z.string().optional(),
  ga_version: z.string().optional(),
});

export const UpdateArtifactResponse = z.object({
  artifact: Artifact,
});
