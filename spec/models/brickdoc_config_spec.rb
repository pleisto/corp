# frozen_string_literal: true
require 'rails_helper'

RSpec.describe BrickdocConfig, type: :model do
  it 'can be read' do
    # expect(BrickdocConfig.accounts_federated_providers.first[:name]).to eq('github')
    expect(BrickdocConfig.accounts_email_password_auth?).to eq(true)
  end

  it 'can expose settings fields to frontend context' do
    BrickdocConfig.field :test_fe_field, default: 'test', frontend: true
    BrickdocConfig.scope(:fe_scope).field :test_fe_field2, default: 'test', frontend: true

    expect(BrickdocConfig.frontend_fields['']).to include('test_fe_field')
    expect(BrickdocConfig.frontend_fields['fe_scope']).to include('test_fe_field2')

    frontend_context = BrickdocConfig.to_frontend

    expect(frontend_context['']['test_fe_field']).to eq('test')
    expect(frontend_context['fe_scope']['test_fe_field2']).to eq('test')
  end
end
