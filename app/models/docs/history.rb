# frozen_string_literal: true

# == Schema Information
#
# Table name: docs_histories
#
#  id                      :bigint           not null, primary key
#  children                :uuid             is an Array
#  data                    :jsonb            not null
#  meta                    :jsonb            not null
#  snapshots(snapshot ids) :bigint           default([]), not null, is an Array
#  version                 :bigint           not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  block_id                :uuid             not null
#  pod_id                  :bigint
#
# Indexes
#
#  index_docs_histories_on_block_id_and_version  (block_id,version) UNIQUE
#  index_docs_histories_on_pod_id                (pod_id)
#  index_docs_histories_on_snapshots             (snapshots) USING gin
#
class Docs::History < ApplicationRecord
  belongs_to :pod, optional: true
  belongs_to :block

  before_create do
    self.pod_id = block.pod_id
    self.version = block.version
    self.data = block.data
    self.meta = block.meta
    self.children = block.children
  end
end
