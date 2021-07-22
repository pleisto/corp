# frozen_string_literal: true

module BrickdocSettings
  class Accessor
    def initialize(settings, scope: '', domain: '')
      @settings = settings
      @scope = scope
      @domain = domain
    end

    def at(domain)
      BrickdocSettings::Accessor.new(@settings, domain: domain)
    end

    def with_block(&block)
      block ? instance_eval(&block) : self
    end

    def defined_keys
      @settings.defined_keys(scope: @scope)
    end

    def respond_to_missing?(method_name, *_)
      defined_keys.include? method_name.to_s
    end

    [:field, :get_field, :get, :set, :touch].each do |method_name|
      define_method(method_name) do |key, *args, **options|
        @settings.send(method_name, key, *args, **options.merge(scope: @scope, domain: @domain))
      end
    end

    def method_missing(method_name, *args, **options)
      if method_name[-1] == '='
        set(method_name[0..-2], *args, **options)
      else
        get(method_name, *args, **options)
      end
    end
  end
end
