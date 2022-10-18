export interface ConnMysqlConf {
  // 连接名
  connection_name: string;
  // 主机
  host: string;
  // 端口
  port: string;
  // 用户名
  user: string;
  // 密码
  password: string;
}

export interface ExportConf {
  isExportTableData: boolean;
  isExportPureStruct: boolean;
  isAutoCreateDb: boolean;
  isForceUpdateDb: boolean;
  isForceUpdateTable: boolean;
}

export interface FileDetail {
  updateTime: Date;
  size: number;
  exInfo: string;
}

export interface BatchClearConf {
  delDb: boolean;
  dbName: string;
  tableList: Array<string>;
}

export interface BatchTrucateConf {
  trucateDb: boolean;
  dbName: string;
  tableList: Array<string>;
}

export interface DelConf {
  delItem: Array<BatchClearConf>;
  connConf: ConnMysqlConf;
}
export interface TrucateConf {
  trucateItem: Array<BatchTrucateConf>;
  connConf: ConnMysqlConf;
}

export interface DbCreateDetail {
  database: string;
  encode: string;
  sortRules: string;
}

export interface DbCreate {
  info: DbCreateDetail;
  connConf: ConnMysqlConf;
}

export interface MysqlColum {
  key: string;
  type: string;
  length: number;
  decimalPoint: number;
  isNull: string;
  virtual: string;
  primaryKey: string;
  annotation: string;
}

export interface MysqlIndex {
  key: string;
  columeKey: Array<string>;
  type: string;
  func: string;
  annotation: string;
}

export interface CreateTableConf {
  tableInfo: Array<MysqlColum>;
  indexInfo: Array<MysqlIndex>;
  tableName: string;
  dbName: string;
}

export interface TableCreate {
  createConf: CreateTableConf;
  connConf: ConnMysqlConf;
}

export interface TableDetail {
  info: { database: string; table: string };
  connConf: ConnMysqlConf;
}
