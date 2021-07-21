# frozen_string_literal: true

module BrickdocSettings
  module Base
    extend ActiveSupport::Concern

    module ClassMethods
      def cached_values
        Thread.current[:"#{self.class.name.underscore}_values"] ||= {}
      end

      def cached_scopes
        Thread.current[:"#{self.class.name.underscore}_scopes"] ||= {}
      end

      def cached_domains
        Thread.current[:"#{self.class.name.underscore}_domains"] ||= {}
      end

      def scope(*scope, &block)
        cached_scopes[scope] ||= BrickdocSettings::Accessor.new(self, scope: scope)
        cached_scopes[scope].instance_eval(&block) if block
        cached_scopes[scope]
      end

      def at(domain)
        BrickdocSettings::Accessor.new(self, domain: domain)
      end

      def field(key, default: nil, type: :string, **options)
        key = key.to_s
        @defined_fields ||= {}
        @defined_fields[key] = {
          default: default,
          type: type,
          options: options
        }
      end

      def get(key, domain: '')
        cache_key = "#{key}@#{domain}"
        unless cached_values[cache_key]
          value = _get_value(key, domain)
          value = if value
            case @defined_fields.dig(key, :type)
            when :boolean
              ['t', 'true', '1', 1, true].include?(value)
            when :integer
              value&.to_i
            when :float
              value&.to_f
            else
              value
            end
          else
            @defined_fields.dig(key, :default)
          end
          cached_values[cache_key] = value
        end
        cached_values[cache_key]
      end

      def set(key, value, domain: '')
        _save_value(key.to_s, domain, value)
        touch(key, domain: domain)
      end

      def touch(key, domain: '')
        cached_values.delete "#{key}@#{domain}"
      end

      def method_missing(method_name, *args, **options)
        if method_name[-1] == '='
          set(method_name[0..-2], *args, **options)
        else
          get(method_name, *args, **options)
        end
      end

      def _get_value(key, domain)
        domain_len = domain.split('.').count
        records = where(key: key).where('domain_len <= ?', domain_len).order('domain_len ASC').to_a
        if records.present?
          records.select do |r|
            r.domain.blank? || (r.domain == domain) || domain.end_with?(".#{r.domain}")
          end.last&.value
        end
      end

      def _save_value(key, domain, value)
        record = where(key: key, domain: domain).first_or_initialize
        record.value = value
        record.domain_len = domain.split('.').count
        record.save
      end
    end
  end
end
