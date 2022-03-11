import { Extension, Extensions } from '@tiptap/core'
import * as EXTENSION from './index'

export interface BaseOptions {
  all?: boolean
  anchor: Partial<EXTENSION.AnchorOptions> | true
  blockquote: Partial<EXTENSION.BlockquoteOptions> | true
  bold: Partial<EXTENSION.BoldOptions> | true
  brickList: Partial<EXTENSION.BrickListOptions> | true
  bulletList: Partial<EXTENSION.BulletListOptions> | true
  code: Partial<EXTENSION.CodeOptions> | true
  codeBlock: Partial<EXTENSION.CodeBlockOptions> | true
  document: true
  discussion: Partial<EXTENSION.DiscussionOptions> | true
  dropcursor: Partial<EXTENSION.DropcursorOptions> | true
  embed: Partial<EXTENSION.EmbedOptions> | true
  eventHandler: Partial<EXTENSION.EventHandlerOptions> | true
  fontColor: Partial<EXTENSION.FontColorOptions> | true
  formula: Partial<EXTENSION.FormulaOptions> | true
  gapcursor: true
  hardBreak: Partial<EXTENSION.HardBreakOptions> | true
  heading: Partial<EXTENSION.HeadingOptions> | true
  history: Partial<EXTENSION.HistoryOptions> | true
  horizontalRule: Partial<EXTENSION.HorizontalRuleOptions> | true
  indent: Partial<EXTENSION.IndentOptions> | true
  image: Partial<EXTENSION.ImageOptions> | true
  italic: Partial<EXTENSION.ItalicOptions> | true
  link: Partial<EXTENSION.LinkOptions> | true
  listItem: Partial<EXTENSION.ListItemOptions> | true
  mentionCommands: Partial<EXTENSION.MentionCommandsOptions> | true
  orderedList: Partial<EXTENSION.OrderedListOptions> | true
  pageLink: Partial<EXTENSION.PageLinkOptions> | true
  paragraph: Partial<EXTENSION.ParagraphOptions> | true
  slashCommands: Partial<EXTENSION.SlashCommandsOptions> | true
  spreadsheet: Partial<EXTENSION.SpreadsheetOptions> | true
  strike: Partial<EXTENSION.StrikeOptions> | true
  subPageMenu: Partial<EXTENSION.SubPageMenuOptions> | true
  sync: Partial<EXTENSION.SyncOptions> | true
  text: true
  textStyle: Partial<EXTENSION.TextStyleOptions> | true
  toc: Partial<EXTENSION.TocOptions> | true
  underline: Partial<EXTENSION.UnderlineOptions> | true
  uniqueID: Partial<EXTENSION.UniqueIDOptions> | true
  user: Partial<EXTENSION.UserOptions> | true
}

const getConfigure = <T>(configure: T | true) => (configure === true ? {} : configure)

