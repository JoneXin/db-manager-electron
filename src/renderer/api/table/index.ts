import { CreateTableConf } from './../../typings';
import { request } from '../../utils/axios/request';
import { DatabaseConf } from './model';
import { ConnectionConf } from '../connection/model';
// 获取数据库列表
export function getTableList(databaseConf: DatabaseConf) {
  return request({
    url: '/table/list',
    method: 'post',
    data: databaseConf,
  });
}

/**
 * 新增表
 * @param info
 * @param connConf
 * @returns
 */
export function createTable(info: CreateTableConf, connConf: ConnectionConf) {
  return request({
    url: '/table/create',
    method: 'post',
    data: { createConf: info, connConf },
  });
}

/**
 * 获取表的详细细腻
 * @param info
 * @param connConf
 */
export function getTableDetail(
  info: { database: string; table: string },
  connConf: ConnectionConf,
) {
  return request({
    url: '/table/detial',
    method: 'post',
    data: { info, connConf },
  });
}
