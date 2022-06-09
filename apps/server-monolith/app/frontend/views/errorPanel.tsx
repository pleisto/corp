import { applicationLayout } from './layouts/application'
import { styled } from '@brickdoc/design-system'

const Message = styled('p', {
  margin: '1.25rem 0 2rem',
  whiteSpace: 'pre-wrap'
})

const ErrorPanel: InertiaFC<{ title?: string; message: string }> = ({ title, message }) => {
  return (
    <main id="panel-card">
      <h1>{title ?? 'Error'}</h1>
      <Message>{message}</Message>
    </main>
  )
}

ErrorPanel.layout = applicationLayout

export { ErrorPanel }
