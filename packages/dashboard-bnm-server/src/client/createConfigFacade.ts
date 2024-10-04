import { BagConfigurationProvider } from './BagConfigurationProvider';
import { ConfigServerFacade, IConfigServerFacade } from './ConfigServerFacade';
import { ConfigurationNotifier } from './ConfigurationNotifier';
import { PasswordConfigurationProvider } from './PasswordConfigurationProvider';

export function createConfigFacade(): IConfigServerFacade {
  const bagConfigProvider = new BagConfigurationProvider({ });
  const passwordConfigProvider = new PasswordConfigurationProvider({ });
  const configurationNotifier = new ConfigurationNotifier();

  return new ConfigServerFacade({ passwordConfigProvider, bagConfigProvider, configurationNotifier });
}