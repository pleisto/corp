import { SubPageMenuView } from '../SubPageMenuView'
import { render } from '@testing-library/react'
import { EditorDataSource, EditorDataSourceContext } from '../../../../dataSource/DataSource'

describe('SubPageMenuView', () => {
  it('matches correct snapshot', () => {
    const props: any = {}
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const editorDataSource = new EditorDataSource()
    editorDataSource.renderPageTree = () => <div>page tree</div>

    const { container } = render(
      <EditorDataSourceContext.Provider value={editorDataSource}>
        <SubPageMenuView {...props} />
      </EditorDataSourceContext.Provider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
