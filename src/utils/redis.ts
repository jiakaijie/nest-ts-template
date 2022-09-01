// redis
import { createClient } from 'redis';

import config from '../config';

const host = config.redis.host;

let redisClient;
let connectCont = 0;

(async () => {
  const url = `redis://${host}`;
  console.log(`Redis ${url} 开始连接`);
  redisClient = createClient({
    url,
  });

  redisClient.on('error', (err) => {
    console.log(`Redis ${url} 连接失败`, err);
    connectCont++;
    if (connectCont === 2) {
      redisClient.quit();
    }
  });

  await redisClient.connect();
  console.log(`Redis ${url} 连接成功`);
})();

export default redisClient;
