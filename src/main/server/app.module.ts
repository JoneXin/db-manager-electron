import { SysModule } from './modules/system/sys.moudel';
import { TableModule } from './modules/table/table.moudel';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnModule } from './modules/connection/conn.moudel';
import { DbModule } from './modules/database/db.moudel';
import { WsModule } from './modules/ws/ws.module';
import { FileModule } from './modules/file/file.module';
import { config } from './config/default.config';
import { SpannerConnectionOptions } from 'typeorm/driver/spanner/SpannerConnectionOptions';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      useFactory: () => config.local as Partial<SpannerConnectionOptions>,
    }),
    ConnModule,
    DbModule,
    TableModule,
    SysModule,
    WsModule,
    FileModule,
  ],
})
export class AppModule {}
