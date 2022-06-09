import { FC, useRef } from 'react'
import { Link } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { Button, Input, Form, SubmitHandler, Box, theme } from '@brickdoc/design-system'
import { Lock } from '@brickdoc/design-icons'
import { object, string } from 'yup'
import { useI18n, useSharedContext } from '../../hooks'

// client-side validation
const validation = object({
  username: string().required(),
  password: string().required()
})

interface PasswordAuthProps {
  preferred: boolean
  signUpEnabled: boolean
}

export const PasswordAuth: FC<PasswordAuthProps> = ({ preferred, signUpEnabled }) => {
  const { t } = useI18n()
  const name = t('auth_providers.password.name')
  const form = Form.useForm({ yup: validation })
  const fromRef = useRef<HTMLFormElement>(null)
  const { csrfToken } = useSharedContext()

  const onSubmit: SubmitHandler<any> = () => {
    const current = fromRef.current!
    current.method = 'POST'
    current.action = '/users/auth/password/callback'
    current.submit()
  }

  const overlay = (
    <>
      <Form form={form} ref={fromRef} onSubmit={onSubmit}>
        <input type="hidden" name="authenticity_token" value={csrfToken} />
        <Form.Field name="username" label={t('auth_providers.password.username')}>
          <Input />
        </Form.Field>
        <Form.Field name="password" label={t('auth_providers.password.password')}>
          <Input type="password" />
        </Form.Field>
        <Button type="primary" htmlType="submit" size="lg" block>
          {t('auth_providers.password.sign_in')}
        </Button>
      </Form>
      {signUpEnabled && (
        <Box
          css={{
            marginTop: '1em',
            textAlign: 'right',
            a: {
              color: theme.colors.typeThirdary
            }
          }}>
          <Link href="/users/sign_up">{t('auth_providers.password.sign_up')}</Link>
        </Box>
      )}
    </>
  )
  const actionButton = (
    <Button
      circle
      id="password-auth"
      aria-label={name}
      icon={<Lock title={name} />}
      onClick={() => Inertia.get('/users/sign_in', { current_provider: 'password' })}
    />
  )

  return preferred ? overlay : actionButton
}
