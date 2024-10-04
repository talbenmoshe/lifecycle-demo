import { ArtifactId } from '../types/artifact';
import axios from 'axios';

export interface IConfigurationClient {
  getConfiguration(artifact: ArtifactId, key: string): Promise<string | undefined>;
  setConfiguration(artifact: ArtifactId, key: string, value: string): Promise<void>;
}

export class ConfigurationClient implements IConfigurationClient {
  async getConfiguration(artifact: ArtifactId, key: string): Promise<string | undefined> {
    const finalUrl = `http://localhost:3000/api/config/${artifact}/bag/${key}`;
    const result = await axios.get<{value: string}>(finalUrl);

    return result.data.value;
  }

  setConfiguration(artifact: ArtifactId, key: string, value: string): Promise<void> {
    return axios.post(`http://localhost:3000/api/config/${artifact}/bag/${key}`, { value });
  }
}