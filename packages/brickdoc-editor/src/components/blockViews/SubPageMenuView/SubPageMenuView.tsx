import { useContext } from 'react'
import { styled, theme } from '@brickdoc/design-system'
import { BlockContainer } from '../BlockContainer'
import { EditorDataSourceContext } from '../../../dataSource/DataSource'
import { SubPageMenuViewProps } from '../../../extensions/blocks/subPageMenu/meta'

const SubPageMenu = styled('div', {
  background: theme.colors.backgroundPrimary,
  border: `1px solid ${theme.colors.borderPrimary}`,
  borderRadius: '8px',
  display: 'inline-block',
  minWidth: '23.375rem',
  padding: '1rem .25rem'
})

export const SubPageMenuView: React.FC<SubPageMenuViewProps> = ({ deleteNode, getPos }) => {
  const editorDataSource = useContext(EditorDataSourceContext)

  return (
    <BlockContainer deleteNode={deleteNode} getPos={getPos} actionOptions={['delete']}>
      <SubPageMenu>{editorDataSource.renderPageTree()}</SubPageMenu>
    </BlockContainer>
  )
}