export const Base = Extension.create<BaseOptions>({
  name: 'base',

  addExtensions() {
    const extensions: Extensions = []

    if (this.options.all ?? this.options.anchor)
      extensions.push(EXTENSION.Anchor.configure(getConfigure(this.options?.anchor)))
    if (this.options.all ?? this.options.blockquote)
      extensions.push(EXTENSION.Blockquote.configure(getConfigure(this.options?.blockquote)))
    if (this.options.all ?? this.options.bold)
      extensions.push(EXTENSION.Bold.configure(getConfigure(this.options?.bold)))
    if (this.options.all ?? this.options.brickList)
      extensions.push(EXTENSION.BrickList.configure(getConfigure(this.options?.brickList)))
    if (this.options.all ?? this.options.bulletList)
      extensions.push(EXTENSION.BulletList.configure(getConfigure(this.options?.bulletList)))
    if (this.options.all ?? this.options.code)
      extensions.push(EXTENSION.Code.configure(getConfigure(this.options?.code)))
    if (this.options.all ?? this.options.codeBlock)
      extensions.push(EXTENSION.CodeBlock.configure(getConfigure(this.options.codeBlock)))
    if (this.options.all ?? this.options.document)
      extensions.push(EXTENSION.Document.configure(getConfigure(this.options?.document)))
    if (this.options.all ?? this.options.discussion)
      extensions.push(EXTENSION.DiscussionMark.configure(getConfigure(this.options?.discussion)))
    if (this.options.all ?? this.options.dropcursor)
      extensions.push(EXTENSION.Dropcursor.configure(getConfigure(this.options?.dropcursor)))
    if (this.options.all ?? this.options.embed)
      extensions.push(EXTENSION.Embed.configure(getConfigure(this.options?.embed)))
    if (this.options.all ?? this.options.eventHandler)
      extensions.push(EXTENSION.EventHandler.configure(getConfigure(this.options?.eventHandler)))
    if (this.options.all ?? this.options.fontColor)
      extensions.push(EXTENSION.FontColorExtension.configure(getConfigure(this.options?.fontColor)))
    if (this.options.all ?? this.options.formula)
      extensions.push(EXTENSION.Formula.configure(getConfigure(this.options?.formula)))
    if (this.options.all ?? this.options.gapcursor)
      extensions.push(EXTENSION.Gapcursor.configure(getConfigure(this.options?.gapcursor)))
    if (this.options.all ?? this.options.hardBreak)
      extensions.push(EXTENSION.HardBreak.configure(getConfigure(this.options?.hardBreak)))
    if (this.options.all ?? this.options.heading)
      extensions.push(EXTENSION.Heading.configure(getConfigure(this.options?.heading)))
    if (this.options.all ?? this.options.history)
      extensions.push(EXTENSION.History.configure(getConfigure(this.options?.history)))
    if (this.options.all ?? this.options.horizontalRule)
      extensions.push(EXTENSION.HorizontalRule.configure(getConfigure(this.options?.horizontalRule)))
    if (this.options.all ?? this.options.indent)
      extensions.push(EXTENSION.Indent.configure(getConfigure(this.options?.indent)))
    if (this.options.all ?? this.options.image)
      extensions.push(EXTENSION.Image.configure(getConfigure(this.options?.image)))
    if (this.options.all ?? this.options.italic)
      extensions.push(EXTENSION.Italic.configure(getConfigure(this.options?.italic)))
    if (this.options.all ?? this.options.link)
      extensions.push(EXTENSION.Link.configure(getConfigure(this.options?.link)))
    if (this.options.all ?? this.options.listItem)
      extensions.push(EXTENSION.ListItem.configure(getConfigure(this.options?.listItem)))
    if (this.options.all ?? this.options.mentionCommands)
      extensions.push(EXTENSION.MentionCommands.configure(getConfigure(this.options?.mentionCommands)))
    if (this.options.all ?? this.options.orderedList)
      extensions.push(EXTENSION.OrderedList.configure(getConfigure(this.options?.orderedList)))
    if (this.options.all ?? this.options.pageLink)
      extensions.push(EXTENSION.PageLink.configure(getConfigure(this.options?.pageLink)))
    if (this.options.all ?? this.options.paragraph)
      extensions.push(EXTENSION.Paragraph.configure(getConfigure(this.options?.paragraph)))
    if (this.options.all ?? this.options.slashCommands)
      extensions.push(EXTENSION.SlashCommands.configure(getConfigure(this.options?.slashCommands)))
    if (this.options.all ?? this.options.spreadsheet)
      extensions.push(EXTENSION.Spreadsheet.configure(getConfigure(this.options?.spreadsheet)))
    if (this.options.all ?? this.options.strike)
      extensions.push(EXTENSION.Strike.configure(getConfigure(this.options?.strike)))
    if (this.options.all ?? this.options.subPageMenu)
      extensions.push(EXTENSION.SubPageMenu.configure(getConfigure(this.options?.subPageMenu)))
    if (this.options.all ?? this.options.sync)
      extensions.push(EXTENSION.Sync.configure(getConfigure(this.options?.sync)))
    if (this.options.all ?? this.options.text)
      extensions.push(EXTENSION.Text.configure(getConfigure(this.options?.text)))
    if (this.options.all ?? this.options.textStyle)
      extensions.push(EXTENSION.TextStyle.configure(getConfigure(this.options?.textStyle)))
    if (this.options.all ?? this.options.toc) extensions.push(EXTENSION.Toc.configure(getConfigure(this.options?.toc)))
    if (this.options.all ?? this.options.underline)
      extensions.push(EXTENSION.Underline.configure(getConfigure(this.options?.underline)))
    if (this.options.all ?? this.options.uniqueID)
      extensions.push(EXTENSION.UniqueID.configure(getConfigure(this.options?.uniqueID)))
    if (this.options.all ?? this.options.user)
      extensions.push(EXTENSION.User.configure(getConfigure(this.options?.user)))

    return extensions
  }
})
