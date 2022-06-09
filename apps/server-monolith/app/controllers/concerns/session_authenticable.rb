# frozen_string_literal: true

module SessionAuthenticable
  extend ActiveSupport::Concern

  included do
    before_action :load_current_user_from_session
  end

  private

  # Try to load current user from session if it exists
  def load_current_user_from_session
    user_id = session[:current_user_id]
    return nil unless user_id

    Current.user ||= User.find_by(id: Brickdoc::Crypto.int_id_deobfuscate(user_id))
  end

  # Set current user to the specified user
  # @param [User] user which is authenticated
  # @raise [ArgumentError] when user is not presisted in database
  def sign_in!(user)
    raise ArgumentError, 'User is not found in database' unless user.persisted?

    session[:current_user_id] = Brickdoc::Crypto.int_id_obfuscate(user.id)
    Current.user = user
  end

  # Reset current user to nil
  def sign_out!
    session[:current_user_id] = nil
    Current.user = nil
  end

  # Require user must be signed in
  # could be used in before_action
  def require_signed_in
    unless Current.user
      return_path = request.get? ? request.path : URI(request.referer.presence || '/').path
      redirect_to sign_in_users_path(continue: return_path)
    end
  end

  # Require user must be not signed in
  # could be used in before_action
  def require_not_signed_in
    redirect_to root_path if Current.user
  end
end
