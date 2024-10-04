import { ArtifactId } from '../types/artifact';
import { IConfigurationClient } from './ConfigurationClient';
import urlJoin from 'url-join';

export interface IStaticsProvider {
  getArtifactVersion(artifactId: string): Promise<string>;
  getArtifactBasePath(artifactId: string): Promise<string>;
  getArtifactFile(artifactId: string, fileName: string): Promise<string>;
}

export class StaticsProvider implements IStaticsProvider {
  constructor(private configurationClient: IConfigurationClient, private versionOverrides: Record<ArtifactId, string> = {}) {}
  async getArtifactVersion(artifactId: string): Promise<string> {
    let version: string | undefined = this.versionOverrides[artifactId];

    if (!version) {
      version = await this.configurationClient.getConfiguration(artifactId, 'staticsVersion');
    }

    if (!version) {
      throw new Error(`No version found for artifact ${artifactId}`);
    }

    return version;
  }
  async getArtifactBasePath(artifactId: string): Promise<string> {
    const [version, baseStaticsUrl] = await Promise.all([
      this.getArtifactVersion(artifactId),
      this.configurationClient.getConfiguration(artifactId, 'baseStaticsUrl'),
      Promise.resolve()
    ]);

    if (!baseStaticsUrl) {
      throw new Error(`No base statics URL found for artifact ${artifactId}`);
    }
    const url = urlJoin(baseStaticsUrl, artifactId, version);

    return url;
  }
  async getArtifactFile(artifactId: string, fileName: string): Promise<string> {
    try {
      const basePath = await this.getArtifactBasePath(artifactId);
      const url = urlJoin(basePath, fileName);

      return url;
    } catch (error) {
      return '';
    }
  }
}