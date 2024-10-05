import axios from "axios";
import { z } from "zod";
import { Artifact } from "../api/artifacts.api";

type ArtifactId = z.infer<typeof Artifact>["id"];

export function createConfigurationClient() {
  return {
    async getConfiguration(
      artifact: ArtifactId,
      key: string
    ): Promise<string | undefined> {
      const finalUrl = `http://localhost:3000/api/config/${artifact}/bag/${key}`;
      const result = await axios.get<{ value: string }>(finalUrl);

      return result.data.value;
    },

    async setConfiguration(
      artifact: ArtifactId,
      key: string,
      value: string
    ): Promise<void> {
      return axios.post(
        `http://localhost:3000/api/config/${artifact}/bag/${key}`,
        { value }
      );
    },
  };
}
