import { ModelIdentifier, Model, ModelsCache } from './types'

class ModelStore {
  private static instance?: ModelStore = undefined
  private cache: ModelsCache = {}

  public get(id: ModelIdentifier): Model | undefined {
    return this.cache[id.type]?.[id.id]
  }

  public set(id: ModelIdentifier, model: Model): void {
    this.cache[id.type] = this.cache[id.type] ?? {}
    this.cache[id.type][id.id] = model
  }

  public static getInstance(): ModelStore {
    if (this.instance === undefined) {
      this.instance = new ModelStore()
    }
    return this.instance
  }
}

export const BrickdocModelStore = ModelStore.getInstance()
