# Brickdoc PWA Client

> :warning: **Note:** Features such as authentication that rely on cookies or sever-side rendering are not part of the PWA client, but are provided by the server. Please see thier source code in the [`/apps/server-monolith/app/frontend`](../server-monolith/app/frontend/) directory.

## Directory Structure

- `/src/entrypoints/*.ts`: Entrypoints for vite build.
- `/src/core/**`: Core of the PWA client, such as root router, status page. It should not be exported for use in other modules.
- `/src/common/**`: Common components, like shared components, utilities, etc. It should be exported for use in other modules.

## State Management

In low-level, we use [zustand](https://github.com/pmndrs/zustand) to management local state, and [apollo-client](https://github.com/apollographql/apollo-client) to management remote state.

But, we'll wrap them in react-hooks at the application level, so that we can use hooks directly in the plugins and UI components instead of the low-level state store.
Inspired by Backbone.js, out state hooks are divided into three parts: `Models`, which are singular data models, `Collection`, which are collections of identifiers that
point to specific models. The data in a `Collection` hook is not the data of the model itself, but the metadata that determines the behavior of the Model in the Collection, such as sorting, filtering, etc.

### Example of Model Hook

#### Define a Model Hook

```typescript
const {
  useDocument, // load + subscribe
  createDocument, // create + subscribe + save
  updateDocument, // subscribe if is first time be cached
  saveDocument,   // save
} = useModelHook<Document>({
  context: DocumentModelContext, //  Optional, used to store some context data, such as the number of pages loaded, etc.
  create: (opts: 
  {modelId: ModelId, model: Document, context: DocumentModelContext}
  ) => {
  },
  load: (modelId: ModelId) => {
  ... // server load
  },
  return {
   model: {...} as Document
    context: {...} as DocumentModelContext // Optional
  }
 },
  subscribe: (opts: 
  {modelId: ModelId, model: Document, context: DocumentModelContext},
  update: (doc: Document) => void
  ) => {
  ... // Subscribe to CRDT State, process merge here, call update to trigger update
  }, // Optional
  save: (opts: 
  {modelId: ModelId, model: Document, context: DocumentModelContext}
  ) => {
  ... // handle save
 }
})
```

#### Use a Model Hook

```typescript
const {
  model,    // Document
  fetch,    // fetch() (re-fetch)
  save,     // save(doc as Document)
  loading,  // loading state
  saving,   // saving state
} = useDocument('uuid')
```

### Example of Collection Hook

#### Define a Collection Hook

```typescript
const useTopDocuments = useCollectionHook<DocumentCollectionData>({
  context: DocumentCollectionContext, // Optional, used to store some context data, such as the number of pages loaded, etc.
  load: (collectionId: string) => {
  ... // load for server
  updateDocument({ modelId, model, context }) // Processing results can be written to trigger model updates during the loop, and subscriptions will be triggered for models not in the cache.
  return {
   items: [...],
   context: {...} as DocumentCollectionContext // Optional
  }
 },
 subscribe: (opts: 
  {collectionId: string, model: Document, context: DocumentModelContext},
  update: (collection: {...}) => void
 ) => {
  ... // Subscribe to CRDT state, process merge here, and call update when triggerred
 }, // Optional
})
```

#### Use a Collection Hook

```typescript
const {
  collection, // Document
  fetch,    // fetch() (re-fetch)
  loading,  // loading state
} = useTopDocuments('space1.rootDocumentires')

collection.items.map(([modelId: ModelId, data: DocumentCollectionData]) => {
  const { model } = useDocument(modelId.id)
  return <li key={modelId.id}>{model.title}</li>
})
```
