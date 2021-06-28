import { CollabNetworkAdapter } from 'packages/brickdoc-editor/src/extensions'

export const GraphqlProvider: CollabNetworkAdapter = {
  async connect(version, callbacks) {
    return {
      commit: data => {
        console.log(data)
        callbacks.onReceivedCommit({ ...data, v: data.v + 1 })
      },
      disconnect() {}
    }
  }
}
