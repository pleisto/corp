# frozen_string_literal: true

# == Schema Information
#
# Table name: docs_blocks
#
#  id                 :uuid             not null, primary key
#  children           :uuid             is an Array
#  collaborators      :bigint           default([]), not null, is an Array
#  data(data props)   :jsonb            not null
#  deleted_at         :datetime
#  meta(metadata)     :jsonb            not null
#  parent_type        :string(32)
#  snapshot_version   :bigint           default(0), not null
#  type               :string(32)
#  version            :bigint           default(0), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  parent_id          :uuid
#  pod_id             :bigint
#
# Indexes
#
#  index_docs_blocks_on_children       (children) USING gin
#  index_docs_blocks_on_collaborators  (collaborators) USING gin
#  index_docs_blocks_on_deleted_at     (deleted_at)
#  index_docs_blocks_on_parent_id      (parent_id)
#  index_docs_blocks_on_pod_id         (pod_id)
#
class Docs::Block < ApplicationRecord
  self.inheritance_column = :_type_disabled

  belongs_to :pod
  belongs_to :parent, class_name: 'Docs::Block', optional: true
  has_many :histories, dependent: :restrict_with_exception
  has_many :snapshots, dependent: :restrict_with_exception

  validates :meta, presence: true, allow_blank: true
  validates :data, presence: true
  validates :pod, presence: true
  validates :collaborators, presence: true

  def ancestors_v1(columns = self.class.column_names)
    cols = columns.join(', ')
    child_id = ActiveRecord::Base.connection.quote(id)
    self.class.from <<~SQL
      (WITH RECURSIVE org_tree(#{cols}, path) AS (
        SELECT
          #{cols}, ARRAY[id]
        FROM
          docs_blocks
        WHERE
          id = #{child_id}
      UNION ALL
        SELECT
          #{columns.map { |col| "docs_blocks.#{col}" }.join(', ')}, path || docs_blocks.id
        FROM
          org_tree
        JOIN
          docs_blocks ON docs_blocks.id = org_tree.parent_id
      ) SELECT #{cols}, path FROM org_tree) as docs_blocks
    SQL
  end

  def descendants_v1(columns = self.class.column_names, _target_columns = nil)
    cols = columns.join(', ')
    target_cols ||= cols
    parent_id = ActiveRecord::Base.connection.quote(id)
    self.class.from <<~SQL
      (WITH RECURSIVE org_tree(#{cols}, path) AS (
        SELECT
          #{cols}, ARRAY[id]
        FROM
          docs_blocks
        WHERE
          id = #{parent_id}
      UNION ALL
        SELECT
          #{columns.map { |col| "docs_blocks.#{col}" }.join(', ')}, path || docs_blocks.id
        FROM
          org_tree
        JOIN
          docs_blocks ON docs_blocks.id = any(org_tree.children)
      ) SELECT #{target_cols}, path FROM org_tree) as docs_blocks
    SQL
  end

  ## TODO fix this.
  def descendants_v2
    blocks = Arel::Table.new(:docs_blocks)
    descendant_blocks = Arel::Table.new(:descendant_blocks)

    anchor_term = blocks.project(Arel.star).where(blocks[:id].eq(id))
    recursive_term = blocks.project(Arel.star).join(descendant_blocks).on(blocks[:id].eq(descendant_blocks[:parent_id]))

    self.class.with(:recursive, descendant_blocks: anchor_term.union(recursive_term)).from("descendant_blocks AS blocks")
  end

  before_save do
    ## TODO add redis lock
    self.version = version + 1 if meta_changed? || data_changed?
  end

  after_save do
    inner_touch_history! if version_previously_changed? || id_previously_changed?
    inner_save_snapshot! if snapshot_version_previously_changed?
  end

  def save_snapshot!
    ## TODO add redis lock
    update!(snapshot_version: snapshot_version + 1)
  end

  def current_history
    data = descendants_v1(['id', 'version', 'children'], ['id', 'version']).pluck(:id, :version)
    Docs::History.where("(block_id, version) IN (#{data.map { '(? , ?)' }.join(' , ')})", *data.flatten)
  end

  def persist_snapshot!(snapshot_id)
    current_history.update_all(['snapshots = array_append(snapshots, ?::BIGINT)', snapshot_id])
  end

  def inner_save_snapshot!
    snapshots.create!
  end

  def inner_touch_history!
    histories.create!
  end
end
