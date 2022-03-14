import { Field, ObjectType } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { Conversation } from './conversation.model'

@Injectable()
@ObjectType({ description: "users' discussion about doc" })
export class Discussion {
  @Field(type => [Conversation], {
    description: 'conversations'
  })
  public conversations: Conversation[]

  constructor(conversations: Conversation[]) {
    this.conversations = conversations
  }
}
