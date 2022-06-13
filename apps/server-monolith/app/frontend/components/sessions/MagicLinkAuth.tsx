import { FC, useState } from 'react'
import { Button, Input, Form, SubmitHandler, Divider } from '@brickdoc/design-system'
import { Link } from '@brickdoc/design-icons'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import { object, string, InferType } from 'yup'
import { useI18n, useSharedContext, useInertiaError } from '../../hooks'

// client-side validation
const schema = object({
  email: string().email().required(),
  authenticity_token: string().required()
})

type FormValues = InferType<typeof schema>

interface MagicLinkAuthProps {
  preferred: boolean
  hasDivider: boolean
}

export const MagicLinkAuth: FC<MagicLinkAuthProps> = ({ preferred, hasDivider }) => {
  const { errors } = usePage().props
  const [loading, setLoading] = useState(false)
  const { t } = useI18n()
  const name = t('auth_providers.magic_link.name')
  const form = Form.useForm<FormValues>({ yup: schema })
  const { csrfToken } = useSharedContext()

  useInertiaError(errors, form)

  const onSubmit: SubmitHandler<FormValues> = data => {
    setLoading(true)
    Inertia.post('/users/auth/magic_link', data, {
      onFinish: () => setLoading(false)
    })
  }

  const overlay = (
    <Form form={form} onSubmit={onSubmit}>
      {hasDivider && <Divider css={{ margin: '0 0 1.5rem 0' }} />}
      <input type="hidden" value={csrfToken} {...form.register('authenticity_token')} />
      <Form.Field name="email" label={false}>
        <Input type="email" placeholder={t('auth_providers.magic_link.email_placeholder')} />
      </Form.Field>
      <Button loading={loading} type="primary" htmlType="submit" size="lg" block>
        {t('auth_providers.magic_link.sign_in_or_sign_up')}
      </Button>
    </Form>
  )
  const actionButton = (
    <Button
      circle
      id="magic_link-auth"
      aria-label={name}
      icon={<Link title={name} />}
      onClick={() => Inertia.get('/users/sign_in', { current_provider: 'magic_link' })}
    />
  )

  return preferred ? overlay : actionButton
}
