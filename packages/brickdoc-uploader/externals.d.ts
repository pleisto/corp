declare module '*.less' {
  const resource: { [key: string]: string }
  export = resource
}

declare module '*.json' {
  const value: {
    [key: string]: Array<{
      emoji: string
      skin_tone_support: boolean
      name: string
      slug: string
      unicode_version: string
      emoji_version: string
    }>
  }
  export default value
}

// preact type definition is conflict with React, so we import source file directly
declare module 'htm/preact'
