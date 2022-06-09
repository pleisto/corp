import { FC, useRef } from 'react'
import { Button } from '@brickdoc/design-system'
import { ImageIcon } from '@brickdoc/design-icons'
import { useSharedContext } from '../../hooks/useSharedContext'

// Same as auth provider object in backend, but with the addition of the name attribute
// @example { id: 'google', name t('providers.google'), logo: 'google.svg' }
export interface SocialLoginButtonProps {
  id: string
  name: string
  logo: string
  preferred: boolean
}

/**
 * SocialLoginButton is a button that links to the social login provider.
 */
export const SocialLoginButton: FC<SocialLoginButtonProps> = ({ id, name, logo, preferred }) => {
  const { csrfToken } = useSharedContext()
  const submitRef = useRef<HTMLButtonElement>(null)
  const domId = `social-login-${id}`

  // Omniauth requires a POST request with the CSRF token to create a OAuth Request
  const requestForm = (
    <form method="post" id={`${domId}-form`} aria-hidden action={`/users/auth/${id}`} style={{ display: 'none' }}>
      <input type="hidden" name="authenticity_token" value={csrfToken} />
      <input type="hidden" name="_method" value="POST" />
      <button type="submit" hidden ref={submitRef} />
    </form>
  )

  const submitRequest = (): void => submitRef.current?.click()

  // Load the logo image
  const icon = (
    <ImageIcon src={logo} alt={`${name} logo`} title={name} style={preferred ? { marginBottom: '4px' } : undefined} />
  )

  const button = preferred ? (
    <Button size="lg" icon={icon} onClick={submitRequest}>
      {name}
    </Button>
  ) : (
    <Button css={{ border: 'none' }} circle id={domId} aria-label={id} icon={icon} onClick={submitRequest} />
  )

  return (
    <>
      {button}
      {requestForm}
    </>
  )
}
