# frozen_string_literal: true

module BrickdocSettings
  class Accessor
    def initialize(settings, domain: '', scope: [])
      @settings = settings
      @domain = domain
      @scope = scope
    end

    def at(domain)
      BrickdocSettings::Accessor.new(@settings, domain: domain)
    end

    def _get_key(key)
      (@scope + [key.to_s]).join('.')
    end

    [:get, :set, :field, :touch].each do |method_name|
      define_method(method_name) do |key, *args, **options|
        @settings.send(method_name, _get_key(key), *args, **options.merge(domain: @domain))
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
