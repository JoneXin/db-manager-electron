export interface BatchClearConf {
  delDb: boolean;
  dbName: string;
  tableList: Array<string>;
}

export interface TrucateClearConf {
  trucateDb: boolean;
  dbName: string;
  tableList: Array<string>;
}

export interface DbCreateDetail {
  database: string;
  encode: string;
  sortRules: string;
}

export interface MysqlColum {
  key: string;
  type: string;
  length: number;
  decimalPoint: number;
  isNull: string | boolean;
  virtual: string | boolean;
  primaryKey: string | boolean;
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

export interface AceTips {
  meta: string;
  caption: string;
  value: string;
  score: number;
}
