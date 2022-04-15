# Interface: ItemOptions

[common/settings](../modules/common_settings.md).ItemOptions

## Table of contents

### Properties

- [clientExposed](common_settings.ItemOptions.md#clientexposed)
- [encrypted](common_settings.ItemOptions.md#encrypted)
- [static](common_settings.ItemOptions.md#static)

## Properties

### <a id="clientexposed" name="clientexposed"></a> clientExposed

• `Optional` **clientExposed**: `boolean`

The public fields will be exposed to the client.

#### Defined in

[common/settings/settings.interface.ts:12](https://github.com/brickdoc/brickdoc/blob/master/apps/server-api/src/common/settings/settings.interface.ts#L12)

___

### <a id="encrypted" name="encrypted"></a> encrypted

• `Optional` **encrypted**: `boolean`

Enabled data at rest encryption.
if `static` is true, encrypted will be ignored.

#### Defined in

[common/settings/settings.interface.ts:18](https://github.com/brickdoc/brickdoc/blob/master/apps/server-api/src/common/settings/settings.interface.ts#L18)

___

### <a id="static" name="static"></a> static

• `Optional` **static**: `boolean`

Static item will not read/write from/to the database.
It's value will be get from the ConfigMap file directly.

#### Defined in

[common/settings/settings.interface.ts:24](https://github.com/brickdoc/brickdoc/blob/master/apps/server-api/src/common/settings/settings.interface.ts#L24)
