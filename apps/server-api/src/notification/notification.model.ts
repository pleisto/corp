import { Field, ObjectType } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { BigInteger } from '../common/scalars/BigInteger.scalar'
import { GraphQLJSONObject } from 'graphql-type-json'

@Injectable()
@ObjectType({ description: "user's notification record" })
export class Notification {
  @Field(() => BigInteger, {
    description: 'primary key'
  })
  public id: BigInt

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
  public state: string

  @Field(() => String, {})
  public source_id: string

  @Field(() => String, {})
  public source_type: string

  @Field(() => Date, {})
  public created_at: Date
}
