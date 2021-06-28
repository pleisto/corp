import type { Schema } from 'prosemirror-model'
import type { EditorState } from 'prosemirror-state'
import type { PluginState } from './plugin'
import key from './plugin-key'
import { compactRebaseable, Rebaseable } from './rebaseable'
import { CommitData } from './network'

const maxStepsPerCommit = 10

export class InflightCommit<S extends Schema> {
  readonly baseVersion: number
  readonly steps: Array<Rebaseable<S>>
  readonly ref: string

  constructor(steps: Array<Rebaseable<S>>, baseVersion: number, ref = InflightCommit.random()) {
    this.baseVersion = baseVersion
    this.steps = steps
    this.ref = ref
  }

  sendable(): CommitData {
    return {
      v: this.baseVersion,
      ref: this.ref,
      steps: this.steps.map(step => step.step.toJSON())
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static random() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static fromState<S extends Schema>(editorState: EditorState<S>): InflightCommit<S> | undefined {
    const state: PluginState<S> = key.getState(editorState)

    // we may only have one inflight commit at a time
    if (state.inflightCommit) return
    if (state.localSteps.length === 0) return

    const sendableSteps = compactRebaseable(state.localSteps)
    state.localSteps = sendableSteps.splice(maxStepsPerCommit - 1)

    state.inflightCommit = new InflightCommit(sendableSteps, state.syncedVersion)

    return state.inflightCommit
  }
}
