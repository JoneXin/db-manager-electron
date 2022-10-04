import { ConnectionConf } from '../connection/model';

export interface DatabaseConf extends ConnectionConf {
  database: string;
}
