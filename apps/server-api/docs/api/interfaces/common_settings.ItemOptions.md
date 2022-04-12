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

common/settings/settings.interface.ts:10

___

### <a id="encrypted" name="encrypted"></a> encrypted

• `Optional` **encrypted**: `boolean`

Enabled data at rest encryption.

#### Defined in

common/settings/settings.interface.ts:15

___

### <a id="static" name="static"></a> static

• `Optional` **static**: `boolean`

Static item will not read/write from/to the database.
It's value will be get from the ConfigMap file directly.

#### Defined in

common/settings/settings.interface.ts:21
