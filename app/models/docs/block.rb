# frozen_string_literal: true

# == Schema Information
#
# Table name: docs_blocks
#
#  id                 :uuid             not null, primary key
#  collaborators      :bigint           default([]), not null, is an Array
#  data(data props)   :jsonb            not null
#  deleted_at         :datetime
#  history_version    :bigint           default(0), not null
#  meta(metadata)     :jsonb            not null
#  parent_type        :string(32)
#  snapshot_version   :bigint           default(0), not null
#  sort               :decimal(15, 10)  default(0.0), not null
#  type               :string(32)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  parent_id          :uuid
#  pod_id             :bigint
#
# Indexes
#
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

  before_save do
    ## TODO add redis lock
    self.history_version = history_version + 1 if meta_changed? || data_changed?
  end

  after_save do
    histories.create! if history_version_previously_changed? || id_previously_changed?
    snapshots.create! if snapshot_version_previously_changed?
  end

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

  def descendants_v1(columns = self.class.column_names)
    cols = columns.join(', ')
    parent_id = ActiveRecord::Base.connection.quote(id)
    self.class.from <<~SQL
      (WITH RECURSIVE recursive(#{cols}, path) AS (
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
        recursive
        JOIN
          docs_blocks ON docs_blocks.parent_id = recursive.id
      ) SELECT * FROM recursive) as docs_blocks
    SQL
  end

  # https://stackoverflow.com/a/30924648
  def descendants_v3(_columns = self.class.column_names)
    hierarchy = self.class.arel_table
    recursive_table = hierarchy.alias :recursive
    select_manager = Arel::SelectManager.new(ActiveRecord::Base).freeze

    non_recursive_term = select_manager.dup.tap do |m|
      m.from self.class.table_name
      m.project Arel.star
      m.where hierarchy[:id].eq(id)
    end

    recursive_term = select_manager.dup.tap do |m|
      m.from recursive_table
      m.project recursive_table[Arel.star]
      m.join hierarchy
      m.on recursive_table[:id].eq(hierarchy[:parent_id])
    end

    union = non_recursive_term.union :all, recursive_term
    as_statement = Arel::Nodes::As.new hierarchy, union

    manager = select_manager.dup.tap do |m|
      m.with :recursive, as_statement
      m.from hierarchy
      m.project Arel.star
    end

    ids = ActiveRecord::Base.connection.execute(manager.to_sql).field_values('id')
    ordering = ids.map { |id| hierarchy[:id].eq(id) }

    self.class.where(id: id).order(ordering)
  end

  def path_cache
    return [id] if parent_id.nil?

    ## TODO read path cache from Current module
    ancestors_v1(['id', 'parent_id']).pluck(:path).sort_by(&:length).last
  end

  def latest_history
    histories.find_by!(history_version: history_version)
  end

  def save_snapshot!
    ## TODO add redis lock
    update!(snapshot_version: snapshot_version + 1)
  end

  def current_histories
    Docs::History.from_meta(children_version_metas)
  end

  def children_version_metas
    descendants_v1(['id', 'history_version', 'parent_id']).pluck(:id, :history_version).to_h
  end
end
