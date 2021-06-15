# frozen_string_literal: true

require "rails_helper"

describe Brickdoc::Crdt::Stores::File do
  context ".file" do
    def initial_args
      { document_identity_obj: { tenant_id: 1, doc_id: 1 } }
    end

    before(:all) do
      @obj = described_class.new(**initial_args)
    end

    it "initial value is nil" do
      expect(@obj.read_raw).to eq(nil)
      expect(@obj.fetch_seqs(initial_args)).to eq({})
    end

    it "persist seqs" do
      expect(@obj.persist_seqs!(initial_args, { foo: :bar })).to eq(:ok)
      expect(@obj.fetch_seqs(initial_args)).to eq({ foo: :bar })
      expect(@obj.persist_seqs!(initial_args, { foo: :baz, hello: :world })).to eq(:ok)
      expect(@obj.fetch_seqs(initial_args)).to eq({ foo: :baz, hello: :world })
    end

    it "write_raw and read_raw" do
      obj = { complex: [1, true, :foo, "bar", hello: :world] }
      @obj.write_raw(obj)
      expect(@obj.read_raw).to eq(obj)
    end

    it "data set and get" do
      key = "foo1"
      value = "bar"

      expect(@obj.data_get(initial_args, key)).to eq(nil)
      expect(@obj.data_set(initial_args, key, value)).to eq(:ok)
      expect(@obj.data_get(initial_args, key)).to eq(value)
      expect(@obj.data_delete(initial_args, key)).to eq(:ok)
      expect(@obj.data_get(initial_args, key)).to eq(nil)
    end

    it "set add and remove" do
      key = "foo2"
      expect(@obj.data_get(initial_args, key)).to eq(nil)
      expect(@obj.array_add(initial_args, key, :baz)).to eq(:ok)
      expect(@obj.data_get(initial_args, key)).to eq([:baz])
      expect(@obj.array_remove(initial_args, key, :bar)).to eq(:ok)
      expect(@obj.data_get(initial_args, key)).to eq([:baz])
      expect(@obj.array_remove(initial_args, key, :baz)).to eq(:ok)
      expect(@obj.data_get(initial_args, key)).to eq([])
    end
  end
end
