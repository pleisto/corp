import 'reflect-metadata'
import { CONFIG_MAP_NAME_METADATA } from './settings.interface'

export function ConfigMap(namespace: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(CONFIG_MAP_NAME_METADATA, namespace, target)
  }
}
