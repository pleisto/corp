# frozen_string_literal: true

module OmniAuth
  module LocalFormStrategy
    def self.included(base)
      base.class_eval do
        # Return Active Model Errors to be used in the UI
        def vaildate_fail!(errors)
          env['omniauth.error.errors'] = errors
          env['omniauth.error.type'] = 'active_model_errors'
          env['omniauth.error.strategy'] = self
          log :info, "#{name} vaildate failed: #{errors.full_messages.join(', ')}"
          OmniAuth.config.on_failure.call(env)
        end
      end
    end
  end
end
