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

  @Field(() => BigInteger, {
    description: 'creator id'
  })
  public creator_id: BigInt

  @Field(() => BigInteger, {
    description: 'conversation id'
  })
  public conversation_id: BigInt

  // id              BigInt                   @id @default(autoincrement())
  // content         Json
  // creator_id      BigInt
  // conversation    discussion_conversations @relation(fields: [conversation_id], references: [id])
  // conversation_id BigInt
  // created_at      DateTime                 @db.Timestamp(6)
  // updated_at      DateTime                 @db.Timestamp(6)
}
