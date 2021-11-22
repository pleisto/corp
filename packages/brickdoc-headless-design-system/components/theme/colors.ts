import { colorShadeMixin } from '@brickdoc/design-colors'
import { ColorToken } from './colorToken'

const Cyan = '#39b3e8'
const Red = '#d43730'
const Scarlet = '#f75f48'
const Orange = '#fb8c00'
const Yellow = '#fb8c00'
const Green = '#2cad94'
const Blue = '#2c5bff'
const Purple = '#5e35b1'
const DeepPurple = '#3a3642'
const Pink = '#ad1457'

export const Colors = {
  white: '#fff',
  black: '#000',
  'grey-1': '#f5f5f5',
  'grey-2': '#eee',
  'grey-3': '#e0e0e0',
  'grey-4': '#bdbdbd',
  'grey-5': '#9e9e9e',
  'grey-6': '#757575',
  'grey-7': '#616161',
  'grey-8': '#424242',
  'grey-9': '#1c1c1e',

  'cyan-base': Cyan,
  'cyan-1': colorShadeMixin(Cyan, '1', 'false'),
  'cyan-2': colorShadeMixin(Cyan, '2'),
  'cyan-3': colorShadeMixin(Cyan, '3'),
  'cyan-4': colorShadeMixin(Cyan, '4'),
  'cyan-5': colorShadeMixin(Cyan, '5'),
  'cyan-6': Cyan,
  'cyan-7': colorShadeMixin(Cyan, '7'),
  'cyan-8': colorShadeMixin(Cyan, '8'),
  'cyan-9': '#2c89b0',

  'red-base': Red,
  'red-1': colorShadeMixin(Red, '1'),
  'red-2': colorShadeMixin(Red, '2'),
  'red-3': colorShadeMixin(Red, '3'),
  'red-4': colorShadeMixin(Red, '4'),
  'red-5': colorShadeMixin(Red, '5'),
  'red-6': Red,
  'red-7': colorShadeMixin(Red, '7'),
  'red-8': colorShadeMixin(Red, '8'),
  'red-9': colorShadeMixin(Red, '9'),

  'scarlet-base': Scarlet,
  'scarlet-1': colorShadeMixin(Scarlet, '1'),
  'scarlet-2': colorShadeMixin(Scarlet, '2'),
  'scarlet-3': colorShadeMixin(Scarlet, '3'),
  'scarlet-4': colorShadeMixin(Scarlet, '4'),
  'scarlet-5': colorShadeMixin(Scarlet, '5'),
  'scarlet-6': Scarlet,
  'scarlet-7': colorShadeMixin(Scarlet, '6'),
  'scarlet-8': colorShadeMixin(Scarlet, '7'),
  'scarlet-9': colorShadeMixin(Scarlet, '8'),

  'orange-base': Orange,
  'orange-1': colorShadeMixin(Orange, '1'),
  'orange-2': colorShadeMixin(Orange, '2'),
  'orange-3': colorShadeMixin(Orange, '3'),
  'orange-4': colorShadeMixin(Orange, '4'),
  'orange-5': colorShadeMixin(Orange, '5'),
  'orange-6': Orange,
  'orange-7': colorShadeMixin(Orange, '6'),
  'orange-8': colorShadeMixin(Orange, '7'),
  'orange-9': colorShadeMixin(Orange, '8'),

  'yellow-base': Yellow,
  'yellow-1': colorShadeMixin(Yellow, '1'),
  'yellow-2': colorShadeMixin(Yellow, '2'),
  'yellow-3': colorShadeMixin(Yellow, '3'),
  'yellow-4': colorShadeMixin(Yellow, '4'),
  'yellow-5': colorShadeMixin(Yellow, '5'),
  'yellow-6': Yellow,
  'yellow-7': colorShadeMixin(Yellow, '6'),
  'yellow-8': colorShadeMixin(Yellow, '7'),
  'yellow-9': colorShadeMixin(Yellow, '8'),

  'green-base': Green,
  'green-1': colorShadeMixin(Green, '1'),
  'green-2': colorShadeMixin(Green, '2'),
  'green-3': colorShadeMixin(Green, '3'),
  'green-4': colorShadeMixin(Green, '4'),
  'green-5': colorShadeMixin(Green, '5'),
  'green-6': Green,
  'green-7': colorShadeMixin(Green, '6'),
  'green-8': colorShadeMixin(Green, '7'),
  'green-9': colorShadeMixin(Green, '8'),

  'blue-base': Blue,
  'blue-1': colorShadeMixin(Blue, '1'),
  'blue-2': colorShadeMixin(Blue, '2'),
  'blue-3': colorShadeMixin(Blue, '3'),
  'blue-4': colorShadeMixin(Blue, '4'),
  'blue-5': colorShadeMixin(Blue, '5'),
  'blue-6': Blue,
  'blue-7': colorShadeMixin(Blue, '6'),
  'blue-8': colorShadeMixin(Blue, '7'),
  'blue-9': colorShadeMixin(Blue, '8'),

  'purple-base': Purple,
  'purple-1': colorShadeMixin(Purple, '1'),
  'purple-2': colorShadeMixin(Purple, '2'),
  'purple-3': colorShadeMixin(Purple, '3'),
  'purple-4': colorShadeMixin(Purple, '4'),
  'purple-5': colorShadeMixin(Purple, '5'),
  'purple-6': Purple,
  'purple-7': colorShadeMixin(Purple, '6'),
  'purple-8': colorShadeMixin(Purple, '7'),
  'purple-9': colorShadeMixin(Purple, '8'),

  'deep-purple-base': DeepPurple,
  'deep-purple-1': colorShadeMixin(DeepPurple, '1'),
  'deep-purple-2': colorShadeMixin(DeepPurple, '2'),
  'deep-purple-3': colorShadeMixin(DeepPurple, '3'),
  'deep-purple-4': colorShadeMixin(DeepPurple, '4'),
  'deep-purple-5': colorShadeMixin(DeepPurple, '5'),
  'deep-purple-6': DeepPurple,
  'deep-purple-7': colorShadeMixin(DeepPurple, '6'),
  'deep-purple-8': colorShadeMixin(DeepPurple, '7'),
  'deep-purple-9': colorShadeMixin(DeepPurple, '8'),

  'pink-base': Pink,
  'pink-1': colorShadeMixin(Pink, '1'),
  'pink-2': colorShadeMixin(Pink, '2'),
  'pink-3': colorShadeMixin(Pink, '3'),
  'pink-4': colorShadeMixin(Pink, '4'),
  'pink-5': colorShadeMixin(Pink, '5'),
  'pink-6': Pink,
  'pink-7': colorShadeMixin(Pink, '6'),
  'pink-8': colorShadeMixin(Pink, '7'),
  'pink-9': colorShadeMixin(Pink, '8'),

  // "preset-colors": ["cyan", "red", "orange", "orange", "yellow", "green", "blue", "purple", "deep-purple", "pink"]

  ...ColorToken
}
