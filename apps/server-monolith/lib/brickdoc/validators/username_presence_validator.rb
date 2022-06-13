# frozen_string_literal: true

module Brickdoc
  module Validators
    class UsernamePresenceValidator < ActiveModel::Validator
      def validate(record)
        field = options[:field]
        username = record.send(field)

        exists = Pod.exists?(username: username)

        record.errors.add field, ::I18n.t('errors.messages.username_presence_invalid') unless exists
      end
    end
  end
end
