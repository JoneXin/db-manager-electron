import {
  getConnectionList,
  newConnection,
  deleteConnection,
  testConnection,
  updateConnection,
} from '../../api/connection';
import { batchDelete, batchTrucate, query, showDatabases } from '../../api/database';
import { getTableList } from '../../api/table';
import { ConnectionConf, UpdateConnectionConf } from '../../api/connection/model';
import { defineStore } from 'pinia';
import { store } from '../../store';
import { handleTransformSql } from '../../utils/tool';
import { BatchClearConf, TrucateClearConf } from '../../typings';

interface dbType {
  connectionList: Array<ConnectionConf>;
  currentOperatoeConnInfo: UpdateConnectionConf;
  currentDbListInfo: [];
  currentSearchResult: any[];
  currentSearchResultColum: [];
  treeData: Array<TreeConf>;
  sql: string;
  loadingTree: boolean;
  selectDbTreeNode: [];
  taskQueue: [];
  currentCommandDbName: string;
}
interface TreeConf {
  title: string;
  key: string;
  disabled?: boolean;
}

export const useDbStore = defineStore({
  id: 'db',
  state: (): dbType => ({
    connectionList: [],
    currentOperatoeConnInfo: {} as ConnectionConf,
    currentDbListInfo: [],
    currentSearchResult: [],
    currentSearchResultColum: [],
    treeData: [] as Array<TreeConf>,
    sql: '',
    loadingTree: false,
    selectDbTreeNode: [] as any,
    taskQueue: [],
    currentCommandDbName: '',
  }),
  getters: {},
  actions: {
    async getConnectionList() {
      const connList = await getConnectionList();
      this.connectionList = connList;
      return connList;
    },
    /**
     * 新增
     * ../..param connConf
     * ../..returns
     */
    async newConnection(connConf: ConnectionConf) {
      await newConnection(connConf);
      return await this.getConnectionList();
    },
    /**
     * 更新
     * ../..param updateConf
     * ../..returns
     */
    async updateConnection(updateConf: UpdateConnectionConf) {
      await updateConnection(updateConf);
      return await this.getConnectionList();
    },
    /**
     * 删除
     * ../..param uid
     */
    async delConnection(uid: number | undefined) {
      await deleteConnection(uid);
      return await this.getConnectionList();
    },
    /**
     * 测试
     * ../..param connConf
     * ../..returns
     */
    async testConnection(connConf: ConnectionConf) {
      return await testConnection(connConf);
    },
    /**
     * 获取当前点击的数据库列表
     * ../..returns
     */
    async getDatabasesList(): Promise<void> {
      this.loadingTree = true;
      this.currentDbListInfo = await showDatabases(this.currentOperatoeConnInfo);
      this.treeData = this.currentDbListInfo.map((item: string, index) => ({
        title: item,
        key: String(index),
        disabled:
          item == 'mysql' ||
            item == 'sys' ||
            item == 'performance_schema' ||
            item == 'information_schema'
            ? true
            : false,
      }));
      this.loadingTree = false;
    },
    /**
     * 查询Sql
     * ../..param dbName
     * ../..param query_content
     * ../..returns
     */
    async queryBySql(dbName?: string, query_content?: string) {
      let database = '';
      let query_contents = '';
      // 校验默认查询数据库
      if (this.currentCommandDbName) {
        database = this.currentCommandDbName;
        query_contents = handleTransformSql(this.sql, database);
      } else {
        database = dbName || '';
        query_contents = query_content || this.sql;
      }

      //query
      const { list, fields } = await query({
        ...this.currentOperatoeConnInfo,
        database,
        query_content: query_contents,
      });
      this.currentSearchResultColum = fields.map((item: any) => ({
        ...item,
        align: 'left ',
        width: 120,
        resizable: true,
        rowDrag: true,
      }));
      this.currentSearchResult = list;
    },
    /**
     * 获取当前连接对象下 对应数据库下的所有表
     * ../..param dbName
     * ../..returns
     */
    async getTableList(dbName: string): Promise<Array<string>> {
      return await getTableList({ ...this.currentOperatoeConnInfo, database: dbName });
    },
    /**
     * 设置当前活跃连接对象
     * ../..param connectName
     */
    setCurrentOperatoeConnInfo(connectName: string) {
      this.connectionList.forEach((item) => {
        if (item.connection_name == connectName) {
          this.currentOperatoeConnInfo = item;
        }
      });
    },
    /**
     * 清空当前活跃连接对象
     */
    clearCacheConnInfo() {
      for (const key in this.currentOperatoeConnInfo) {
        key !== 'port' &&
          key !== 'user' &&
          (this.currentOperatoeConnInfo[key as keyof ConnectionConf] = '');
      }
    },
    /**
     * 根据连接名 获取此连接的对象信息
     * ../..param connName
     * ../..returns
     */
    getConnectionInfoByConnName(connName: string) {
      const connInfo = this.connectionList.filter((item) => item.connection_name == connName);
      return connInfo[0];
    },

    /**
     * 当前命令行选中数据库名
     * ../..param dbName
     */
    setCurrentCommandb(dbName: string) {
      this.currentCommandDbName = dbName;
    },

    /**
     * 批量删除库表
     * ../..param delItem
     */
    async handleDel(delItem: Array<BatchClearConf>) {
      return await batchDelete(delItem, this.currentOperatoeConnInfo);
      // 刷寻数据
    },
    /**
     * 批量清空库表
     * ../..param delItem
     */
    async handleTrucate(trucateItem: Array<TrucateClearConf>) {
      return await batchTrucate(trucateItem, this.currentOperatoeConnInfo);
    },
  },
});

export function useLocaleStoreWithOut() {
  return useDbStore(store);
}
