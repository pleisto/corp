import { Field, InputType, Int } from '@nestjs/graphql'

@InputType({ description: 'Update User' })
export class UserUpdate {
  @Field(() => Int)
  age: number

  @Field()
  name: string

  @Field()
  breed: string
}
