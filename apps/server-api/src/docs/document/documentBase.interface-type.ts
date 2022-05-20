import { Field, InterfaceType } from '@nestjs/graphql'
import { UUID } from '../../common/scalars'

@InterfaceType()
export abstract class DocumentBase {
  @Field(type => UUID, { description: 'Document Id' })
  id: string


  @Field(type => String, { description: 'Document Current State', nullable: true })
  state: string | null


  @Field(type => UUID, { description: 'Document Current State UUID', nullable: true })
  stateId: string | null
}