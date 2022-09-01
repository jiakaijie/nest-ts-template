import { PartialType } from '@nestjs/mapped-types';
import { CreateCdnFileDto } from './create-cdn-file.dto';

export class UpdateCdnFileDto extends PartialType(CreateCdnFileDto) {}
