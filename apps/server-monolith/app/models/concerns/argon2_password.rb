# frozen_string_literal: true

# Argon2id password authentication concern
# Forked from https://github.com/rails/rails/blob/main/activemodel/lib/active_model/secure_password.rb | MIT License
module Argon2Password
  extend ActiveSupport::Concern

  module ClassMethods
    # Adds methods to set and authenticate against a Argon2id password.
    # This mechanism requires you to have a +XXX_digest+ attribute.
    # Where +XXX+ is the attribute name of your desired password.
    #
    # The following validations are added automatically:
    # * Password must be present on creation
    # * Password length should be less than or equal to 72 bytes
    # * Confirmation of password (using a +XXX_confirmation+ attribute)
    #
    # If confirmation validation is not needed, simply leave out the
    # value for +XXX_confirmation+ (i.e. don't provide a form field for
    # it). When this attribute has a +nil+ value, the validation will not be
    # triggered.
    #
    # For further customizability, it is possible to suppress the default
    # validations by passing <tt>validations: false</tt> as an argument.
    #
    # Example using Active Record (which automatically includes ActiveModel::SecurePassword):
    #
    #   # Schema: User(name:string, password_digest:string, recovery_password_digest:string)
    #   class User < ActiveRecord::Base
    #     has_argon2_password
    #     has_argon2_password :recovery_password, validations: false
    #   end
    #
    #   user = User.new(name: 'david', password: '', password_confirmation: 'nomatch')
    #   user.save                                                  # => false, password required
    #   user.password = 'mUc3m00RsqyRe'
    #   user.save                                                  # => false, confirmation doesn't match
    #   user.password_confirmation = 'mUc3m00RsqyRe'
    #   user.save                                                  # => true
    #   user.recovery_password = "42password"
    #   user.recovery_password_digest                              # => "$2a$04$iOfhwahFymCs5weB3BNH/uXkTG65HR.qpW.bNhEjFP3ftli3o5DQC"
    #   user.save                                                  # => true
    #   user.authenticate('notright')                              # => false
    #   user.authenticate('mUc3m00RsqyRe')                         # => user
    #   user.authenticate_recovery_password('42password')          # => user
    #   User.find_by(name: 'david')&.authenticate('notright')      # => false
    #   User.find_by(name: 'david')&.authenticate('mUc3m00RsqyRe') # => user
    def has_argon2_password(attribute = :password, validations: true)
      include InstanceMethodsOnActivation.new(attribute)

      if validations
        include ActiveModel::Validations

        # This ensures the model has a password by checking whether the password_digest
        # is present, so that this works with both new and existing records. However,
        # when there is an error, the message is added to the password attribute instead
        # so that the error message will make sense to the end-user.
        validate do |record|
          record.errors.add(attribute, :blank) if record.public_send("#{attribute}_digest").blank?
        end

        validates attribute, confirmation: { allow_blank: true }
      end
    end
  end

  class InstanceMethodsOnActivation < Module
    # rubocop:disable Lint/MissingSuper
    def initialize(attribute)
      attr_reader attribute

      define_method("#{attribute}=") do |unencrypted_password|
        if unencrypted_password.nil?
          instance_variable_set("@#{attribute}", nil)
          public_send("#{attribute}_digest=", nil)
        elsif !unencrypted_password.empty?
          instance_variable_set("@#{attribute}", unencrypted_password)
          public_send("#{attribute}_digest=",
            Brickdoc::Utils::Crypto::Argon2id.hash_password(unencrypted_password))
        end
      end

      define_method("#{attribute}_confirmation=") do |unencrypted_password|
        instance_variable_set("@#{attribute}_confirmation", unencrypted_password)
      end

      # Returns +self+ if the password is correct, otherwise +false+.
      #
      #   class User < ActiveRecord::Base
      #     has_argon2_password validations: false
      #   end
      #
      #   user = User.new(name: 'david', password: 'mUc3m00RsqyRe')
      #   user.save
      #   user.authenticate_password('notright')      # => false
      #   user.authenticate_password('mUc3m00RsqyRe') # => user
      define_method("authenticate_#{attribute}") do |unencrypted_password|
        attribute_digest = public_send("#{attribute}_digest")
        attribute_digest.present? &&
          Brickdoc::Utils::Crypto::Argon2id.verify_password(attribute_digest, unencrypted_password) && self
      end

      alias_method :authenticate, :authenticate_password if attribute == :password
    end
  end
end
