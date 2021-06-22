# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Docs::Block, type: :model do
  context '.create block' do
    let(:block) { create(:docs_block) }

    it 'basic' do
      expect(block.pod.owner.id).to eq(block.collaborators.first)
    end
  end

  context '.histories' do
    let(:block) { create(:docs_block) }

    it 'automatic save' do
      old_version = block.history_version
      old_hist_count = block.histories.count

      expect(block.histories.last.history_version).to eq(old_version)
      expect(block.histories.last.meta).to eq(block.meta)

      block.update!(meta: block.meta.merge('changed' => true))

      history = block.histories.last
      expect(block.history_version).to eq(old_version + 1)
      expect(history.history_version).to eq(old_version + 1)
      expect(history.meta).to eq(block.meta)
      expect(history.path).to eq([block.id])
      expect(block.histories.count).to eq(old_hist_count + 1)
    end
  end

  context '.snapshots' do
    let(:block) { create(:docs_block) }

    it 'basic' do
      expect(block.snapshots.count).to eq(0)
      expect(block.snapshot_version).to eq(0)

      block.save_snapshot!

      expect(block.snapshots.count).to eq(1)
      expect(block.snapshot_version).to eq(1)
      snapshot = block.snapshots.first

      expect(snapshot.snapshot_version).to eq(1)
      expect(snapshot.blocks.count).to eq(1)
      hist = snapshot.blocks.first
      expect(snapshot.blocks.count).to eq(block.descendants_v1.count)
      # expect(snapshot.blocks.count).to be > 1
    end
  end
end
