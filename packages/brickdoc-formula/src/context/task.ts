import { NamespaceId, SyncVariableTask, VariableId, VariableTask, VariableValue } from '../types'
import { v4 as uuid } from 'uuid'
import { BrickdocEventBus, FormulaTaskCompleted } from '@brickdoc/schema'

type TaskInput = (
  | {
      async: false
      variableValue: VariableValue
    }
  | {
      async: true
      variableValue: Promise<VariableValue>
    }
) & {
  namespaceId: NamespaceId
  variableId: VariableId
}

export const createVariableTask = ({ async, variableValue, namespaceId, variableId }: TaskInput): VariableTask => {
  const now = new Date()
  if (async) {
    let task: VariableTask = {
      async,
      variableValue,
      uuid: uuid(),
      execStartTime: now,
      execEndTime: undefined
    }

    void variableValue.then(value => {
      task = { ...task, variableValue: value, execEndTime: new Date(), async: false }
      BrickdocEventBus.dispatch(FormulaTaskCompleted({ ...task, namespaceId, variableId }))
    })
    return task
  } else {
    const task: SyncVariableTask = {
      async,
      variableValue,
      uuid: uuid(),
      execStartTime: now,
      execEndTime: now
    }
    return task
  }
}
