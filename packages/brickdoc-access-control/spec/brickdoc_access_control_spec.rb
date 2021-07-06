# frozen_string_literal: true

require 'spec_helper'

class BrickAcTestPersistor
  include BrickdocAccessControl::PersistorBase

  def initialize
    @ac_persists = {}
    @test_model_cache = {}
  end

  def persist_key(object)
    key = super(object)
    @test_model_cache[key] = object
    key
  end

  def get_object(persist_key)
    @test_model_cache[persist_key]
  end

  def get_persist(resource, actor)
    @ac_persists.dig(persist_key(resource), actor_key(actor))
  end

  def set_persist(resource, actor, attrs = {})
    resource_key = persist_key(resource)
    @ac_persists[resource_key] ||= {}
    persist_value = @ac_persists[resource_key][actor_key(actor)] || { roles: [], abilities: [], attrs: {} }
    yield persist_value
    persist_value[:abilities].uniq!
    persist_value[:roles].uniq!
    persist_value[:attrs].merge!(attrs)
    @ac_persists[resource_key][actor_key(actor)] = persist_value
  end

  def get_actors(resource, role)
    @ac_persists.dig(persist_key(resource))&.select do |_, value|
      value[:roles].include?(role)
    end&.map { |a, v| [get_object(a), v[:attrs]] }.to_h
  end
end

describe BrickdocAccessControl do
  context 'basic' do
    it 'can define access rules then check' do
      mock_model('Block')
      mock_model('User')

      block1 = stub_model(Block, id: SecureRandom.uuid)
      owner1 = stub_model(User, id: SecureRandom.uuid)
      owner2 = stub_model(User, id: SecureRandom.uuid)
      editor1 = stub_model(User, id: SecureRandom.uuid)
      viewer1 = stub_model(User, id: SecureRandom.uuid)

      BrickdocAccessControl.for_actor User do
        persist_to BrickAcTestPersistor.new

        to Block do
          roles :owner, :editor, :viewer

          permit :view
          permit :edit, roles: [:owner, :editor]
          permit :delete, role: :owner do |actor, _resource, _roles, _attrs|
            actor == owner2
          end
        end
      end

      block1.add_actor!(:editor, editor1)
      block1.add_actor!(:owner, owner1, creator: true)
      block1.add_actor!(:owner, owner2)

      expect(viewer1.can?(:view, block1)).to be(true)
      expect(viewer1.can?(:edit, block1)).to be(false)

      expect(editor1.can?(:edit, block1)).to be(true)
      expect(owner1.can?(:edit, block1)).to be(true)
      expect(owner2.can?(:edit, block1)).to be(true)

      expect(owner1.can?(:delete, block1)).to be(false)
      expect(owner2.can?(:delete, block1)).to be(true)

      expect do |b|
        editor1.can?(:edit, block1, &b)
      end.to yield_control

      owner1.can?(:edit, block1) do |roles, attrs|
        expect(roles).to include(:owner)
        expect(attrs[:creator]).to be(true)
      end

      expect(block1.get_actors(:editor).length).to be(1)

      expect(block1.get_actors(:editor).keys.first).to eq(editor1)
      expect(block1.get_actors(:editor).values.first).to eq({})

      block1.remove_actor!(:owner, owner2)

      expect(owner2.can?(:delete, block1)).to be(false)

      block1.grant!(:delete, viewer1)
      expect(viewer1.can?(:delete, block1)).to be(true)

      block1.revoke!(:delete, viewer1)
      expect(viewer1.can?(:delete, block1)).to be(false)
    end
  end

  context 'current cache' do
    it 'run ability check and cache result' do
      mock_model('Block')
      mock_model('User')

      view_check_count = 0

      BrickdocAccessControl.for_actor User do
        persist_to BrickAcTestPersistor.new
        cache_to BrickdocAccessControl::CurrentCache

        to Block do
          roles :owner, :editor, :viewer

          permit :view do
            view_check_count += 1
          end
          permit :edit, roles: [:owner, :editor]
        end
      end

      block1 = stub_model(Block, id: SecureRandom.uuid)
      owner1 = stub_model(User, id: SecureRandom.uuid)
      viewer1 = stub_model(User, id: SecureRandom.uuid)

      block1.add_actor!(:owner, owner1)
      block1.add_actor!(:viewer, viewer1)

      expect(view_check_count).to eq(0)
      expect(BrickdocAccessControl::CurrentCache.check_cache).to eq(nil)

      expect(viewer1.can?(:view, block1)).to be(true)

      expect(BrickdocAccessControl::CurrentCache.check_cache.length).to eq(1)
      expect(view_check_count).to eq(1)

      expect(viewer1.can?(:view, block1)).to be(true)

      expect(view_check_count).to eq(1)
    end
  end
end
