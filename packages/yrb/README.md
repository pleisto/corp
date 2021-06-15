# YRB

Ruby implementation of YJS


## NOTE

encoding
1. createEncoder
2. writeVarUint(syncbol)
3. toUint8Array
4. writeVarUint8Array()
5. length

decoding
1. createDecoder
2. readVarUint
3. readVarUint8Array


Awareness
1. encodeAwarenessUpdate

Sync
1. readSyncMessage

## Demo

```js
encoding = require('lib0/dist/encoding.cjs')
const encoder = encoding.createEncoder()
encoding.writeVarUint(encoder, 256)
encoding.writeVarString(encoder, 'Hello world!')
const buf = encoding.toUint8Array(encoder)

decoding = require('lib0/dist/decoding.cjs')
const decoder = decoding.createDecoder(buf)
decoding.readVarUint(decoder) // => 256
decoding.readVarString(decoder) // => 'Hello world!'
decoding.hasContent(decoder) // => false - all data is read
```

```rb
encoder = Brickdoc::Yrb::Lib0::Encoding.new()
```