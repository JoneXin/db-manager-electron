import {
  BatchClearConf,
  DelConf,
  TrucateConf,
  DbCreateDetail,
  DbCreate,
} from './../../typings';
import { ConnMysqlConf } from './../connection/conn.class';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbService } from './db.service';
import { DbQueryConfig, ExportConf } from './db.class';
import { SyncConf } from './db.dto';

@Controller('db')
export class DbController {
  constructor(private dbService: DbService) {}

  @Post('/list')
  async showDatabases(@Body() connConf: ConnMysqlConf) {
    return await this.dbService.getDblist(connConf);
  }

  @Post('/query')
  async querySql(@Body() queryObj: DbQueryConfig) {
    return await this.dbService.query(queryObj);
  }

  @Post('/sync')
  async syncDatabases(@Body() syncObj: SyncConf) {
    this.dbService.syncDatabases(syncObj);
    return true;
  }

  @Post('/export')
  async exportDbStruct(@Body() exportConf: ExportConf) {
    this.dbService.exportDbStruct(exportConf);
    return true;
  }

  @Post('/delete')
  async dropStruct(@Body() dropList: DelConf) {
    return this.dbService.dropStruct(dropList);
  }

  @Post('/trucate')
  async trucateStruct(@Body() trucateList: TrucateConf) {
    return this.dbService.trucateStruct(trucateList);
  }

  @Post('/dbcreate')
  async createDatabase(@Body() detail: DbCreate) {
    return this.dbService.createDatabase(detail);
  }
}
