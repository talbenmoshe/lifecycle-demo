import { ArtifactId } from '../types/artifact';
import { IConfigurationClient } from './ConfigurationClient';
import { IStaticsProvider, StaticsProvider } from './StaticsProvider';

export interface IStaticsProviderFactory {
  getProvider(versionOverrides?: Record<ArtifactId, string>): IStaticsProvider;
}

export class StaticsProviderFactory implements IStaticsProviderFactory {
  constructor(private configurationClient: IConfigurationClient) {}

  getProvider(versionOverrides: Record<ArtifactId, string> = {}): IStaticsProvider {
    const staticsProvider: IStaticsProvider = new StaticsProvider(this.configurationClient, versionOverrides);

    return staticsProvider;
  }
}