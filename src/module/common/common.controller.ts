import { Controller, Query, Get, Post, Body, Res } from '@nestjs/common';
import { CommonService } from './common.service';
import { logSwitchDto, changeLogSwitchDto } from './dto/common.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('logSwitch')
  logConfig(@Query() queryData: logSwitchDto): Promise<any> {
    return this.commonService.getLogConfig(queryData);
  }

  @Post('changeLogSwitch')
  changeLogConfig(@Body() bodyData: changeLogSwitchDto): Promise<any> {
    return this.commonService.changeLogConfig(bodyData);
  }

  @Get('exportPdf')
  exportPdf(@Query() queryData: any, @Res() res: any) {
    return this.commonService.generatePdf(queryData, res);
  }

  @Get('getCdnFils')
  getCdnFils() {
    return this.commonService.getCdnFils();
  }
}
