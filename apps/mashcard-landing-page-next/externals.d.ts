import 'csstype'

// See: https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
declare module 'csstype' {
  interface Properties {
    '--extra-margin'?: string
  }
}

declare global {
  declare module '*.mp4' {
    const src: string
    export = src
  }

  declare module '*.mov' {
    const src: string
    export = src
  }

  declare module '*.webm' {
    const src: string
    export = src
  }
}
