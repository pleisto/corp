# frozen_string_literal: true

class BrickdocPlugin
  def self.register(plugin_name, &block)
    plugin = new(plugin_name)
    plugin.config(&block)
    plugin
  end

  def self.load_plugins
    # TODO
  end

  def initialize(plugin_name)
    @plugin_name = plugin_name
  end

  def config(&block)
    instance_eval(&block) if block
  end

  def settings(&block)
    BrickdocConfig.current.scope("plugin.#{@plugin_name}", &block)
  end
end
