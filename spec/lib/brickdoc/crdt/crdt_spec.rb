# frozen_string_literal: true

require "rails_helper"

describe Brickdoc::Crdt do
  context ".version" do
  end

  context ".configuration" do
    it "initial" do
      expect(described_class.configuration.callbacks).to_not eq([])
    end

    it "config" do
      described_class.configuration.callbacks = []
      expect(described_class.configuration.callbacks).to eq([])
    end
  end
end
