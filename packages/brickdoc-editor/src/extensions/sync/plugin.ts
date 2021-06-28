import type { Node, Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { Mapping } from 'prosemirror-transform'
import { InflightCommit } from './inflight-commit'
import { CollabSession } from './network'
import { Rebaseable, transformToRebaseable } from './rebaseable'
import { receiveCommitTransaction } from './receive-commit'
import { Extension } from '@tiptap/core'
import key from './plugin-key'

export function isSynced(pluginState: PluginState) {
  return pluginState.inflightCommit == null && pluginState.localSteps.length === 0
}

export interface PluginState<S extends Schema = Schema> {
  localSteps: Array<Rebaseable<S>>

  inflightCommit?: InflightCommit<S>

  lastSyncedDoc: Node<S>

  /** a list of mappings for each version, in reverse order.
   *
   * versionMappings[i] = mapping from (syncedVersion - i - 1) to (syncedVersion - i)
   * versionMappings[0] = mapping from (syncedVersion - 1) to (syncedVersion)
   * versionMappings[1] = mapping from (syncedVersion - 2) to (syncedVersion - 1)
   * versionMappings[2] = mapping from (syncedVersion - 3) to (syncedVersion - 2)
   * ...
   */
  versionMappings: Mapping[]

  unsyncedMapping: Mapping

  syncedVersion: number
}

export interface CollabOptions {
  readonly startingVersion: number

  /** How many miliseconds to throttle commit sending. (default: 200ms) */
  readonly commitThrottleMs?: number
}

const PLUGIN_NAME = 'sync'
// https://prosemirror.net/docs/ref/#state.PluginSpec
export const SyncExtension = Extension.create({
  name: PLUGIN_NAME,

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key,
        state: {
          init: (_config, state) => ({
            localSteps: [],
            unsyncedMapping: new Mapping(),
            versionMappings: [],
            syncedVersion: 0,
            lastSyncedDoc: state.doc
          }),
          apply(tr, oldState) {
            let state: PluginState | undefined = tr.getMeta(key)
            if (state == null) {
              state = { ...oldState }

              if (tr.docChanged) {
                state.unsyncedMapping = state.unsyncedMapping.slice(0)
                state.unsyncedMapping.appendMapping(tr.mapping)
                state.localSteps = state.localSteps.concat(transformToRebaseable(tr))
              }
            }

            return state
          }
        },
        view(view) {
          const session = new CollabSession(
            0,
            {
              onClose: () => {},
              processCommit(commit) {
                const tr = receiveCommitTransaction(view.state, commit)
                view.dispatch(tr)
              },
              getSendableCommit() {
                const inflightCommit = InflightCommit.fromState(view.state)
                if (inflightCommit) return inflightCommit.sendable()
              }
            },
            {
              commitThrottleMs: 200
            }
          )

          return {
            update(_) {
              session.commit()
            },
            async destroy() {
              session.close()
            }
          }
        }
      })
    ]
  }
})
