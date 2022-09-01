import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommonCodeService } from './common-code.service';
import { CreateCommonCodeDto } from './dto/create-common-code.dto';
import { UpdateCommonCodeDto } from './dto/update-common-code.dto';

@Controller('commonCode')
export class CommonCodeController {
  constructor(private readonly commonCodeService: CommonCodeService) {}

  @Post()
  create(@Body() createCommonCodeDto: CreateCommonCodeDto) {
    return this.commonCodeService.create(createCommonCodeDto);
  }

  @Get()
  findAll(): Promise<any> {
    return this.commonCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommonCodeDto: UpdateCommonCodeDto) {
    return this.commonCodeService.update(+id, updateCommonCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonCodeService.remove(+id);
  }
}
