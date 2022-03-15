import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Comment } from './comment.model'
import { CreateCommentInput } from './createComment.input'
import { UpdateCommentInput } from './updateComment.input'

const DEFAULT_TAKE = 30

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(
    conversationId: bigint,
    commentCursor?: bigint,
    take: number = DEFAULT_TAKE
  ): Promise<Comment[]> {
    return await this.prisma.discussion_comments.findMany({
      where: {
        conversation_id: conversationId
      },
      include: {
        creator: true
      },
      orderBy: {
        created_at: 'asc'
      },
      cursor: {
        id: commentCursor
      },
      take,
      skip: commentCursor ? 1 : 0
    })
  }

  public async create(createData: CreateCommentInput): Promise<Comment> {
    // TODO: get current user from session
    const creatorId = createData.creatorId
    const conversation = await this.prisma.discussion_conversations.findUnique({
      where: {
        id: createData.conversationId
      }
    })

    if (!conversation)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'conversation not found'
        },
        HttpStatus.NOT_FOUND
      )

    const updateConversationData: Prisma.discussion_conversationsUpdateArgs['data'] = {
      latest_reply_at: new Date()
    }

    if (!conversation.interlocutor_ids.includes(creatorId)) {
      updateConversationData.interlocutor_ids = {
        push: creatorId
      }
    }

    const [comment] = await this.prisma.$transaction([
      this.prisma.discussion_comments.create({
        data: {
          creator_id: creatorId,
          conversation_id: conversation.id,
          content: createData.content
        }
      }),
      this.prisma.discussion_conversations.update({
        where: {
          id: createData.conversationId
        },
        data: updateConversationData
      })
    ])

    return comment
  }

  public async update(createData: UpdateCommentInput): Promise<Comment> {
    const comment = await this.prisma.discussion_comments.update({
      where: {
        id: createData.id
      },
      data: {
        content: createData.content
      }
    })

    return comment
  }
}
