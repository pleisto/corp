import { FC, useState } from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { Button, Input, Form, SubmitHandler, Box, theme } from '@brickdoc/design-system'
import { Lock } from '@brickdoc/design-icons'
import { object, string, InferType } from 'yup'
import { useI18n, useSharedContext, useInertiaError } from '../../hooks'

// client-side validation
const schema = object({
  authenticity_token: string().required(),
  username: string().required(),
  password: string().required()
})

type FormValues = InferType<typeof schema>

interface PasswordAuthProps {
  preferred: boolean
  signUpEnabled: boolean
}

export const PasswordAuth: FC<PasswordAuthProps> = ({ preferred, signUpEnabled }) => {
  const { t } = useI18n()
  const { errors } = usePage().props
  const [loading, setLoading] = useState(false)
  const name = t('auth_providers.password.name')
  const form = Form.useForm<FormValues>({ yup: schema })
  const { csrfToken } = useSharedContext()

  useInertiaError(errors, form)

  const onSubmit: SubmitHandler<FormValues> = data => {
    setLoading(true)
    Inertia.post('/users/auth/password/callback', data, {
      onFinish: () => setLoading(false)
    })
  }

  const overlay = (
    <>
      <Form form={form} onSubmit={onSubmit}>
        <input type="hidden" value={csrfToken} {...form.register('authenticity_token')} />
        <Form.Field name="username" label={t('auth_providers.password.username')}>
          <Input />
        </Form.Field>
        <Form.Field name="password" label={t('auth_providers.password.password')}>
          <Input type="password" />
        </Form.Field>
        <Button type="primary" loading={loading} htmlType="submit" size="lg" block>
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
          <Link href="/users/sign_up?provider=password">{t('auth_providers.password.sign_up')}</Link>
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
