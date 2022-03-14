import { Field, ObjectType } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { BigInteger } from '../../common/scalars/BigInteger.scalar'

@Injectable()
@ObjectType({ description: 'creator of conversation or comment' })
export class Creator {
  @Field(() => BigInteger, {
    description: 'primary key'
  })
  public id: BigInt
}
