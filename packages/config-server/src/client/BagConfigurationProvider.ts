import { ConfigValue, IConfigurationProvider } from './ConfigServerFacade';

export interface IBagConfigurationProvider extends IConfigurationProvider {

}

export class BagConfigurationProvider implements IBagConfigurationProvider {
  constructor(private initialData: Record<string, Record<string, string>>) {

  }

  getConfiguration(artifactId: string, key: string): Promise<ConfigValue> {
    return Promise.resolve(this.initialData[artifactId]?.[key]);
  }

  setConfiguration(artifactId: string, key: string, value: string): Promise<void> {
    if (!this.initialData[artifactId]) {
      this.initialData[artifactId] = {};
    }
    this.initialData[artifactId][key] = value;

    return Promise.resolve();
  }
}