import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { Comment } from './comment.model'
import { BigInteger } from '../../common/scalars/BigInteger.scalar'
import { Creator } from './creator.model'

@Injectable()
@ObjectType({ description: "users' conversation inside a discussion" })
export class Conversation {
  @Field(() => BigInteger, {
    description: 'primary key'
  })
  public id: BigInt

  @Field(() => [String], {
    description: 'related editor discussion mark ids'
  })
  public mark_ids: string[]

  @Field(() => [String], {
    description: 'related editor discussion block ids'
  })
  public block_ids: string[]

  @Field(() => String)
  public page_id: string

  @Field(() => BigInteger)
  public space_id: BigInt

  @Field(() => String)
  public state: string

  @Field(() => Creator)
  public creator: Creator

  @Field(() => [Comment])
  public comments: Comment[]

  @Field(() => [Int])
  public latest_reply_at: Date

  @Field(() => Date)
  public created_at: Date
}
