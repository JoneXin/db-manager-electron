import { request } from '../../utils/axios/request';

interface TreeListConf {
  root: number;
  path: string;
}
// 获取数据库列表
export function getFileChilren(params: TreeListConf) {
  return request({
    url: '/file/list',
    method: 'get',
    params,
  });
}

export function getFileDetail(path: string) {
  return request({
    url: '/file/detail',
    method: 'get',
    params: { path },
  });
}
