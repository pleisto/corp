import { ObjectType, Field } from '@nestjs/graphql'
import { SyncDocumentResultDocument } from './syncDocumentResultDocument.object-type'

@ObjectType({
  description: "Sync Result"
})
export class SyncDocumentResult {
  @Field(type => SyncDocumentResultDocument)
  document: SyncDocumentResultDocument
}