# frozen_string_literal: true
module System
  class Mutations::CreateOrUpdatePod < BrickGraphQL::BaseMutation
    argument :webid, String, "webid", required: true
    argument :name, String, "pod name", required: true
    argument :type, Enums::PodOperationType, required: true
    field :pod, Objects::Pod, null: true

    def resolve(webid:, type:, name:)
      pod = current_user.pods.find { |p| p.webid == webid }

      case type
      when "CREATE"
        return { errors: [I18n.t('accounts.errors.pod_exist')] } if pod

        pod = Pod.create!(owner_id: current_user.id, name: name, webid: webid)
      when "UPDATE"
        return { errors: [I18n.t('accounts.errors.pod_not_exist')] } if pod.nil?

        pod.update!(name: name)
      else
        return { errors: [I18n.t('accounts.errors.invalid_operation_type')] }
      end

      {
        pod: pod
      }
    end
  end
end
