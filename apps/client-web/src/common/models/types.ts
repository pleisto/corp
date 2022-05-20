export interface ModelIdentifier {
  type: string
  id: string
}

export interface Model {}

export interface ModelsCache {
  [type: string]: {
    [id: string]: Model
  }
}
