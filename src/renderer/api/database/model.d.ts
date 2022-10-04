import { ConnectionConf } from './../connection/model.d';
export interface SyncConf {
  dbTreeList: Array<any>;
  aimConnInfo: ConnectionConf;
  orginConnInfo: ConnectionConf;
  isSyncTableData: boolean;
  isForceUpdate: boolean;
}

export interface ExportConf {
  connInfo: ConnectionConf;
  isExportTableData: boolean;
  isExportPureStruct: boolean;
  isAutoCreateDb: boolean;
  isForceUpdateDb: boolean;
  isForceUpdateTable: boolean;
  dbTreeList: Array<any>;
  path: string;
}
