# frozen_string_literal: true
module System
  class Mutations::CreatePod < BrickGraphQL::BaseMutation
    argument :webid, String, "webid", required: true
    argument :name, String, "pod name", required: true
    field :pod, Objects::Pod, null: false

    def resolve(webid:, name:)
      pod = Pod.create!(owner_id: current_user.id, name: name, webid: webid)

      {
        pod: pod
      }
    end
  end
end
