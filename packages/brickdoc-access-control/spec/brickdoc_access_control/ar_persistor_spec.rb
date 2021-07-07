# frozen_string_literal: true

require 'spec_helper'

require 'active_record'

ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")

ActiveRecord::Schema.define do
  self.verbose = false

  create_table :brick_ac_test_ar_persistors, force: true do |t|
    t.integer :user_id, null: false
    t.string :resource_key, null: false
    t.text :roles
    t.text :attrs
    t.text :abilities
  end

  create_table :brick_ac_test_users, force: true do
  end
end

ActiveRecord::Base.cache_versioning = true if ActiveRecord::Base.respond_to?(:cache_versioning)

class BrickAcTestArPersistor < ActiveRecord::Base
  include BrickdocAccessControl::ActiveRecordPersistor

  belongs_to :user, class_name: 'BrickAcTestUser', foreign_key: :user_id

  serialize :roles, Array
  serialize :attrs, Hash
  serialize :abilities, Array

  def self.get_persist_relation(resource, actor)
    where(resource_key: persist_key(resource), user_id: actor.id)
  end

  def self.get_actors(resource, role)
    where(resource_key: persist_key(resource)).includes(:user).select do |row|
      row.roles.include?(role)
    end.map { |r| [r.user, r.attrs.symbolize_keys] }.to_h
  end
end

class BrickAcTestUser < ActiveRecord::Base
end

describe BrickdocAccessControl do
  context BrickdocAccessControl::ActiveRecordPersistor do
    it 'can persist to ArPersistor' do
      mock_model('Block')
      mock_model('User')

      block1 = stub_model(Block, id: SecureRandom.uuid)
      owner1 = BrickAcTestUser.create!
      editor1 = BrickAcTestUser.create!
      viewer1 = BrickAcTestUser.create!

      BrickdocAccessControl.for_actor BrickAcTestUser do
        persist_to BrickAcTestArPersistor

        to Block do
          roles :owner, :editor, :viewer

          permit :view
          permit :edit, roles: [:owner, :editor]
          permit :delete, role: :owner
        end
      end

      block1.add_actor!(:editor, editor1, { key: 'value' })
      block1.add_actor!(:owner, owner1, creator: true)

      expect(viewer1.can?(:view, block1)).to be(true)
      expect(viewer1.can?(:edit, block1)).to be(false)

      expect(editor1.can?(:edit, block1)).to be(true)
      expect(owner1.can?(:edit, block1)).to be(true)
      expect(owner1.can?(:delete, block1)).to be(true)

      expect(block1.get_actors(:editor).length).to be(1)

      expect(block1.get_actors(:editor).keys.first).to eq(editor1)
      expect(block1.get_actors(:editor).values.first).to eq({ key: 'value' })

      block1.remove_actor!(:owner, owner1)

      expect(owner1.can?(:delete, block1)).to be(false)

      block1.grant!(:delete, viewer1)
      expect(viewer1.can?(:delete, block1)).to be(true)

      block1.revoke!(:delete, viewer1)
      expect(viewer1.can?(:delete, block1)).to be(false)
    end
  end
end
