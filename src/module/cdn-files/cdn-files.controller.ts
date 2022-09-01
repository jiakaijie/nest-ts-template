import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CdnFilesService } from './cdn-files.service';
import { CreateCdnFileDto } from './dto/create-cdn-file.dto';

@Controller('cdnfiles')
export class CdnFilesController {
  constructor(private readonly cdnFilesService: CdnFilesService) {}

  @Get('cdnFileList')
  findList(@Query() queryData) {
    return this.cdnFilesService.findList(queryData);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  create(@UploadedFiles() files, @Body() bodyData) {
    return this.cdnFilesService.upload(files, bodyData);
  }

  @Get('fileTypeList')
  fileTypeList(@Query() queryData) {
    return this.cdnFilesService.fileTypeList(queryData);
  }
}
