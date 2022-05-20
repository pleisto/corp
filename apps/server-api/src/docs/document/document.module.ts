import { Module } from '@nestjs/common'
import { DocumentResolver } from './document.resolve'
import { DocumentService } from './document.service'

@Module({
  exports: [DocumentService],
  providers: [DocumentService, DocumentResolver]
})
export class DocumentModule {}
