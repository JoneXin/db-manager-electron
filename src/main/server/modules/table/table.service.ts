import { MysqlIndex, TableDetail } from './../../typings';
import { DatabaseConf } from './table.class';
import { Injectable, Param } from '@nestjs/common';
import { DbService } from '../database/db.service';
import { CreateTableConf, MysqlColum, TableCreate } from '../../typings';
import { transaction } from '../../utils/tool';

@Injectable()
export class TableService {
  constructor(private dbService: DbService) {}

  /**
   * 获取指定数据库下的所有表
   * @param dbName
   * @returns
   */
  async getTablelist(dbConf: DatabaseConf): Promise<Array<string>> {
    const conn = this.dbService.getCurrentConnHandle(dbConf);
    const [lists] = await conn.promise().query(`show tables from ${dbConf.database}`);
    return (lists as Array<any>).map((item) => item[`Tables_in_${dbConf.database}`]);
  }

  /**
   * 创建表
   * @param info
   */
  async createTable(info: TableCreate): Promise<any> {
    const { createConf, connConf } = info;
    const conn = this.dbService.getCurrentConnHandle(connConf);

    // 生成创建sql
    let createSql = `CREATE TABLE ${createConf.dbName}.${createConf.tableName} (`;

    // 创建item
    createConf.tableInfo.forEach((row: MysqlColum, i, arr) => {
      // 每行
      const tempStr = `${row.key} ${row.type}(${row.length}) ${row.isNull ? '' : 'NOT NULL'},`;
      createSql += tempStr;

      // 最后
      if (i == arr.length - 1) {
        // 加主键索引
        const indexArr = createConf.tableInfo.filter((v) => v.primaryKey).map((v) => v.key);

        // 有主键的
        if (indexArr.length) {
          const indexStr = indexArr.join(',');

          createSql += `PRIMARY KEY(${indexStr}) USING BTREE,`;
        }

        // 处理最后的逗号
        if (!createConf.indexInfo.length) {
          createSql = createSql.slice(0, createSql.length - 1);
        }
      }
    });

    // 创建索引
    createConf.indexInfo.forEach((indexRow: MysqlIndex, i, arr) => {
      console.log(indexRow.columeKey);

      const columekeyListStr = indexRow.columeKey.join(',');
      const tempStr = `${indexRow.type == 'NORMAL' ? '' : indexRow.type} INDEX ${
        indexRow.key
      }(${columekeyListStr}) USING ${indexRow.func}`;

      createSql += tempStr;

      if (i == arr.length - 1) {
        createSql.slice(0, createSql.length - 1);
      }
    });

    // 加尾椎
    createSql +=
      ') ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;';

    try {
      await conn.promise().query(createSql);
    } catch (_) {
      console.log(_);
      return {
        code: 400,
        value: _,
      };
    }

    return true;
  }

  /**
   * 获取表详情
   * @param param
   */
  async tableDetail(param: TableDetail) {
    const { info, connConf } = param;
    const conn = this.dbService.getCurrentConnHandle(connConf);

    const tabelDetail = await transaction(conn, [
      `select
        COLUMN_NAME as 'key',
        DATA_TYPE as 'type',
        CHARACTER_MAXIMUM_LENGTH as 'length',
        IS_NULLABLE as 'isNull',
        COLUMN_TYPE as 'type_len',
        COLUMN_COMMENT as 'annotation'
        FROM INFORMATION_SCHEMA.COLUMNS
      where table_name = "${info.table}" and TABLE_SCHEMA = "${info.database}"`,
    ]);
    const indexDetail = await transaction(conn, [`show index from ${info.database}.${info.table}`]);
    console.log(tabelDetail, indexDetail);
  }
}
