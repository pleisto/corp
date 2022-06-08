import { ExtensionMeta } from '../../common'

export const meta: ExtensionMeta = {
  name: 'mentionCommands',
  extensionType: 'extension'
}

export interface MentionUser {
  id: string
  name: string | null | undefined
  avatar: string | null | undefined
}

export interface MentionPage {
  id: string
  parentId: string | null | undefined
  icon: string | undefined | null
  title: string | undefined | null
  link: string | undefined | null
}

export interface MentionCommandsOptions {
  users: MentionUser[]
  pages: MentionPage[]
  size?: 'sm' | 'md'
}

export interface MentionCommandsAttributes {}
