# frozen_string_literal: true
FactoryBot.define do
  factory :docs_block, class: 'Docs::Block' do
    pod
    meta { { foo: :bar } }
    data { { data: [1, 2, 3] } }
    collaborators { [1, 2, 3] }
  end
end
