import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FileService } from './file.service';
import { FileDetailDto, FileDto } from './file.dto';
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('/list')
  async getFloderList(@Query() query: FileDto) {
    return await this.fileService.getFileChilren(query);
  }

  @Get('/detail')
  async getFileDetail(@Query() query: FileDetailDto) {
    return await this.fileService.getFileDetail(query.path);
  }
}
