import { ConfigValue, IConfigurationProvider } from './ConfigServerFacade';

export interface IPasswordConfigurationProvider extends IConfigurationProvider {

}

export class PasswordConfigurationProvider implements IPasswordConfigurationProvider {
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