// eslint-disable-next-line @typescript-eslint/no-var-requires
const conf = require('../../../../config/default.config.json');
import ConnectionList from '../entities/conn.entity';
export const config = {
  local: {
    type: 'mysql',
    ...conf,
    timezone: '+08:00',
    logging: false,
    entities: [ConnectionList],
    synchronize: true,
  },
};
