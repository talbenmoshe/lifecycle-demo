import { ConfigValue, IConfigurationProvider } from './ConfigServerFacade';

export interface IBagConfigurationProvider extends IConfigurationProvider {

}

export class BagConfigurationProvider implements IBagConfigurationProvider {
  constructor(private initialData: Record<string, string>) {

  }

  getConfiguration(artifactId: string, key: string): Promise<ConfigValue> {
    return Promise.resolve(this.initialData[key]);
  }

  setConfiguration(artifactId: string, key: string, value: string): Promise<void> {
    this.initialData[key] = value;

    return Promise.resolve();
  }
}