import { colorShadeMixin } from '../colorShade'
describe('colorShadeMixin', () => {
  it('should colorShadeMixin work', () => {
    expect(colorShadeMixin('#fff', 0).color).toBe('#ffffff')
    expect(colorShadeMixin('rgb(34, 168,146)', 5).color).toBe('#35b39e')
    expect(colorShadeMixin('#22a892', 3).color).toBe('#aee5dc')
    expect(colorShadeMixin('hsl(170,67, 40)', 1).color).toBe('#f4fcfa')
    expect(colorShadeMixin('rgba(34,168,146,0.33)', 8, true).color).toBe('rgba(114, 206, 191, 0.33)')
   })
 })