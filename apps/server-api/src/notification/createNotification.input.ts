import { InputType, Field } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { BigInteger } from '../common/scalars/BigInteger.scalar'

@InputType()
export class CreateNotificationInput {
  @Field(() => BigInteger, { nullable: true })
  public user_id?: bigint

  @Field(() => String, {
    description: 'notification template type'
  })
  public notification_type: string

  @Field(() => GraphQLJSONObject, {
    description: 'notification template data',
    nullable: true
  })
  public data?: any

  @Field(() => String, {})
  public source_id: string

  @Field(() => String, {})
  public source_type: string
}
