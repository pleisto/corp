# frozen_string_literal: true

class SessionsController < ApplicationController
  before_action :require_signed_in, only: [:destroy]
  before_action :require_not_signed_in, only: [:new]

  # GET /users/sign_in
  def new
    # save the original url to redirect to after sign in
    session[:continue] = URI(params[:continue]).path if params[:continue]
    @page_title = t('users.sign_in.title')
    render inertia: 'SessionsNew', props: {
      providers: Users::Identity.providers_settings.as_json,
      signUpEnabled: BrickdocConfig.accounts.sign_up_enabled,
      currentProvider: params[:current_provider],
    }
  end

  # OmniAuth callback when provider authentication is successful
  # @throws [:routing_error] When the provider is not supported.
  def callback
    raise ActionController::RoutingError, 'Auth Provider Not Found' unless Users::Identity.provider?(params[:provider])
    raise ActionController::BadRequest, 'Missing Callback Payload' if omniauth_hash.blank?

    identity = Users::Identity.find_by(provider: omniauth_hash[:provider], subject: omniauth_hash[:uid])
    if identity.present?
      sign_in!(identity.user)
      redirect_to session.delete(:continue) || root_path
    elsif BrickdocConfig.accounts.sign_up_enabled
      session[:omniauth_hash] = omniauth_hash
      redirect_to sign_up_users_path
    else
      # When sign up is disabled, render a Error page.
      render inertia: 'ErrorPanel', props: {
        title: t('status.forbidden'),
        message: t('users.sign_in.sign_up_disabled'),
      }, status: :forbidden
    end
  end

  # DELETE /users/sign_out
  def destroy
    sign_out!
    redirect_to sign_in_users_path, success: t('users.sign_out.success')
  end

  # OmniAuth failure callback
  def failure
    error_type = request.env['omniauth.error.type'].to_s || params[:error]
    message = request.env['omniauth.error']&.message || params[:error_description]
    provider_id = request.env['omniauth.error.strategy']&.name
    case error_type
    in 'active_model_errors'
      redirect_to sign_in_users_path(current_provider: provider_id), inertia: { errors: request.env['omniauth.error.errors'] }
    in 'redirect_uri_mismatch'
      redirect_to sign_in_users_path, alert: message
    in NilClass
      redirect_to sign_in_users_path, alert: t('users.sign_in.unknown_failed')
    else
      render inertia: 'ErrorPanel', props: {
        title: "Error: #{error_type}",
        message: params[:error_description],
      }, status: :bad_request
    end
  end

  private

  def omniauth_hash
    return @omniauth_hash if @omniauth_hash

    auth = request.env['omniauth.auth']
    username = auth.info&.username || auth.info&.login || auth.info&.email&.split('@')&.first
    @omniauth_hash = {
      provider: auth.provider,
      uid: auth.uid,
      info: {
        username: username,
        email: auth.info&.email,
        name: auth.info&.name || username,
        avatar: auth.info&.image,
      },
    }
  end
end
