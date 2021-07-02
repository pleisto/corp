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
        "#{resource.class.name}\n#{resource.id}"
      end

      def get_object(persist_key)
        object_type, object_id = persist_key.split("\n")
        object_type.constantize.find object_id
      end

      def get_persist(actor, resource)
        @ac_persists.dig(get_persist_key(resource), get_persist_key(actor))
      end

      def set_persist(actor, resource, role, attrs = {})
        resource_key = get_persist_key(resource)
        @ac_persists[resource_key] ||= {}
        persist_value = @ac_persists[resource_key][get_persist_key(actor)] || {roles: [], attrs: {}}
        persist_value[:roles].push(role)
        persist_value[:roles].uniq!
        persist_value[:attrs].merge!(attrs)
        @ac_persists[resource_key][get_persist_key(actor)] = persist_value
      end

      def get_actors(resource, role)
        @ac_persists.dig(get_persist_key(resource))&.select do |actor, value|
          value[:roles].include?(role)
        end.map{|a, v| [get_object(a), v[:attrs]]}.to_h
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
      block1.grant!(owner1, :owner, creator: true)
      block1.grant!(owner2, :owner)

      expect(viewer1.can?(:view, block1)).to be(true)
      expect(viewer1.can?(:edit, block1)).to be(false)

      expect(editor1.can?(:edit, block1)).to be(true)
      expect(owner1.can?(:edit, block1)).to be(true)
      expect(owner2.can?(:edit, block1)).to be(true)

      expect(owner1.can?(:delete, block1)).to be(false)
      expect(owner2.can?(:delete, block1)).to be(true)

      expect {|b|
        editor1.can?(:edit, block1, &b)
      }.to yield_control 

      owner1.can?(:edit, block1) do |roles, attrs|
        expect(roles).to include(:owner)
        expect(attrs[:creator]).to be(true)
      end

      expect(block1.actors(:editor).length).to be(1)

      expect(block1.actors(:editor).keys.first).to eq(editor1)
      expect(block1.actors(:editor).values.first).to eq({})
    end

  end

end
