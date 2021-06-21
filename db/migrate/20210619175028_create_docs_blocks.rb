# frozen_string_literal: true
class CreateDocsBlocks < ActiveRecord::Migration[6.1]
  def change
    create_table :docs_blocks do |t|
      t.belongs_to :pods, index: true
      t.string :type, limit: 32
      t.belongs_to :parent, null: true, type: :uuid, index: true
      t.string :parent_type, limit: 32
      t.jsonb :meta, null: false, default: {}, comment: 'metadata'
      t.jsonb :data, null: false, comment: 'data props'
      t.column :children, :uuid, array: true
      t.bigint :collaborators, array: true, default: [], null: false
      t.datetime :deleted_at, null: true, index: true

      t.timestamps
      t.index :children, using: :gin
    end
  end
end
