# frozen_string_literal: true

module BrickdocSettings
  module Base
    extend ActiveSupport::Concern

    module ClassMethods
      def current_cache
        Thread.current[:"#{self.class.name.underscore}_cached"] ||= {}
      end

      def scope(*names, &block)
        names = names.map(&:to_s)
        @current_scope ||= []
        @current_scope += names
        yield block
        @current_scope -= names
      end

      def at(domain)
        BrickdocSettings::Accessor.new(self, domain: domain)
      end

      def _get_key(key)
        @current_scope ||= []
        (@current_scope + [key.to_s]).join('.')
      end

      def field(key, default: nil, type: :string, **options)
        key = _get_key(key)
        @defined_fields ||= {}
        @defined_fields[key] = {
          default: default,
          type: type,
          options: options
        }
      end

      def get(key, domain: '')
        key = _get_key(key)
        cache_key = "#{key}@#{domain}"
        unless current_cache[cache_key]
          domain_len = domain.split('.').count
          records = where(key: key).where('domain_len <= ?', domain_len).to_a
          if records.present?
            value = records.select do |r|
              r.domain.blank? || (r.domain == domain) || domain.end_with?(".#{r.domain}")
            end.sort_by(&:domain_len).last&.value
          end
          value = if value
            case @defined_fields.dig(key, :type)
            when :boolean
              ['t', 'true', '1', 1, true].include?(value)
            when :integer
              value&.to_i
            else
              value
            end
          else
            @defined_fields.dig(key, :default)
          end
          current_cache[cache_key] = value
        end
        current_cache[cache_key]
      end

      def set(key, value, domain: '')
        key = _get_key(key)
        record = where(key: key, domain: domain).first_or_initialize
        record.value = value
        record.domain_len = domain.split('.').count
        record.save
        touch(key, domain: domain)
        # current_cache["#{key}@#{domain}"] = value
      end

      def touch(key, domain: '')
        current_cache.delete "#{_get_key(key)}@#{domain}"
      end
    end
  end
end
