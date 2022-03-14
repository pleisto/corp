import { Module } from '@nestjs/common'
import { ConversationService } from './conversation.service'
import { CommentService } from './comment.service'
import { DiscussionResolver } from './discussion.resolver'

@Module({
  providers: [DiscussionResolver, ConversationService, CommentService]
})
export class DiscussionModule {}
