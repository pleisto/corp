# frozen_string_literal: true

class BrickdocPlugin
  @plugins = {}

  class << self
    def plugin(plugin_name)
      @plugins[plugin_name.to_sym]
    end

    def register(plugin_name)
      plugin_name = plugin_name.to_sym
      @plugins[plugin_name] ||= new(plugin_name)
    end

    def loaded?(plugin_name)
      @plugins[plugin_name.to_sym].present?
    end

    def config(plugin_name, &block)
      register(plugin_name).config(&block) if block
    end

    def load_plugins(plugins_paths = Rails.root.join('plugins/*'))
      Dir[plugins_paths].each do |path|
        load_plugin(path)
      end
    end

    def load_plugin(path)
      plugin_name = path.split('/').last.to_sym
      plugin = register plugin_name
      plugin_file = "#{path}/plugin.rb"
      plugin.instance_eval(File.read(plugin_file), plugin_file) if File.exist?(plugin_file)
      metadata_file = "#{path}/package.yml"
      plugin.metadata = YAML.load(File.read(metadata_file)).deep_symbolize_keys if File.exist?(metadata_file)
    end
  end

  attr_accessor :metadata

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
