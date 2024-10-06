import { ArtifactWithoutGAVersion, mockArtifacts } from ".";

export async function findOneArtifact(
  artifactId: string
): Promise<Zod.infer<typeof ArtifactWithoutGAVersion>> {
  return Object.values(mockArtifacts).find(
    (artifact) => artifact.id === artifactId
  );
}
