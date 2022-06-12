# frozen_string_literal: true

class DropDocsDocuments < ActiveRecord::Migration[7.0]
  def change
    drop_table 'docs_documents', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
      t.binary 'state'
      t.uuid 'state_id'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
    end
  end
end
