import { InputType, Field } from '@nestjs/graphql'
import { BigInteger } from '../../common/scalars/BigInteger.scalar'
import { CreateCommentInput } from './createComment.input'

@InputType()
export class CreateConversationInput {
  @Field(() => BigInteger)
  spaceId: bigint

  @Field(() => String)
  pageId: string

  @Field(() => [String], { nullable: true })
  markIds?: string[]

  @Field(() => [String], { nullable: true })
  blockIds?: string[]

  @Field(() => BigInteger)
  creatorId: bigint

  @Field(() => CreateCommentInput)
  comment: CreateCommentInput
}
