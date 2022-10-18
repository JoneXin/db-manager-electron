import { FileDetail } from './../../typings';
import { Injectable } from '@nestjs/common';
import FileServer from '../../utils/file_server';
import { FileListType } from './file.class';
import { FileDto } from './file.dto';

@Injectable()
export class FileService {
  constructor() {}

  getFileChilren(param: FileDto): Array<FileListType> | boolean {
    // 获取跟目录disk 列表
    if (param.root == 1) {
      return FileServer.getRootDiskList();
    }
    return FileServer.getFileChildren(param.path);
  }

  // 文件详细信息
  getFileDetail(path: string): FileDetail | boolean {
    return FileServer.getFileDetailInfo(path);
  }
}
