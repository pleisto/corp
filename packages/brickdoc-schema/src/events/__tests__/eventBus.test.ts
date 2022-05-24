import { BrickdocEventBus } from '../eventBus'
import { event } from '../event'

describe('BrickdocEventBus', () => {
  beforeEach(() => {
    BrickdocEventBus.reset()
  })
  it('can subscribe and dispatch', async () => {
    const testEvent = event<string>()('testEvent', payload => {
      return { id: payload }
    })

    const testResult = new Map<string, boolean>()

    BrickdocEventBus.subscribe(testEvent, async e => {
      testResult.set('testEventHit', true)
      testResult.set('testEventHitRight', e.id === 'right')
    })

    BrickdocEventBus.subscribe(
      testEvent,
      async e => {
        testResult.set('testEventHitMiddle', true)
      },
      { eventId: 'middle' }
    )

    expect(testEvent.toString()).toEqual('testEvent')

    expect(testResult.get('testEventHit')).not.toBe(true)
    expect(testResult.get('testEventHitRight')).not.toBe(true)

    await BrickdocEventBus.dispatch(testEvent('left'))

    expect(testResult.get('testEventHit')).toBe(true)
    expect(testResult.get('testEventHitRight')).not.toBe(true)

    await BrickdocEventBus.dispatch(testEvent('right'))

    expect(testResult.get('testEventHit')).toBe(true)
    expect(testResult.get('testEventHitRight')).toBe(true)

    expect(testResult.get('testEventHitMiddle')).not.toBe(true)
    await BrickdocEventBus.dispatch(testEvent('middle'))
    expect(testResult.get('testEventHitMiddle')).toBe(true)
  })

  it('can unsubscribe', async () => {
    const testEvent = event<string>()('testEvent', payload => {
      return { id: payload }
    })

    const testResult = new Map<string, boolean>()

    const { unsubscribe } = BrickdocEventBus.subscribe(testEvent, async e => {
      testResult.set('testEventHit', true)
    })

    unsubscribe()
    await BrickdocEventBus.dispatch(testEvent(''))

    expect(testResult.get('testEventHit')).not.toBe(true)
  })

  it('can subscribe sticky event', async () => {
    const testEvent = event<string>({ sticky: true })('testEvent', payload => {
      return { id: payload }
    })

    const testResult = new Map<string, boolean>()

    await BrickdocEventBus.dispatch(testEvent(''))

    BrickdocEventBus.subscribe(testEvent, async e => {
      testResult.set('testEventHit', true)
    })

    BrickdocEventBus.subscribe(testEvent, async e => {
      testResult.set('testEventSecondHit', true)
    })

    expect(testResult.get('testEventHit')).toBe(true)
    expect(testResult.get('testEventSecondHit')).not.toBe(true)
  })

  it('can dispatch subscriber in order of priority', async () => {
    const priorityEvent = event<string>()('priorityEvent')

    let str = ''

    BrickdocEventBus.subscribe(
      priorityEvent,
      async e => {
        str += `b${e.payload}`
      },
      { priority: 10 }
    )

    BrickdocEventBus.subscribe(
      priorityEvent,
      async e => {
        str += `c${e.payload}`
      },
      { priority: 15 }
    )

    BrickdocEventBus.subscribe(
      priorityEvent,
      async e => {
        str += `a${e.payload}`
      },
      { priority: 5 }
    )

    await BrickdocEventBus.dispatch(priorityEvent('1'))

    expect(str).toEqual('a1b1c1')
  })

  it('can only subscribe once with same subscribeId', async () => {
    const subscribeIdEvent = event<number>()('subscribeIdEvent')

    let counter = 0

    BrickdocEventBus.subscribe(
      subscribeIdEvent,
      async e => {
        counter += e.payload as number
      },
      { subscribeId: 'subscribeA' }
    )

    BrickdocEventBus.subscribe(
      subscribeIdEvent,
      async e => {
        counter += (e.payload as number) * 2
      },
      { subscribeId: 'subscribeA' }
    )

    BrickdocEventBus.subscribe(
      subscribeIdEvent,
      async e => {
        counter += (e.payload as number) * 4
      },
      { subscribeId: 'subscribeB' }
    )

    await BrickdocEventBus.dispatch(subscribeIdEvent(1))

    expect(counter).toEqual(6)
  })
})
