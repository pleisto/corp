import { refractor } from './refractorLanguagesBundle'
import TiptapCodeBlock, { CodeBlockOptions as TiptapCodeBlockOptions } from '@tiptap/extension-code-block'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { RefractorPlugin } from './refractor-plugin'
import { CodeBlock as CodeBlockComponent } from '../../../components'

export interface CodeBlockOptions extends TiptapCodeBlockOptions {
  refractor: any
  defaultLanguage: string
}

export interface CodeBlockAttributes {
  language?: string | null
}

export const CodeBlock = TiptapCodeBlock.extend<CodeBlockOptions>({
  draggable: true,

  addOptions() {
    return {
      ...this.parent?.(),
      refractor,
      defaultLanguage: 'typescript'
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      RefractorPlugin({
        name: this.name,
        refractor: this.options.refractor,
        defaultLanguage: this.options.defaultLanguage
      })
    ]
  }
})
