import { Field, InputType } from '@nestjs/graphql'
import { UUID } from '../../common/scalars'

@InputType({
  description: "Sync Document Input"
})
export class SyncDocumentInput {
  @Field(type => UUID, { description: 'Document Id' })
  id: string

  @Field(type => String, { description: 'Operator UUID' })
  operatorId: string

  @Field(type => String, { description: 'Document Full State' })
  state: string

  @Field(type => UUID, { description: 'State Id' })
  stateId: string

  @Field(type => UUID, { description: 'Previous State Id', nullable: true })
  previousStateId: string

  @Field(type => String, { description: 'State Update Only', nullable: true })
  updates: string
}
