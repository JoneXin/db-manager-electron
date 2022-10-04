import { DbCreateDetail } from './../../typings';
import { BatchClearConf, TrucateClearConf } from '../../typings';
import { request } from '../../utils/axios/request';
import { ConnectionConf, QueryConf } from '../connection/model';
import { ExportConf, SyncConf } from './model';
// 获取数据库列表
export function getDblist(connectionName: string) {
  return request({
    url: '/db/getdblist',
    method: 'get',
    params: connectionName,
  });
}

// 获取数据库列表
export function showDatabases(connConf: ConnectionConf) {
  return request({
    url: '/db/list',
    method: 'post',
    data: connConf,
  });
}

// 获取数据库列表
export function query(connConf: QueryConf) {
  return request({
    url: '/db/query',
    method: 'post',
    data: connConf,
  });
}

// 获取数据库列表
export function sendSyncDbRequest(syncConf: SyncConf) {
  return request({
    url: '/db/sync',
    method: 'post',
    data: syncConf,
  });
}

// 获取数据库列表
export function sendExportRequest(exportConf: ExportConf) {
  return request({
    url: '/db/export',
    method: 'post',
    data: exportConf,
  });
}

// 创建数据库
export function createDatabase(info: DbCreateDetail, connConf: ConnectionConf) {
  return request({
    url: '/db/dbcreate',
    method: 'post',
    data: { info, connConf },
  });
}

// 批量删除
export function batchDelete(delItem: Array<BatchClearConf>, connConf: ConnectionConf) {
  return request({
    url: '/db/delete',
    method: 'post',
    data: { delItem, connConf },
  });
}

// 批量清除
export function batchTrucate(trucateItem: Array<TrucateClearConf>, connConf: ConnectionConf) {
  return request({
    url: '/db/trucate',
    method: 'post',
    data: { trucateItem, connConf },
  });
}
