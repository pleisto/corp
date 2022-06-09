# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include I18nable
  include SessionAuthenticable
  # use camelcase variables in typescript
  inertia_share csrfToken: -> { form_authenticity_token }
  inertia_share flash: -> {
                         {
                           success: flash[:success],
                           notice: flash[:notice],
                           alert: flash[:alert],
                         }
                       }
  before_action :set_current_context

  rescue_from ActionController::InvalidAuthenticityToken do
    redirect_back fallback_location: '/', notice: t('status.invalid_csrf_token')
  end

  # memoize extended edition view path
  def self.extended_edition_view_path
    @extended_edition_path ||= begin
      return nil unless Brickdoc::Plugins::ServerPlugin.extended_edition_path

      File.join(Brickdoc::Plugins::ServerPlugin.extended_edition_path, 'app/views')
    end
  end

  protected

  # Set current context by request context
  def set_current_context
    Current.request_id = request.uuid
    Current.ip_address = request.remote_ip
  end

  # Load view path for a plugin that declares themselves as an extended edition
  def set_prepend_view_path
    prepend_view_path(self.class.extended_edition_view_path) if self.class.extended_edition_view_path
  end
end
