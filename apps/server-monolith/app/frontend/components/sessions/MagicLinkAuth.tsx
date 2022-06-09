import { FC, useRef } from 'react'
import { Button, Input, Form, SubmitHandler, Divider } from '@brickdoc/design-system'
import { Link } from '@brickdoc/design-icons'
import { Inertia } from '@inertiajs/inertia'
import { object, string } from 'yup'
import { useI18n, useSharedContext } from '../../hooks'

// client-side validation
const validation = object({
  email: string().email().required()
})

interface MagicLinkAuthProps {
  preferred: boolean
  hasDivider: boolean
}

export const MagicLinkAuth: FC<MagicLinkAuthProps> = ({ preferred, hasDivider }) => {
  const { t } = useI18n()
  const name = t('auth_providers.magic_link.name')
  const form = Form.useForm({ yup: validation })
  const fromRef = useRef<HTMLFormElement>(null)
  const { csrfToken } = useSharedContext()

  const onSubmit: SubmitHandler<any> = () => {
    const current = fromRef.current!
    current.method = 'POST'
    current.action = '/users/auth/magic_link'
    current.submit()
  }

  const overlay = (
    <Form form={form} ref={fromRef} onSubmit={onSubmit}>
      {hasDivider && <Divider css={{ margin: '0 0 1.5rem 0' }} />}
      <input type="hidden" name="authenticity_token" value={csrfToken} />
      <Form.Field name="email" label={false}>
        <Input type="email" placeholder={t('auth_providers.magic_link.email_placeholder')} />
      </Form.Field>
      <Button type="primary" htmlType="submit" size="lg" block>
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
