# frozen_string_literal: true

class UserMailerPreview < ActionMailer::Preview
  def magic_link
    token = Brickdoc::Utils::Encoding::UUID.gen_short
    email = 'foo@example.org'
    UserMailer.with(token: token, email: email, is_sign_up: true).magic_link
  end
end
