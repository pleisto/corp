import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateNotificationInput } from './createNotification.input'
import { Notification } from './notification.model'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(state?: Prisma.Enumnotification_stateFilter): Promise<Notification[]> {
    // TODO: get current user from session
    const userId = 0
    return await this.prisma.notifications.findMany({
      where: {
        user_id: userId,
        state
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 20
    })
  }

  public async create(createData: CreateNotificationInput): Promise<Notification> {
    // TODO: get current user from session
    const userId = createData.user_id ?? 0
    return await this.prisma.notifications.create({
      data: {
        user_id: userId,
        notification_type: createData.notification_type,
        data: createData.data,
        source_id: createData.source_id,
        source_type: createData.source_type
      }
    })
  }

  public async read(notificationId: bigint | null): Promise<void> {
    // TODO: get current user from session
    const userId = 0

    const where: Prisma.notificationsUpdateManyWithWhereWithoutUserInput['where'] = {}

    if (notificationId === null) {
      where.user_id = userId
    } else {
      where.id = notificationId
    }

    await this.prisma.notifications.updateMany({
      where,
      data: {
        state: 'READ'
      }
    })
  }
}
