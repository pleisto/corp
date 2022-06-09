import { Palettes } from './palettes'
import { Atomics } from './atomics'

export const Ceramics = {
  ceramicPrimary: `linear-gradient(0deg, ${Atomics.cyan1_38p /* Fill1 */}, ${Atomics.cyan1_38p /* Fill1 */}),
     ${Atomics.white_90p /* Fill2 */}`,
  ceramicSecondary: `linear-gradient(0deg, ${Atomics.cyan1_38p /* Fill1 */}, ${Atomics.cyan1_38p /* Fill1 */}),
     ${Atomics.grey2_90p /* Fill2 */}`,

  ceramicQuaternary: `linear-gradient(0deg, ${Atomics.cyan1_38p /* Fill1 */}, ${Atomics.cyan1_38p /* Fill1 */}),
      ${Atomics.grey1_90p /* Fill2 */}`
}

export const CeramicsMixins = {
  ceramicPrimary: {
    background: Ceramics.ceramicPrimary,
    boxShadow: `
    2px 2px 0px ${Atomics.white_80p /* DropShadow */},
    inset 2px 2px 0px ${Atomics.white_25p /* InnerShadow */},
    inset 0px 0px 0px 0.2px ${Atomics.white_50p /* Stroke */}`,
    filter: `drop-shadow(0px 4px 12px ${Atomics.grey4_40p /* Shadow */})`,
    backdropFilter: 'blur(20px)' /* Fill2 Blur */
  },
  ceramicSecondary: {
    background: Ceramics.ceramicSecondary,
    boxShadow: `
    2px 2px 0px ${Atomics.black_3p /* DropShadow */},
    inset 2px 2px 0px ${Atomics.white_25p /* InnerShadow */},
    inset 0px 0px 0px 0.2px ${Palettes.white /* Stroke */}`,
    filter: `drop-shadow(0px 4px 12px ${Atomics.grey6_2p /* Shadow */})`
  }
}
