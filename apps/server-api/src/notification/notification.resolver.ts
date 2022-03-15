import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { BigInteger } from '../common/scalars/BigInteger.scalar'
import { CreateNotificationInput } from './createNotification.input'
import { Notification } from './notification.model'
import { NotificationService } from './notification.service'

@Resolver((of: unknown) => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(returns => [Notification], {
    description: "query users' notifications"
  })
  async notifications(
    @Args('state', { type: () => String }) state: Prisma.Enumnotification_stateFilter
  ): Promise<Notification[]> {
    return await this.notificationService.findAll(state)
  }

  @Mutation(returns => Notification, {
    description: 'create new notification for user'
  })
  async createNotification(
    @Args('data', { type: () => CreateNotificationInput }) createData: CreateNotificationInput
  ): Promise<Notification> {
    return await this.notificationService.create(createData)
  }

  @Mutation(returns => Notification, {
    description: 'mark notification as read'
  })
  async readNotification(
    @Args('notificationId', { type: () => BigInteger, nullable: true }) notificationId: bigint | null
  ): Promise<Boolean> {
    await this.notificationService.read(notificationId)
    return true
  }
}
