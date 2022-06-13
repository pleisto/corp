# frozen_string_literal: true

class UserMailer < ApplicationMailer
  def magic_link
    @email = params[:email]
    @action = params[:is_sign_up] ? 'sign_up' : 'sign_in'
    @url = auth_callback_users_url(provider: 'magic_link', token: params[:token])
    mail(subject: t('mailer.users.magic_link.subject'), to: @email)
  end
end
