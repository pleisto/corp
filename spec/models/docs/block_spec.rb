# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Docs::Block, type: :model do
  context '.create block' do
    let(:block) { create(:docs_block) }

    it 'basic' do
      expect(block.pod_id).to eq(block.collaborators.first)
    end
  end
end
