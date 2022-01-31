import { Palettes } from './palettes'
import { rgba } from 'polished'

export const Atomics = {
  grey: {
    '0-20p': rgba(Palettes.grey[0], 0.2),
    '0-25p': rgba(Palettes.grey[0], 0.25),
    '0-30p': rgba(Palettes.grey[0], 0.3),
    '0-70p': rgba(Palettes.grey[0], 0.7),
    '0-74p': rgba(Palettes.grey[0], 0.74),
    '0-80p': rgba(Palettes.grey[0], 0.8),
    '1-8p': rgba(Palettes.grey[1], 0.08),
    '1-80p': rgba(Palettes.grey[2], 0.8),
    '2-50p': rgba(Palettes.grey[2], 0.5),
    '2-90p': rgba(Palettes.grey[2], 0.9),
    '4-40p': rgba(Palettes.grey[4], 0.4),
    '6-2p': rgba(Palettes.grey[6], 0.02),
    '9-9p': rgba(Palettes.grey[9], 0.09),
    '9-90p': rgba(Palettes.grey[9], 0.9),
    '10-2p': rgba(Palettes.grey[10], 0.02),
    '10-3p': rgba(Palettes.grey[10], 0.03),
    '10-5p': rgba(Palettes.grey[10], 0.05),
    '10-10p': rgba(Palettes.grey[10], 0.1),
    '10-12p': rgba(Palettes.grey[10], 0.12),
    '10-35p': rgba(Palettes.grey[10], 0.35)
  },
  cyan: {
    '1-36p': rgba(Palettes.cyan[1], 0.36)
  },
  blue: {
    '6-4p': rgba(Palettes.blue[6], 0.04),
    '6-10p': rgba(Palettes.blue[6], 0.1),
    '6-12p': rgba(Palettes.blue[6], 0.12),
    '6-18p': rgba(Palettes.blue[6], 0.18),
    '6-60p': rgba(Palettes.blue[6], 0.6)
  }
}
