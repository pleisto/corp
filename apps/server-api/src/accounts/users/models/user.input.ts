import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UserInput {
  @Field({ nullable: false })
  id: number
}
