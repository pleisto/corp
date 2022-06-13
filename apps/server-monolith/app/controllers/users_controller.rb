# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :require_sign_up_enabled, only: [:new, :create, :check_username]
  before_action :require_not_signed_in, only: [:new, :create]

  def new
    payload = session[:omniauth_hash]
    # If password auth is disabled, only allow sign up with identity provider payload.
    password_sign_up = BrickdocConfig.accounts.password_auth_enabled && params[:provider] === 'password'
    redirect_to(sign_in_users_path) && return if payload.blank? && !password_sign_up

    @page_title = t('users.sign_up.title')
    render inertia: 'UsersNew', props: {
      payload: password_sign_up ? nil : payload,
    }
  end

  def create
    hash = session[:omniauth_hash]
    @user = User.new(username: params[:username])
    @user.display_name = hash.dig(:info, :name) || @user.username
    @user.external_avatar_url = hash.dig(:info, :image)
    if params[:password].present? && BrickdocConfig.accounts.password_auth_enabled
      password = @user.build_password_authenticate
      password.password = params[:password]
      password.password_confirmation = params[:password_confirmation]
      identity = @user.build_identity(provider: 'password')
      identity.subject = @user.id
    elsif hash[:provider] === :magic_link
      magic_link = @user.build_magic_link_authenticate
      magic_link.email = hash[:info][:email]
      identity = @user.build_identity(provider: 'magic_link')
      identity.subject = magic_link.email
    else
      identity = @user.build_identity(provider: hash[:provider])
      identity.subject = hash[:uid]
      identity.meta = hash[:info].as_json
    end
    if @user.save
      sign_in!(@user)
      redirect_to session.delete(:continue) || root_path
    else
      render inertia: 'UsersNew', props: {
        payload:  params[:password].present? ? nil : hash,
        errors: @user.errors,
      }
    end
  end

  def magic_link_sent
    @email = Brickdoc::Utils::Encoding::Base58.decode(params[:e])
    if !Users::Identity.provider?('magic_link') || @email.exclude?('@')
      redirect_to(sign_in_users_path, alert: t('users.sign_in.unknown_failed')) && return
    end

    render inertia: 'UsersMagicLinkSent', status: :created, props: {
      email: @email,
    }
  end

  def check_username
    render json: { available: Pod.username_available?(params[:username]) }
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
