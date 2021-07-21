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
        scope = scope.join('.')
        cached_scopes[scope] ||= BrickdocSettings::Accessor.new(self, scope: scope)
        cached_scopes[scope].with_block(&block)
      end

      def at(*domain, &block)
        domain = domain.join('.')
        cached_domains[domain] ||= BrickdocSettings::Accessor.new(self, domain: domain)
        cached_domains[domain].with_block(&block)
      end

      def field(key, scope: '', default: nil, type: :string, **options)
        key = key.to_s
        @defined_fields ||= {}
        @defined_fields[scope] ||= {}
        @defined_fields[scope][key] = {
          default: default,
          type: type,
          options: options
        }
      end

      def get(key, scope: '', domain: '')
        cache_key = "#{scope}.#{key}@#{domain}"
        unless cached_values[cache_key]
          field_config = @defined_fields.dig(scope, key) || {}
          value = _get_value(key, scope: scope, domain: domain)
          value = if value
            case field_config[:type]
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
            field_config[:default]
          end
          cached_values[cache_key] = value
        end
        cached_values[cache_key]
      end

      def set(key, value, scope: '', domain: '')
        _save_value(key.to_s, value, scope: scope, domain: domain)
        touch(key, scope: scope, domain: domain)
      end

      def touch(key, scope: '', domain: '')
        cached_values.delete "#{scope}.#{key}@#{domain}"
      end

      def method_missing(method_name, *args, **options)
        if method_name[-1] == '='
          set(method_name[0..-2], *args, **options)
        else
          get(method_name, *args, **options)
        end
      end

      def _get_value(key, scope: '', domain: '')
        domain_len = domain.split('.').count
        records = where(key: key, scope: scope).where('domain_len <= ?', domain_len).order('domain_len ASC').to_a
        if records.present?
          records.select do |r|
            r.domain.blank? || (r.domain == domain) || domain.end_with?(".#{r.domain}")
          end.last&.value
        end
      end

      def _save_value(key, value, scope: '', domain: '')
        record = where(key: key, scope: scope, domain: domain).first_or_initialize
        record.value = value
        record.domain_len = domain.split('.').count
        record.save
      end
    end
  end
end
