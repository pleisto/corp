import { Field, InputType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { BigInteger } from '../../common/scalars/BigInteger.scalar'

@InputType()
export class UpdateCommentInput {
  @Field(() => BigInteger)
  id: bigint

  @Field(() => GraphQLJSONObject, {
    description: 'comment content'
  })
  content: any
}
