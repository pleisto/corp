# frozen_string_literal: true

require 'spec_helper'

require 'active_record'

ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")

ActiveRecord::Schema.define do
  self.verbose = false

  create_table :brick_ac_test_ar_persistors, force: true do |t|
    t.string :actor_key, null: false
    t.string :resource_key, null: false
    t.text :roles
    t.text :attrs
    t.text :abilities
  end
end

ActiveRecord::Base.cache_versioning = true if ActiveRecord::Base.respond_to?(:cache_versioning)

class BrickAcTestArPersistor < ActiveRecord::Base
  include BrickdocAccessControl::ActiveRecordPersistor

  serialize :roles, Array
  serialize :attrs, Hash
  serialize :abilities, Array
end

describe BrickdocAccessControl do
  context BrickdocAccessControl::ActiveRecordPersistor do
    it 'can persist to ArPersistor' do
      mock_model('Block')
      mock_model('User')

      block1 = stub_model(Block, id: SecureRandom.uuid)
      owner1 = stub_model(User, id: SecureRandom.uuid)
      editor1 = stub_model(User, id: SecureRandom.uuid)
      viewer1 = stub_model(User, id: SecureRandom.uuid)

      BrickdocAccessControl.for_actor User do
        persist_to BrickAcTestArPersistor

        to Block do
          roles :owner, :editor, :viewer

          permit :view
          permit :edit, roles: [:owner, :editor]
          permit :delete, role: :owner
        end
      end

      block1.add_actor!(:editor, editor1)
      block1.add_actor!(:owner, owner1, creator: true)

      expect(viewer1.can?(:view, block1)).to be(true)
      expect(viewer1.can?(:edit, block1)).to be(false)

      expect(editor1.can?(:edit, block1)).to be(true)
      expect(owner1.can?(:edit, block1)).to be(true)
      expect(owner1.can?(:delete, block1)).to be(true)

      # expect(block1.get_actors(:editor).length).to be(1)

      # expect(block1.get_actors(:editor).keys.first).to eq(editor1)
      # expect(block1.get_actors(:editor).values.first).to eq({})

      block1.remove_actor!(:owner, owner1)

      expect(owner1.can?(:delete, block1)).to be(false)

      block1.grant!(:delete, viewer1)
      expect(viewer1.can?(:delete, block1)).to be(true)

      block1.revoke!(:delete, viewer1)
      expect(viewer1.can?(:delete, block1)).to be(false)
    end
  end
end
