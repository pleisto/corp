export interface Event<EventPayload = {}> {
  type: string
  payload: EventPayload
  configure: EventConfigure
  id?: string
}

export interface EventConfigure {
  sticky?: boolean
}

export interface EventType<EventPayload = {}> {
  eventType: string
  (args: EventPayload): Event<EventPayload>
}

export type EventCallback<EventPayload, EventResult> = (event: Event<EventPayload>) => EventResult

export type EventConstructor<T> = (payload: T) => { [key: string]: any }

export interface EventSubscribeConfig {
  eventId?: string
  scope?: string
  priority?: number
  subscribeId?: string
}

export interface EventSubscriber<EventPayload, EventResult> {
  callback: EventCallback<EventPayload, EventResult>
  config: EventSubscribeConfig
}

export interface EventSubscribers<EventPayload, EventResult> {
  [key: string]: Array<EventSubscriber<EventPayload, EventResult>> | undefined
}

export interface EventIdSubscribers<EventPayload, EventResult> {
  [key: string]: EventSubscribers<EventPayload, EventResult> | undefined
}

export interface EventsPool {
  [key: string]: Event[] | undefined
}

export interface EventSubscribed {
  unsubscribe: () => void
}
