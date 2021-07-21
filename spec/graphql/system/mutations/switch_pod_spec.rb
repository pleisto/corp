# frozen_string_literal: true

require 'rails_helper'

describe System::Mutations::SwitchPod, type: :mutation do
  describe '#resolve' do
    mutation = <<-'GRAPHQL'
      mutation switchPod($input: SwitchPodInput!) {
        switchPod(input: $input) {
          errors
        }
      }
    GRAPHQL

    let(:password) { FFaker::Internet.password }
    let(:user) { create(:accounts_user, password: password) }

    it 'work' do
      self.current_user = user
      self.current_pod = user.personal_pod.as_session_context

      input = { input: { webid: user.personal_pod.webid } }
      internal_graphql_execute(mutation, input)
      expect(response.errors).to eq({})
      expect(response.data[:switchPod][:errors]).to eq([I18n.t('accounts.errors.pod_has_already_switched')])

      second_pod = user.pods.create!(webid: "NEW#{user.id}", name: "NEW#{user.id}")

      input = { input: { webid: second_pod.webid } }
      internal_graphql_execute(mutation, input)

      expect(response.errors).to eq({})
      expect(response.data[:switchPod][:errors]).to eq([])
      self.current_user = nil
      self.current_pod = nil
    end
  end
end
