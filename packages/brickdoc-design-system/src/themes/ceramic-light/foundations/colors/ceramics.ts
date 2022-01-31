import { Palettes } from './palettes'
import { Atomics } from './atomics'

export const Ceramics = {
  ceramic: {
    primary: `linear-gradient(0deg, ${Atomics.cyan['1-36p']}, ${Atomics.cyan['1-36p']}),
     ${Atomics.grey['0-74p']}`,
    secondary: `linear-gradient(0deg, ${Atomics.cyan['1-36p']}, ${Atomics.cyan['1-36p']}),
     ${Atomics.grey['2-90p']}`,
    quaternary: `linear-gradient(0deg, ${Atomics.cyan['1-36p']}, ${Atomics.cyan['1-36p']}),
      ${Atomics.grey['1-80p']}`
  }
}

export const CeramicsMixins = {
  ceramicPrimary: {
    background: Ceramics.ceramic.primary,
    boxShadow: `
    2px 2px 0px ${Atomics.grey['0-80p']},
    inset 2px 2px 0px ${Atomics.grey['0-30p']},
    inset 0px 0px 0px 0.2px ${Palettes.grey[0]}`,
    filter: `drop-shadow(0px 4px 12px ${Atomics.grey['4-40p']})`,
    backdropFilter: 'blur(20px)'
  },
  ceramicSecondary: {
    background: Ceramics.ceramic.secondary,
    boxShadow: `
    2px 2px 0px ${Atomics.grey['10-3p']},
    inset 2px 2px 0px ${Atomics.grey['0-25p']},
    inset 0px 0px 0px 0.2px ${Palettes.grey[0]}`,
    filter: `drop-shadow(0px 4px 12px ${Atomics.grey['6-2p']})`
  }
}
