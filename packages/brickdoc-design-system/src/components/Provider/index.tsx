import { FC } from 'react'
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@brickdoc/design-icons'
import { ChakraProvider } from '@chakra-ui/react'
import { ceramicLight } from '../../themes/ceramic-light'

export const Provider: FC = ({ children }) => (
  <IconProvider
    value={{
      ...DEFAULT_ICON_CONFIGS
    }}>
    <ChakraProvider resetCSS={false} theme={ceramicLight}>
      {children}
    </ChakraProvider>
  </IconProvider>
)
