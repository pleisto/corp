# frozen_string_literal: true

class CreateDocsSnapshots < ActiveRecord::Migration[6.1]
  def change
    change_table :docs_blocks do |t|
      t.column :snapshot_version, :bigint, null: false, default: 0
    end

    create_table :docs_snapshots do |t|
      t.belongs_to :pod, index: true
      t.uuid :block_id, null: false, index: true
      t.column :snapshot_version, :bigint, null: false
      t.jsonb :meta, null: false
      t.timestamps
    end

    create_table :docs_histories do |t|
      t.belongs_to :pod, index: true
      t.jsonb :meta, null: false
      t.jsonb :data, null: false
      t.uuid :block_id, null: false
      t.column :children, :uuid, array: true
      t.column :version, :bigint, null: false

      t.bigint :snapshots, array: true, default: [], null: false, comment: 'snapshot ids'
      t.timestamps

      t.index [:block_id, :version], unique: true, comment: "history identifier"
      t.index :snapshots, using: :gin
    end
  end
end
