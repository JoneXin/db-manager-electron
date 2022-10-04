import { MysqlColum } from '../typings';

/**
 * 格式化 check 结果
 * @param checkList
 */
export const formatCheckedNodes = (checkList: any, dbStore: any): any => {
  // 记录父
  let curNodes = {};
  let SyncDbTableList = [];
  for (let i = 0; i < checkList.length; i++) {
    const item = checkList[i];
    // db nodes
    if (String(Number(item.key)) !== 'NaN') {
      SyncDbTableList.push({
        name: item.title,
        attr: 'db',
        key: item.key,
        syncAllTable: true,
        children: [] as any,
      });
      curNodes = item;
      continue;
    }
    //@ts-ignore
    // 没选库 只选了表，自动把库搞进去
    if (parseInt(item.key) != curNodes.key) {
      // 判断是否SyncDbTableList已经有了
      let cur = SyncDbTableList[SyncDbTableList.length - 1] || {};
      const curDbNodes = dbStore.treeData.find((j: any) => Number(j.key) == parseInt(item.key));
      // 只同步 库中的部分表
      if (cur.key == parseInt(item.key)) {
        cur.children.push({
          name: item.title,
          attr: 'table',
          key: item.key,
        });
      } else {
        SyncDbTableList.push({
          name: curDbNodes?.title,
          attr: 'db',
          key: curDbNodes?.key,
          syncAllTable: false,
          children: [
            {
              name: item.title,
              attr: 'table',
              key: item.key,
            },
          ],
        });
      }
    }
  }
  return SyncDbTableList;
};

/**
 *  蒋sql查询转换到 某个数据库下
 * @param sql
 * @param dbName
 * @returns sql
 */
export const handleTransformSql = (sql: string, dbName: string): string => {
  const sqlArr = sql.split(' ').filter((v) => !!v);
  let index = Infinity;
  console.log(sql, dbName);

  return sqlArr
    .map((v, i) => {
      if (v == 'from') {
        index = i;
      }
      if (index + 1 == i) {
        return ` ${dbName}.${v} `;
      }

      return v;
    })
    .join(' ');
};

export const formartTableInfo = (mysqlTableInfo: Array<MysqlColum>) => {
  return mysqlTableInfo.map((row) => {
    return {
      ...row,
      isNull: row.isNull == '是' ? true : false,
      primaryKey: row.primaryKey == '是' ? true : false,
      virtual: row.virtual == '是' ? true : false,
    };
  });
};
