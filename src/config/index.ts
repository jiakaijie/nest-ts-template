import { resolve } from 'path';
import fs = require('fs-extra');
import YAML = require('yaml');

import { envConfig, nodeEnv } from '../utils/commonHash';

let config: any = {};

const typeConfig = (type) => {
  try {
    const envTypeConfigYaml = fs.readFileSync(
      resolve(__dirname, `./${type}/index.yaml`),
      'utf8',
    );
    return YAML.parse(envTypeConfigYaml);
  } catch (err) {
    console.error(err);
    return {};
  }
};

if (nodeEnv === envConfig.development) {
  config = typeConfig('dev');
} else if (nodeEnv === envConfig.test) {
  config = typeConfig('test');
} else if (nodeEnv === envConfig.production) {
  config = typeConfig('pro');
} else {
  config = typeConfig('dev');
}

console.log(`${nodeEnv} config`, config);

export default config;
