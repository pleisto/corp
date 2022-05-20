import { ObjectType } from '@nestjs/graphql'
import { DocumentBase } from './documentBase.interface-type'

@ObjectType({
  description: "Brickdoc Document",
  implements: () => [DocumentBase]
})
export class Document {
  id: string
  state: string | null
  stateId: string | null

  // @Field(type => String, { description: 'Document Title Text', nullable: true })
  // title: string | null

  // @Field(type => String, { description: 'Document Content Text', nullable: true })
  // content: string | null
}