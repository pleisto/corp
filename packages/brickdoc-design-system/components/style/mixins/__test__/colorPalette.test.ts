import { colorPaletteMixin, colorShadeMixin } from '../colorPalette'
describe('colorPalette', () => {
  it('should colorShadeMixin work', () => {
    expect(colorShadeMixin({}, 'rgba(84,122,255,0.5)', 2)).toMatchObject({ color: 'rgba(228, 234, 255, 0.5)' })
  })
  it('should colorPaletteMixin work', () => {
    expect(colorPaletteMixin({}, 'red', '#d43730', true)).toMatchObject({
      '--color-red-0': '#080202',
      '--color-red-1': '#220908',
      '--color-red-2': '#3f110f',
      '--color-red-3': '#7f221d',
      '--color-red-4': '#ba322b',
      '--color-red-5': '#d43730',
      '--color-red-6': '#d84a42',
      '--color-red-7': '#de635c',
      '--color-red-8': '#e78883'
    })
  })
})
