import { ObjectType } from '@nestjs/graphql'
import { DocumentBase } from './documentBase.interface-type'

@ObjectType({
  description: "Sync Result Document",
  implements: () => [DocumentBase]
})
export class SyncDocumentResultDocument {
  id: string
  state: string | null
  stateId: string | null
}