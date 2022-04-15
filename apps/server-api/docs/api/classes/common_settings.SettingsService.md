# Class: SettingsService

[common/settings](../modules/common_settings.md).SettingsService

## Table of contents

### Constructors

- [constructor](common_settings.SettingsService.md#constructor)

### Properties

- [explorer](common_settings.SettingsService.md#explorer)

### Methods

- [findItemValue](common_settings.SettingsService.md#finditemvalue)
- [get](common_settings.SettingsService.md#get)
- [scopeWrapper](common_settings.SettingsService.md#scopewrapper)
- [update](common_settings.SettingsService.md#update)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new SettingsService**(`explorer`, `kms`, `pool`, `logger`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `explorer` | `ConfigMapExplorer` |
| `kms` | [`KMSService`](common_kms.KMSService.md) |
| `pool` | `DatabasePool` |
| `logger` | `PinoLogger` |

#### Defined in

common/settings/settings.service.ts:11

## Properties

### <a id="explorer" name="explorer"></a> explorer

• `Readonly` **explorer**: `ConfigMapExplorer`

## Methods

### <a id="finditemvalue" name="finditemvalue"></a> findItemValue

▸ `Protected` **findItemValue**<`T`\>(`item`, `scope`): `Promise`<[`SettingsItem`](../interfaces/common_settings.SettingsItem.md)<`T`\>\>

find a setting item by key and scope

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`SettingsItem`](../interfaces/common_settings.SettingsItem.md)<`T`\> |
| `scope` | `string` |

#### Returns

`Promise`<[`SettingsItem`](../interfaces/common_settings.SettingsItem.md)<`T`\>\>

#### Defined in

common/settings/settings.service.ts:66

___

### <a id="get" name="get"></a> get

▸ **get**<`I`, `K`\>(`key`, `scope?`): `Promise`<`undefined` \| `K`\>

Get a setting value

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `I` |
| `K` | extends `string` \| `number` \| `symbol` = keyof `I` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `scope?` | `string` |

#### Returns

`Promise`<`undefined` \| `K`\>

#### Defined in

common/settings/settings.service.ts:23

___

### <a id="scopewrapper" name="scopewrapper"></a> scopeWrapper

▸ `Protected` **scopeWrapper**(`scope`): `string`

Make sure that the scope must be a descendant of the root node

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `undefined` \| `string` |

#### Returns

`string`

#### Defined in

common/settings/settings.service.ts:57

___

### <a id="update" name="update"></a> update

▸ **update**<`I`, `K`\>(`key`, `value`, `scope?`): `Promise`<`boolean`\>

Update a setting value on the database

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `I` |
| `K` | extends `string` \| `number` \| `symbol` = keyof `I` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |
| `value` | `I`[`K`] |
| `scope?` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

common/settings/settings.service.ts:35
