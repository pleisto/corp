# frozen_string_literal: true

require 'rails_helper'

describe BrickdocHook do
  it 'can on and off hook' do
    test_block = proc do
    end
    BrickdocHook.on :test, &test_block
    BrickdocHook.on :test do
    end
    BrickdocHook.on :test do
    end
    BrickdocHook.on :test, scope: 'plugin.test' do
    end

    expect(BrickdocHook.hooks[:test].length).to eq(4)

    BrickdocHook.off :test, scope: 'plugin.test'
    expect(BrickdocHook.hooks[:test].length).to eq(3)

    BrickdocHook.off :test, &test_block
    expect(BrickdocHook.hooks[:test].length).to eq(2)

    BrickdocHook.off :test
    expect(BrickdocHook.hooks[:test].length).to eq(0)
  end
end
