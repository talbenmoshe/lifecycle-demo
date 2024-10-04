export enum ConfigType {
  PASSWORD = 'password',
  BAG = 'bag'
}

export type ConfigValue = string | undefined;

export interface IConfigItem {
  artifact: string;
  type: ConfigType;
  key: string;
}

export interface IConfigServerFacade {
  getConfigItem(config: IConfigItem): Promise<ConfigValue>;
  setConfigItem(config: IConfigItem, value: ConfigValue): Promise<void>;
}

export interface IConfigurationProvider {
  getConfiguration(artifactId: string, key: string): Promise<ConfigValue>;
  setConfiguration(artifactId: string, key: string, value: ConfigValue): Promise<void>;
}

export interface IConfigurationNotifier {
  notify(artifactId: string, key: string, value: ConfigValue): Promise<void>;
}

export interface IConfigurationInitialData {
  passwordConfigProvider: IConfigurationProvider;
  bagConfigProvider: IConfigurationProvider;
  configurationNotifier: IConfigurationNotifier;
}

export class ConfigServerFacade implements IConfigServerFacade {
  constructor(private readonly config: IConfigurationInitialData) {
  }

  private getProviderByType(type: ConfigType): IConfigurationProvider {
    switch (type) {
      case ConfigType.PASSWORD:
        return this.config.passwordConfigProvider;
      case ConfigType.BAG:
        return this.config.bagConfigProvider;
    }
  }

  getConfigItem(config: IConfigItem): Promise<ConfigValue> {
    return this.getProviderByType(config.type).getConfiguration(config.artifact, config.key);
  }

  async setConfigItem(config: IConfigItem, value: ConfigValue): Promise<void> {
    await this.getProviderByType(config.type).setConfiguration(config.artifact, config.key, value);

    await this.config.configurationNotifier.notify(config.artifact, config.key, value);
  }
}