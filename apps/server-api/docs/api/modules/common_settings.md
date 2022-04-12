# Module: common/settings

## Table of contents

### Classes

- [SettingsModule](../classes/common_settings.SettingsModule.md)

### Interfaces

- [ItemOptions](../interfaces/common_settings.ItemOptions.md)

### Variables

- [CONFIG\_MAP\_NAME\_METADATA](common_settings.md#config_map_name_metadata)
- [ITEM\_OPTIONS\_METADATA](common_settings.md#item_options_metadata)

### Functions

- [ConfigMap](common_settings.md#configmap)
- [Item](common_settings.md#item)

## Variables

### <a id="config_map_name_metadata" name="config_map_name_metadata"></a> CONFIG\_MAP\_NAME\_METADATA

• `Const` **CONFIG\_MAP\_NAME\_METADATA**: `string`

#### Defined in

common/settings/settings.interface.ts:2

___

### <a id="item_options_metadata" name="item_options_metadata"></a> ITEM\_OPTIONS\_METADATA

• `Const` **ITEM\_OPTIONS\_METADATA**: `string`

#### Defined in

common/settings/settings.interface.ts:3

## Functions

### <a id="configmap" name="configmap"></a> ConfigMap

▸ **ConfigMap**(`namespace`): `ClassDecorator`

#### Parameters

| Name | Type |
| :------ | :------ |
| `namespace` | `string` |

#### Returns

`ClassDecorator`

#### Defined in

common/settings/config-map.decorator.ts:4

___

### <a id="item" name="item"></a> Item

▸ **Item**(`options`): `PropertyDecorator` & `MethodDecorator`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ItemOptions`](../interfaces/common_settings.ItemOptions.md) |

#### Returns

`PropertyDecorator` & `MethodDecorator`

#### Defined in

common/settings/item.decorator.ts:3
