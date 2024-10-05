import { z } from "zod";
import { Artifact } from "../api/artifacts.api";

export const ArtifactWithoutGAVersion = Artifact.omit({ staticsVersion: true });

export const mockArtifacts: Record<
  string,
  z.infer<typeof ArtifactWithoutGAVersion>
> = {
  "1": {
    id: "com.placer.dashboard-bnm",
    rcVersions: ["1.0.0", "1.0.1", "1.0.2"],
  },
  "2": {
    id: "com.placer.mock-artifact-a",
    rcVersions: ["1.0.1", "1.0.2", "1.0.3"],
  },
  "3": {
    id: "com.placer.mock-artifact-c",
    rcVersions: ["1.0.2", "1.0.3", "1.0.4"],
  },
};
