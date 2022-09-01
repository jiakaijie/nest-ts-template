import { Module } from '@nestjs/common';
import { CommonCodeService } from './common-code.service';
import { CommonCodeController } from './common-code.controller';

@Module({
  controllers: [CommonCodeController],
  providers: [CommonCodeService]
})
export class CommonCodeModule {}
