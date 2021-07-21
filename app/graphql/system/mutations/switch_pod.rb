# frozen_string_literal: true
module System
  class Mutations::SwitchPod < BrickGraphQL::BaseMutation
    argument :webid, String, "webid", required: true

    def resolve(webid:)
      pod = current_user.pods.find_by(webid: webid)
      return { errors: [I18n.t('accounts.errors.invalid_pod_webid')] } unless pod

      context[:warden].session['current_pod'] = pod.as_session_context
      {}
    end
  end
end
