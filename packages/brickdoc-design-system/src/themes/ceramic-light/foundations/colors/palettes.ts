import { generatePalette } from '../../../../utilities'

export const Palettes = {
  grey: {
    0: '#fff',
    1: '#fcfcfa',
    2: '#f0f0f0',
    3: '#e0e0e0',
    4: '#d3d3d3',
    5: '#bdbdbd',
    6: '#8e8e8e',
    7: '#757575',
    8: '#616161',
    9: '#1c1c1e',
    10: '#000'
  },
  red: {
    ...generatePalette('#e6222d'),
    1: '#fff7f5'
  },
  orange: {
    ...generatePalette('#ff6d00'),
    1: '#fff5ed',
    8: '#c84116'
  },
  yellow: {
    ...generatePalette('#ffd84e'),
    1: '#fffbf0',
    6: '#ffd84e',
    9: '#7e6409'
  },
  green: {
    ...generatePalette('#2cad94'),
    1: '#edfffb'
  },
  cyan: {
    ...generatePalette('#39b3e8'),
    1: '#f8fbff',
    9: '#095b85'
  },
  blue: generatePalette('#356cf9'),
  deepPurple: {
    ...generatePalette('#3a3642'),
    4: '#908b9c',
    5: '#73707e'
  },
  purple: generatePalette('#5e35b1'),
  pink: generatePalette('#d81b60')
}
