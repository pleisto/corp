# frozen_string_literal: true

require 'rails_helper'

describe BrickdocPlugin do
  it 'can define and configure a plugin' do
    plugin = BrickdocPlugin.register :test_plugin do
      settings do
        field :test_plugin_key, default: 'value'
      end
    end

    expect(BrickdocConfig.scope('plugin.test_plugin').test_plugin_key).to eq('value')
    expect(plugin.settings.test_plugin_key).to eq('value')

    BrickdocConfig.current = BrickdocConfig.at('pod1')

    plugin.settings.test_plugin_key = 'pod1_value'

    expect(BrickdocConfig.scope('plugin.test_plugin').test_plugin_key).to eq('value')
    expect(BrickdocConfig.scope('plugin.test_plugin').at('pod1').test_plugin_key).to eq('pod1_value')

    BrickdocConfig.current = BrickdocConfig.at('pod2')

    expect(plugin.settings.test_plugin_key).to eq('value')

    expect(BrickdocPlugin[:test_plugin]).to eq(plugin)
  end

  it 'can load plugins from dirs' do
    BrickdocPlugin.load_plugins(Rails.root.join('spec/dummy/plugins/**'))

    expect(BrickdocPlugin.loaded?(:dummy_plugin)).to be(true)
  end
end
