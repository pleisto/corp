# frozen_string_literal: true

module Brickdoc
  module Crdt
    class Change
      attr_reader :document_identity_obj, :fragment_identity_obj, :fragment_identity_key, :action, :context, :actor, :old_seq,
                  :return_type, :new_seq, :data, :store, :new_gseq, :old_gseq

      def initialize(identities, new_seq, new_gseq, store, action:, actor:, old_seq:, old_gseq:, context:, return_type:, data:)
        @document_identity_obj = identities.fetch(:document_identity_obj)
        @fragment_identity_obj = identities.fetch(:fragment_identity_obj)
        @fragment_identity_key = "#{@fragment_identity_obj.fetch(:type)}/#{@fragment_identity_obj.fetch(:slug)}"

        @action = action
        @actor = actor
        @old_seq = old_seq
        @old_gseq = old_gseq
        @new_gseq = new_gseq
        @new_seq = new_seq
        @store = store
        @context = context
        @return_type = return_type
        @data = data
      end
    end
  end
end
