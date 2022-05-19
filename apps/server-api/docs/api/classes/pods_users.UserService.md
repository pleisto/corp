# Class: UserService

[pods/users](../modules/pods_users.md).UserService

## Table of contents

### Constructors

- [constructor](pods_users.UserService.md#constructor)

### Methods

- [findOrCreateUser](pods_users.UserService.md#findorcreateuser)
- [findUserById](pods_users.UserService.md#finduserbyid)
- [findUserBySlug](pods_users.UserService.md#finduserbyslug)
- [updateUserAppearance](pods_users.UserService.md#updateuserappearance)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new UserService**(`pool`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pool` | `DatabasePool` |

#### Defined in

[pods/users/user.service.ts:10](https://github.com/brickdoc/brickdoc/blob/master/apps/server-api/src/pods/users/user.service.ts#L10)

## Methods

### <a id="findorcreateuser" name="findorcreateuser"></a> findOrCreateUser

▸ **findOrCreateUser**(`credential`): `Promise`<`Result`<[`User`](pods_users.User.md), `Error`\>\>

Find or create a user by credential

#### Parameters

| Name | Type |
| :------ | :------ |
| `credential` | [`UserCredentialInput`](../interfaces/pods_users.UserCredentialInput.md)<`Record`<`string`, `any`\>\> |

#### Returns

`Promise`<`Result`<[`User`](pods_users.User.md), `Error`\>\>

#### Defined in

[pods/users/user.service.ts:16](https://github.com/brickdoc/brickdoc/blob/master/apps/server-api/src/pods/users/user.service.ts#L16)

___

### <a id="finduserbyid" name="finduserbyid"></a> findUserById

▸ **findUserById**(`id`): `Promise`<`Result`<[`User`](pods_users.User.md), `Error`\>\>

Get a user by id

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`<`Result`<[`User`](pods_users.User.md), `Error`\>\>

#### Defined in

[pods/users/user.service.ts:33](https://github.com/brickdoc/brickdoc/blob/master/apps/server-api/src/pods/users/user.service.ts#L33)

___

### <a id="finduserbyslug" name="finduserbyslug"></a> findUserBySlug

▸ **findUserBySlug**(`slug`): `Promise`<`Result`<[`User`](pods_users.User.md), `Error`\>\>

Get a user by slug

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`Promise`<`Result`<[`User`](pods_users.User.md), `Error`\>\>

#### Defined in

[pods/users/user.service.ts:40](https://github.com/brickdoc/brickdoc/blob/master/apps/server-api/src/pods/users/user.service.ts#L40)

___

### <a id="updateuserappearance" name="updateuserappearance"></a> updateUserAppearance

▸ **updateUserAppearance**(`userId`, `input`): `Promise`<`Result`<`boolean`, `Error`\>\>

Update user appearance

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |
| `input` | `UserAppearanceUpdateInput` |

#### Returns

`Promise`<`Result`<`boolean`, `Error`\>\>

#### Defined in

[pods/users/user.service.ts:49](https://github.com/brickdoc/brickdoc/blob/master/apps/server-api/src/pods/users/user.service.ts#L49)
