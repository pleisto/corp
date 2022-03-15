import { Field, ObjectType } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { GraphQLJSONObject } from 'graphql-type-json'
import { BigInteger } from '../../common/scalars/BigInteger.scalar'

@Injectable()
@ObjectType({ description: "users' comments inside a conversation" })
export class Comment {
  @Field(() => BigInteger, {
    description: 'primary key'
  })
  public id: BigInt

  @Field(() => GraphQLJSONObject, {
    description: 'comment content'
  })
  public content: any

  @Field(() => BigInteger, {})
  public creator_id: BigInt

  @Field(() => BigInteger, {})
  public conversation_id: BigInt

  @Field(() => Date, {})
  public created_at: Date
}
