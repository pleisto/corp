import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Conversation } from './conversation.model'
import { CreateConversationInput } from './createConversation.input'

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(spaceId: bigint, pageId: string): Promise<Conversation[]> {
    return await this.prisma.discussion_conversations.findMany({
      where: {
        page_id: pageId,
        space_id: spaceId
      },
      include: {
        comments: {
          orderBy: {
            created_at: 'asc'
          },
          take: 4
        },
        creator: true
      }
    })
  }

  public async create(createData: CreateConversationInput): Promise<Conversation> {
    // TODO: get current user from session
    const creatorId = createData.creatorId
    const conversation = await this.prisma.discussion_conversations.create({
      data: {
        space_id: createData.spaceId,
        page_id: createData.pageId,
        mark_ids: createData.markIds,
        block_ids: createData.blockIds,
        creator_id: creatorId,
        latest_reply_at: new Date(),
        comments: {
          create: [
            {
              creator_id: creatorId,
              content: createData.comment.content
            }
          ]
        }
      },
      include: {
        comments: true,
        creator: true
      }
    })

    return conversation
  }

  public async resolve(conversationId: bigint): Promise<void> {
    await this.prisma.discussion_conversations.update({
      where: {
        id: conversationId
      },
      data: {
        state: 'RESOLVED'
      }
    })
  }

  public async open(conversationId: bigint): Promise<void> {
    await this.prisma.discussion_conversations.update({
      where: {
        id: conversationId
      },
      data: {
        state: 'OPENDED'
      }
    })
  }
}
