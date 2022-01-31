import { colorWithShade, cssStr2color, color2cssStr, generatePalette } from '../index'
import { Shade } from '../palette'

describe('colorPalette', () => {
  it('should color2shade work', () => {
    const red = cssStr2color('#d43730')
    expect(color2cssStr(colorWithShade(red!, Shade.Shade1, true)!)).toEqual('#080202')
    expect(color2cssStr(colorWithShade(red!, Shade.Shade8, true)!)).toEqual('#e78883')
    expect(generatePalette('#d5c4ff')).toEqual({
      1: '#beafe3',
      2: '#a699c7',
      3: '#8f84ab',
      4: '#776e8f',
      5: '#605873',
      6: '#d5c4ff',
      7: '#484357',
      8: '#312d3b',
      9: '#1a181f'
    })
  })
})
