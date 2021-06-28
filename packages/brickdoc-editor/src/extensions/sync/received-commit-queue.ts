import type { CommitData } from './network'

/** Reorders commits received out of order */
export default class ReceivedCommitQueue<T extends { v: number } = CommitData> {
  private queue: {
    [version: number]: T | undefined
  } = {}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  nextVersion: number
  private readonly onCommit: (commit: T) => void

  constructor(startingVersion: number, onCommit: (commit: T) => void) {
    this.nextVersion = startingVersion + 1
    this.onCommit = onCommit
  }

  receive(commit: T) {
    if (this.nextVersion > commit.v) return // This is an old commit - ignore it.

    if (this.nextVersion === commit.v) {
      // eslint-disable-next-line no-plusplus
      this.nextVersion++
      this.onCommit(commit)

      // dequeue commits
      // eslint-disable-next-line no-plusplus
      for (let c; (c = this.queue[this.nextVersion]); this.nextVersion++) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.queue[this.nextVersion]
        this.onCommit(c)
      }
    } else {
      this.queue[commit.v] = commit // Future commit, queue for later
    }
  }
}
