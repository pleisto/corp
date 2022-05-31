# == Schema Information
#
# Table name: docs_conversations
#
#  id                                  :bigint           not null, primary key
#  block_ids(Block ids)                :uuid             default([]), is an Array
#  collaborators                       :bigint           default([]), not null, is an Array
#  latest_reply_at                     :datetime
#  mark_ids(Mark ids)                  :uuid             default([]), is an Array
#  status(opened / resolved / deleted) :integer          not null
#  created_at                          :datetime         not null
#  updated_at                          :datetime         not null
#  doc_id                              :uuid             not null
#  space_id                            :bigint           not null
#
# Indexes
#
#  index_docs_conversations_on_collaborators  (collaborators) USING gin
#  index_docs_conversations_on_doc_id         (doc_id)
#  index_docs_conversations_on_space_id       (space_id)
#
module Docs
  class Conversation < ApplicationRecord
    belongs_to :doc, class_name: 'Docs::Block', foreign_key: :doc_id
    belongs_to :space
    has_many :comments, dependent: :restrict_with_exception

    before_create do
      self.status ||= :opened
    end

    enum status: {
      opened: 0,
      resolved: 1,
      deleted: 10
    }

    def to_graphql
      attributes.merge(comments: comments.map(&:to_graphql))
    end
  end
end
