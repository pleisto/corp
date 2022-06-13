# frozen_string_literal: true

module Brickdoc
  module Validators
    class UsernameValidator < ActiveModel::EachValidator
      # username limited to alphanumerics and hyphens, and must start and end with an alphanumeric.
      REGEXP = /\A[a-z0-9]+(-[a-z0-9]+)*\z/i

      def validate_each(record, attribute, value)
        if value !~ REGEXP || Brickdoc::UsernameDenylist.all.include?(value)
          record.errors.add attribute, ::I18n.t('errors.messages.username_invalid')
        end
      end
    end
  end
end
