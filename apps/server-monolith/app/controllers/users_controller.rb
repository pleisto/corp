# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :require_sign_up_enabled, only: [:new, :create]
  before_action :require_not_signed_in, only: [:new, :create]

  def new
    payload = session[:omniauth_hash]
    # If password auth is disabled, only allow sign up with identity provider payload.
    redirect_to sign_in_users_path if payload.blank? && !BrickdocConfig.accounts.password_auth_enabled
    @page_title = t('users.sign_up.title')
    render inertia: 'UsersNew', props: {
      payload: payload,
    }
  end

  def create
  end

  protected

  def require_sign_up_enabled
    return if BrickdocConfig.accounts.sign_up_enabled

    render inertia: 'ErrorPanel', props: {
      title: t('status.forbidden'),
      message: t('users.sign_up.disabled'),
    }, status: :forbidden
  end
end
