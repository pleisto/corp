# frozen_string_literal: true

# rubocop:disable Layout/LineLength

class DropOldDocsSnapshotsAndHistories < ActiveRecord::Migration[7.0]
  def change
    drop_table 'docs_snapshots', force: :cascade do |t|
      t.bigint 'space_id'
      t.uuid 'block_id', null: false
      t.bigint 'snapshot_version', null: false
      t.jsonb 'version_meta', comment: 'child block_id and history_version map'
      t.string 'name'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
      t.index ['block_id', 'snapshot_version'], name: 'index_docs_snapshots_on_block_id_and_snapshot_version', unique: true, comment: 'snapshot identifier'
      t.index ['space_id'], name: 'index_docs_snapshots_on_space_id'
    end

    drop_table 'docs_histories', force: :cascade do |t|
      t.bigint 'space_id'
      t.jsonb 'meta', null: false
      t.jsonb 'data', null: false
      t.uuid 'block_id', null: false
      t.uuid 'parent_id'
      t.string 'type', limit: 32
      t.bigint 'sort', null: false
      t.bigint 'history_version', null: false
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
      t.jsonb 'content', default: [], comment: 'node content'
      t.text 'text', default: '', comment: 'node text'
      t.datetime 'deleted_at'
      t.index ['block_id', 'history_version'], name: 'index_docs_histories_on_block_id_and_history_version', unique: true, comment: 'history identifier'
      t.index ['space_id'], name: 'index_docs_histories_on_space_id'
    end
  end
end
