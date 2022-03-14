import { Discussion } from './discussion.model'
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { ConversationService } from './conversation.service'
import { Conversation } from './conversation.model'
import { CreateConversationInput } from './createConversation.input'
import { BigInteger } from '../../common/scalars/BigInteger.scalar'
import { CreateCommentInput } from './createComment.input'
import { CommentService } from './comment.service'
import { Comment } from './comment.model'
import { UpdateCommentInput } from './updateComment.input'

@Resolver((of: unknown) => Discussion)
export class DiscussionResolver {
  constructor(
    private readonly conversionService: ConversationService,
    private readonly commentService: CommentService
  ) {}

  @Query(returns => Discussion, {
    description: "query discussion's conversations depend on parameters"
  })
  async discussion(
    @Args('spaceId', { type: () => BigInteger }) spaceId: bigint,
    @Args('pageId', { type: () => String }) pageId: string
  ): Promise<Discussion> {
    const conversations = await this.conversionService.findAll(spaceId, pageId)
    return new Discussion(conversations)
  }

  @Mutation(returns => Boolean, {
    description: 'mark conversation as resovled state'
  })
  async resolveConversation(
    @Args('conversationId', { type: () => BigInteger }) conversationId: bigint
  ): Promise<boolean> {
    await this.conversionService.resolve(conversationId)
    return true
  }

  @Mutation(returns => Boolean, {
    description: 'mark conversation as opened state'
  })
  async openConversation(@Args('conversationId', { type: () => BigInteger }) conversationId: bigint): Promise<boolean> {
    await this.conversionService.open(conversationId)
    return true
  }

  @Mutation(returns => Conversation, {
    description: 'create new conversation inside a discussion'
  })
  async createConversation(
    @Args('data', { type: () => CreateConversationInput })
    createData: CreateConversationInput
  ): Promise<Conversation> {
    return await this.conversionService.create(createData)
  }

  @Query(returns => Discussion, {
    description: 'query comments inside a conversation'
  })
  async comments(
    @Args('conversationId', {
      type: () => BigInteger
    })
    conversationId: bigint,
    @Args('commentCursor', {
      description: 'comment id cursor, used for pagination',
      type: () => BigInteger,
      nullable: true
    })
    commentCursor?: bigint,
    @Args('take', {
      description: 'describe how much comments will be token. Default is 30',
      type: () => Number,
      nullable: true
    })
    take?: number
  ): Promise<Comment[]> {
    return await this.commentService.findAll(conversationId, commentCursor, take)
  }

  @Mutation(returns => Comment, {
    description: 'create new comment inside a conversation'
  })
  async createComment(
    @Args('data', { type: () => CreateCommentInput })
    createData: CreateCommentInput
  ): Promise<Comment> {
    return await this.commentService.create(createData)
  }

  @Mutation(returns => Comment, {
    description: 'update comment content inside a conversation'
  })
  async updateComment(
    @Args('data', { type: () => UpdateCommentInput })
    updateData: UpdateCommentInput
  ): Promise<Comment> {
    return await this.commentService.update(updateData)
  }
}
