import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { DiscoveryService } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { uniq } from '@brickdoc/active-support'
import { SettingsItem, ConfigMapProviders } from './settings.interface'
import { ConfigMapMetadataAccessor } from './config-map-metadata.accessor'

@Injectable()
export class ConfigMapExplorer implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataAccessor: ConfigMapMetadataAccessor
  ) {}

  onApplicationBootstrap(): void {
    // Check if all config maps namespaces are unique on application bootstrap
    if (uniq(this.allNamespaces()).length !== this.allNamespaces().length) {
      throw new Error(`Common/Settings: All config-map namespaces must be unique.
      namespace: ${this.allNamespaces().join(', ')}`)
    }
  }

  /**
   * Get all providers that have @ConfigMap() decorator
   * @returns ConfigMap providers InstanceWrapper[]
   */
  providers(): ConfigMapProviders {
    const result: ConfigMapProviders = {}
    this.discoveryService.getProviders().forEach((wrapper: InstanceWrapper) => {
      const namespace = this.metadataAccessor.getConfigMapNamespace(wrapper)
      // filter out providers that don't have @ConfigMap() decorator
      if (namespace) result[namespace] = wrapper
    })
    return result
  }

  /**
   * List all config maps namespaces from providers that have @ConfigMap() decorator
   */
  allNamespaces(): string[] {
    return Object.keys(this.providers())
  }

  /**
   * List all config maps items from providers that have @ConfigMap() decorator
   * @returns
   */
  allKeys(): string[] {
    return Object.entries(this.providers()).flatMap(([namespace, wrapper]) =>
      this.getItemNames(wrapper).map(name => `${namespace}.${name}`)
    )
  }

  /**
   * Get config map item by InstanceWrapper and name
   */
  getItem<T>(wrapper: InstanceWrapper, namespace: string, itemName: string): SettingsItem<T> | undefined {
    const options = this.metadataAccessor.getItemOptions(wrapper, itemName)
    if (!options) return undefined
    return {
      key: `${namespace}.${itemName}`,
      options,
      defaultValue: wrapper.instance[itemName]
    }
  }

  /**
   * Get config map item by key(namespace.itemName)
   */
  getItemByKey<T>(key: string): SettingsItem<T> | undefined {
    const keyArray = key.split('.')
    const namespace = keyArray.slice(0, -1).join('.')
    const itemName = keyArray.at(-1)!
    const provider = this.providers()[namespace]
    if (!provider) return undefined
    return this.getItem<T>(provider, namespace, itemName)
  }

  /**
   * Get all items from a given namespace
   */
  getItemsByNamespace<T>(namespace: string): Array<SettingsItem<T>> | undefined {
    const provider = this.providers()[namespace]
    if (!provider) return undefined
    return this.getItemNames(provider).map(name => this.getItem<T>(provider, namespace, name)!)
  }

  /**
   * Get all item names from a given InstanceWrapper
   * @param InstanceWrapper
   * @returns
   */
  getItemNames(wrapper: InstanceWrapper): string[] {
    const propertyNames = Object.getOwnPropertyNames(wrapper.instance)
    return propertyNames.filter(name => this.metadataAccessor.getItemOptions(wrapper, name))
  }
}
