export const mysqlTypeOptions = [
  { value: 'TINYINT' },
  { value: 'SMALLINT' },
  { value: 'MEDIUMINT' },
  { value: 'INT' },
  { value: 'BIGINT' },
  { value: 'FLOAT' },
  { value: 'DOUBLE' },
  { value: 'DECIMAL' },
  { value: 'DATE' },
  { value: 'TIME' },
  { value: 'YEAR' },
  { value: 'DATETIME' },
  { value: 'TIMESTAMP' },
  { value: 'CHAR' },
  { value: 'VARCHAR' },
  { value: 'TINYTEXT' },
  { value: 'TINYBLOB' },
  { value: 'BLOB' },
  { value: 'TEXT' },
  { value: 'MEDIUMBLOB' },
  { value: 'MEDIUMTEXT' },
  { value: 'LONGBLOB' },
  { value: 'LONGTEXT' },
];

export const mysqlIndexType = [
  {
    value: 'NORMAL',
  },
  {
    value: 'FULLTEXT',
  },
  {
    value: 'SPATIAL',
  },
  {
    value: 'UNIQUE',
  },
];

export const mysqlIndexFunc = [
  {
    value: 'BTREE',
  },
  {
    value: 'HASH',
  },
];
