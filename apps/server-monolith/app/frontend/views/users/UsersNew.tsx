import { useState, useEffect } from 'react'
import { applicationLayout } from '../layouts/ApplicationLayout'
import { styled, Form, SubmitHandler, Input, Button } from '@brickdoc/design-system'
import { Inertia } from '@inertiajs/inertia'
import { object, string, ref, boolean, InferType } from 'yup'
import { useI18n, useSharedContext } from '../../hooks'

// @see app/controllers/sessions_controller.rb#omniauth_hash
interface OmniauthHash {
  provider: string
  uid: string
  info: {
    username: string
    email?: string
    name?: string
    avatar?: string
  }
}

const Heading = styled('h1', {
  marginBottom: '3rem'
})

const queryAvailable = async (username?: string, _ctx?: unknown): Promise<boolean> => {
  if (!username || username === '') return false
  const response = await fetch(`/users/${username}/available`)
  return !!(await response.json())?.available
}

const schema = object({
  authenticity_token: string().required(),
  username: string()
    .required()
    .matches(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'limited to alphanumerics and hyphens, and must start and end with an alphanumeric'
    )
    .test('available', 'username is not available', queryAvailable),
  _hasPassword: boolean().required(),
  password: string().when('_hasPassword', {
    is: true,
    then: string().required().min(6)
  }),
  password_confirmation: string().when('_hasPassword', {
    is: true,
    then: string()
      .required()
      .oneOf([ref('password')])
  })
})

type FormValues = InferType<typeof schema>

const UsersNew: InertiaFC<{ payload?: OmniauthHash }> = ({ payload }) => {
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)
  const { csrfToken } = useSharedContext()
  // Payload is empty when the user is using the password sign up flow
  const hasPassword = !payload

  const form = Form.useForm<FormValues>({ yup: schema, mode: 'onBlur', reValidateMode: 'onBlur' })

  useEffect(() => {
    form.setValue('_hasPassword', hasPassword)
    payload?.info?.username && form.setValue('username', payload.info.username)
  }, [hasPassword])

  const onSubmit: SubmitHandler<FormValues> = ({ _hasPassword, ...data }) => {
    setLoading(true)
    if (!_hasPassword) {
      delete data.password
      delete data.password_confirmation
    }
    Inertia.post('/users', data as any, {
      onFinish: () => setLoading(false)
    })
  }

  return (
    <main id="panel-card">
      <Heading>{t('sign_up.heading')}</Heading>
      <Form form={form} onSubmit={onSubmit}>
        <input type="hidden" value={csrfToken} {...form.register('authenticity_token')} />
        <Form.Field name="username" label={t('sign_up.username')}>
          <Input />
        </Form.Field>
        {hasPassword && (
          <>
            <Form.Field name="password" label={t('auth_providers.password.password')}>
              <Input type="password" />
            </Form.Field>
            <Form.Field name="password_confirmation" label={t('auth_providers.password.password_confirmation')}>
              <Input type="password" />
            </Form.Field>
          </>
        )}
        <Button type="primary" loading={loading} htmlType="submit" size="lg" block>
          {t('sign_up.btn')}
        </Button>
      </Form>
    </main>
  )
}

UsersNew.layout = applicationLayout

export { UsersNew }
