import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TableService } from './table.service';
import { DatabaseConf } from './table.class';
import { CreateTableConf, TableCreate, TableDetail } from '../../typings';

@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post('/list')
  async showDatabases(@Body() dbConf: DatabaseConf) {
    return await this.tableService.getTablelist(dbConf);
  }

  @Post('/create')
  async createTable(@Body() info: TableCreate) {
    return await this.tableService.createTable(info);
  }

  @Post('/detial')
  async tableDetail(@Body() info: TableDetail) {
    return await this.tableService.tableDetail(info);
  }
}
