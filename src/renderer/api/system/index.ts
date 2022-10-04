import { request } from '../../utils/axios/request';
import { ConnectionConf, QueryConf } from '../connection/model';

// 获取数据库列表
export function compareDbSynclist(
  originConnConf: ConnectionConf,
  aimConnConf: ConnectionConf,
  dbTreeList: any,
) {
  return request({
    url: '/sys/compare',
    method: 'post',
    data: {
      originConnConf,
      aimConnConf,
      dbTreeList,
    },
  });
}
