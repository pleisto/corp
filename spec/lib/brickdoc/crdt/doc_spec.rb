# frozen_string_literal: true

require "rails_helper"

describe Brickdoc::Crdt::Doc do
  def map_type_fragment_1
    { type: :map, slug: "map_1" }
  end

  def map_type_fragment_2
    { type: :map, slug: "map_2" }
  end

  def counter_type_fragment_1
    { type: :counter, slug: "counter_1" }
  end

  context ".seq" do
    def initial_args
      { document_identity_obj: { tenant_id: 1, doc_id: 1 } }
    end

    before(:all) do
      @doc = described_class.new(**initial_args)
    end
  end
end
