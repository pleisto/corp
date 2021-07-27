# frozen_string_literal: true

class BrickdocPlugin
  @plugins = {}

  class << self
    def [](plugin_name)
      @plugins[plugin_name.to_sym]
    end

    def loaded?(plugin_name)
      @plugins[plugin_name.to_sym].present?
    end

    def register(plugin_name, &block)
      plugin_name = plugin_name.to_sym
      plugin = @plugins[plugin_name] ||= new(plugin_name)
      plugin.config(&block) if block
      plugin
    end

    def load_plugins(plugins_paths = Rails.root.join('plugins/*'))
      plugins_names = Dir[plugins_paths].collect { |n| n.split('/').last.to_sym }
      plugins_names.each do |plugin_name|
        register plugin_name
      end
    end
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
