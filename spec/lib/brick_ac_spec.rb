# frozen_string_literal: true

require 'rails_helper'

describe BrickAc do
  
  context 'basic' do

    def get_resource_test_persist_key(resource)
      resource.class_name + ':' + resource.id
    end

    class BrickAcTestPersistor
      def initialize
        @ac_persists = {}
      end

      def get_persist_key(resource)
        "#{resource.class.name}:#{resource.id}"
      end

      def get_persist(actor, resource)
        @ac_persists.dig(get_persist_key(resource), get_persist_key(actor))
      end

      def set_persist(actor, resource, roles, attrs = {})
        resource_key = get_persist_key(resource)
        @ac_persists[resource_key] ||= {}
        @ac_persists[resource_key][get_persist_key(actor)] = {roles: roles, attrs: attrs}
      end
    end
    
    it 'can define access rules then check' do
      block1 = create(:docs_block)
      owner1 = create(:accounts_user)
      owner2 = create(:accounts_user)
      editor1 = create(:accounts_user)
      viewer1 = create(:accounts_user)

      BrickAc.for_actor Accounts::User do
        persist_to BrickAcTestPersistor.new

        to Docs::Block do
          roles :owner, :editor, :viewer

          permit :view
          permit :edit, roles: [:owner, :editor]
          permit :delete, role: :owner do |actor, resource, roles, attrs|
            actor == owner2
          end
        end
      end

      block1.grant!(editor1, :editor)
      block1.grant!(owner1, :owner)
      block1.grant!(owner2, :owner)


      expect(viewer1.can?(:view, block1)).to be(true)
      expect(viewer1.can?(:edit, block1)).to be(false)

      expect(editor1.can?(:edit, block1)).to be(true)
      expect(owner1.can?(:edit, block1)).to be(true)
      expect(owner2.can?(:edit, block1)).to be(true)


      expect(owner1.can?(:delete, block1)).to be(false)
      expect(owner2.can?(:delete, block1)).to be(true)
    end

  end

end
