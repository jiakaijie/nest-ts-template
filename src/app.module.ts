import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './module/common/common.module';
import { CdnFilesModule } from './module/cdn-files/cdn-files.module';
import { FoldersModule } from './module/folders/folders.module';
import { CommonCodeModule } from './module/common-code/common-code.module';

@Module({
  imports: [CommonModule, CdnFilesModule, FoldersModule, CommonCodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
