import { Module } from '@nestjs/common';
import { CdnFilesService } from './cdn-files.service';
import { CdnFilesController } from './cdn-files.controller';

@Module({
  controllers: [CdnFilesController],
  providers: [CdnFilesService],
})
export class CdnFilesModule {}
