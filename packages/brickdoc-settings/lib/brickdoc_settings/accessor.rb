# frozen_string_literal: true

module BrickdocSettings
  class Accessor
    def initialize(settings, domain: '')
      @settings = settings
      @domain = domain
    end

    def get(key)
      @settings.get(key, domain: @domain)
    end

    def set(key, value)
      @settings.set(key, value, domain: @domain)
    end

    def at(domain)
      BrickdocSettings::Accessor.new(@settings, domain: domain)
    end
  end
end
