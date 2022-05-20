import { Module } from '@nestjs/common'
import { HashedID, URL, UUID } from './index'
@Module({
  providers: [HashedID, URL, UUID]
})
export class ScalarsModule {}
