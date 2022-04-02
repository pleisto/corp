import {
  getRecentItems,
  FORMULA,
  SPREADSHEET,
  UPLOAD,
  GALLERY,
  LINK,
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  HEADING_5,
  RECENT_COUNT,
  getSuggestionItems
} from '../items'
import { mockEditor } from '../../../../components/common/tests/editor'
import * as recentItemsManager from '../recentItemsManager'

describe('slashCommands > items', () => {
  it('triggers slash item command correctly', () => {
    const editor = mockEditor()
    expect(() => {
      FORMULA.command({ editor, range: { from: 0, to: 1 } })
      SPREADSHEET.command({ editor, range: { from: 0, to: 1 } })
    }).not.toThrow()
  })

  it('gets recent used slash items correctly', () => {
    jest
      .spyOn(recentItemsManager, 'getRecentItemKey')
      .mockImplementation(() => [
        FORMULA.key,
        SPREADSHEET.key,
        UPLOAD.key,
        GALLERY.key,
        LINK.key,
        HEADING_1.key,
        HEADING_2.key,
        HEADING_3.key,
        HEADING_4.key,
        HEADING_5.key
      ])

    const items = getRecentItems()

    expect(items).toHaveLength(RECENT_COUNT)
  })

  it('gets empty slash items if no suggestion correctly', () => {
    const items = getSuggestionItems('')

    expect(items).toHaveLength(0)
  })

  it('gets slash items by suggestion correctly', () => {
    const items = getSuggestionItems('formula')

    expect(items).toHaveLength(1)
    expect(items[0].key).toEqual(FORMULA.key)
  })
})
