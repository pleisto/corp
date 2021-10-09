# frozen_string_literal: true
Rails.application.configure do
  # config.console1984.protected_environments = %i[production staging development]
  config.audits1984.auditor_class = "Accounts::User"
end
