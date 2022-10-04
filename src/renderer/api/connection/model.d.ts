// 数据库连接配置
export interface ConnectionConf {
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

export interface UpdateConnectionConf extends ConnectionConf {
  uid?: number;
}


export interface QueryConf extends ConnectionConf{
  database?: string;
  query_content?: string
}