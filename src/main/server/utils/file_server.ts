// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readdirSync, stat } = require('fs');
import { StatOptions, statSync } from 'fs';
import fsPlus from 'fs-extra';
import { exec, exit } from 'shelljs';
import { FileDetail } from '../typings';
const Os = require('os');

interface FileListType {
  type: number;
  name: string;
  path: string;
}

export default class FileServer {
  /**
   * 获取指定文件夹夹下的路径
   * @param parentPath
   * @returns
   */
  static getFileChildren(parentPath: string): Array<FileListType> {
    const dirList = readdirSync(parentPath, { withFileTypes: true });

    console.log(dirList);

    // type : 1 文件 2 文件夹
    // name 文件或者文件夹名称
    return dirList.map((f) => ({
      type: f[Object.getOwnPropertySymbols(f)[0]],
      name: f.name,
      path: `${parentPath}/${f.name}`,
    }));
  }

  /**
   * 新建文件
   * @param parentPath
   * @param fileName
   * @returns
   */
  static newFile(parentPath: string, fileName: string): boolean {
    try {
      fsPlus.createFileSync(`${parentPath}/${fileName}`);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 新建文件夹
   * @param parentPath
   * @param floderName
   * @returns
   */
  static newFloder(parentPath: string, floderName: string): boolean {
    try {
      fsPlus.mkdirSync(`${parentPath}/${floderName}`);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 删除 文件或文件夹
   * @param filePath
   * @returns
   */
  static deleteFile(filePath: string): boolean {
    try {
      fsPlus.rmdirSync(filePath);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 重命名 文件或文件夹
   * @param filePath
   * @param newName
   * @returns
   */
  static renameFile(filePath: string, newName: string): boolean {
    try {
      fsPlus.renameSync(filePath, newName);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 移动 文件或者文件夹
   * @param filePath
   * @param newPath
   * @returns
   */
  static moveFile(filePath: string, newPath: string) {
    try {
      fsPlus.moveSync(filePath, newPath);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 获取 电脑盘符列表
   */
  static getRootDiskList(): Array<FileListType> | boolean {
    // windows
    if (Os.type() == 'Windows_NT') {
      // 查看磁盘列表
      const depict = exec('wmic logicaldisk get caption');

      // 脚本执行失败
      if (depict.code !== 0) {
        return false;
      }

      // 处理成数组
      return depict.split(':').reduce(
        (pre, cur, i, disk) => {
          if (i == disk.length - 1 || i == 0) {
            return pre;
          }
          return [
            ...pre,
            {
              name: `${cur.trim()}:/`,
              type: 2,
              path: `${cur.trim()}:/`,
            },
          ];
        },
        [
          {
            name: 'C:/',
            type: 2,
            path: 'C:/',
          },
        ],
      );
    }

    return [
      {
        type: 2,
        name: '/',
        path: '/',
      },
    ];
  }

  /**
   * 文件详细信息
   * @param filePath
   */
  static getFileDetailInfo(filePath: string): FileDetail | boolean {
    try {
      const stats = statSync(filePath);

      return {
        updateTime: stats.mtime,
        size: Number((stats.size / 1024).toFixed(2)),
        exInfo: JSON.stringify(stats),
      };
    } catch (_) {
      console.log(_);
      return false;
    }
  }
}
