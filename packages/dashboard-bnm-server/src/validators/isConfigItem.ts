import Ajv from 'ajv';
import { ConfigType, IConfigItem } from '../client/ConfigServerFacade';

const ajv = new Ajv();

const schema = {
  type: 'object',
  properties: {
    artifact: { type: 'string' },
    type: {
      type: 'string',
      enum: Object.values(ConfigType)
    },
    key: { type: 'string' }
  },
  required: [
    'artifact',
    'type',
    'key'
  ],
  additionalProperties: false
};

const validate = ajv.compile(schema);

export function isConfigItem(value: any): value is IConfigItem {
  return validate(value);
}