import { HSL, RGB, HSV, hsv2hsl, hsl2rgb, hsv2rgb, rgb2hsv, rgb2hex, hex2rgb, clamp, getColorFromRGBA, getContrastRatio, cssStr2Color } from '../color';
describe('Color Converter', () => {
  it('should convert hsv to hsl', () => {
    expect(hsv2hsl(0, 0, 0)).toEqual<HSL>({ h: 0, s: 0, l: 0 })
    expect(hsv2hsl(42, 42, 42)).toEqual<HSL>({ h: 42, s: 27, l: 33 })
  })

  it('should convert hsl to rgb', () => {
    expect(hsl2rgb(0,0,80)).toEqual<RGB>({ r: 204, g: 204, b: 204 })
    expect(hsl2rgb(0,0,0)).toEqual<RGB>({ r: 0, g: 0, b: 0 })
  })

  it('should convert hsv to rgb', () => {
    expect(hsv2rgb(0, 0, 0)).toEqual<RGB>({ r: 0, g: 0, b: 0 })
    expect(hsv2rgb(42, 42, 42)).toEqual<RGB>({ r: 107, g: 94, b: 62 })
  })

  it('should convert rgb to hsv', () => {
    expect(rgb2hsv(0, 0, 0)).toEqual<HSV>({ h: 0, s: 0, v: 0 })
    expect(rgb2hsv(100, 90, 60)).toEqual<HSV>({ h: 45, s: 40, v: 39 })
  })
  
  it('should convert rgb to hex', () => {
    expect(rgb2hex(0, 0, 0)).toEqual('000000')
    expect(rgb2hex(107, 94, 62)).toEqual('6b5e3e')
  })

  it('should convert hex to rgb', () => {
    expect(hex2rgb('fff')).toEqual<RGB>({ r: 255, g: 255, b: 255 })
    expect(hex2rgb('#ff3511')).toEqual<RGB>({ r: 255, g: 53, b: 17 })
  })
  
  it('should css color string to Color', () => {
    expect(cssStr2Color('#ccc').hex).toEqual('cccccc')
    expect(cssStr2Color('rgb(107,94,62)').hex).toEqual('6b5e3e')
    expect(cssStr2Color('rgba(34,105,168,1)').hex).toEqual('2269a8')
   })
  

})

describe('clamp', () => {
  it('should clamp a value between two bounds', () => {
    expect(clamp(42, 100, 0)).toEqual(42)
    expect(clamp(200, 42, 0)).toEqual(42)
    expect(clamp(30, 100, 42)).toEqual(42)
  })
})

describe('getColorFromRGBA', () => {
  it('should return a color object from an rgba string', () => {
    expect(getColorFromRGBA({ r: 255, g: 255, b: 255 }).hex).toEqual('ffffff')
    expect(getColorFromRGBA({ r: 42, g: 42, b: 42, a: 42 }).hex).toEqual('2a2a2a')
   })
})
 
describe('getContrastRatio', () => {
  it('should return the contrast ratio between two colors', () => {
    expect(getContrastRatio(getColorFromRGBA({r: 0, g: 0, b: 0}), getColorFromRGBA({r: 255, g: 255, b: 255}))).toEqual(21)
    expect(getContrastRatio(getColorFromRGBA({r: 255, g: 255, b: 255}), getColorFromRGBA({r: 255, g: 255, b: 255}))).toEqual(1)
    expect(getContrastRatio(getColorFromRGBA({r: 250, g: 250, b: 250}), getColorFromRGBA({r: 255, g: 255, b: 255}))).toEqual(1.044)
   })
 })