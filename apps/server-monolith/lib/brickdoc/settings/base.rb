# frozen_string_literal: true

module Brickdoc
  module Settings
    module Base
      extend ActiveSupport::Concern
      module ClassMethods
        include Brickdoc::Settings::AccessorBase

        BELONG_TYPE = [:global, :user, :space]

        def cached_values
          Thread.current[:"#{self.class.name.underscore}_values"] ||= {}
        end

        def cached_namespaces
          Thread.current[:"#{self.class.name.underscore}_namespaces"] ||= {}
        end

        # Find key by namespace
        def namespace(*namespace, &block)
          namespace = namespace.join('.')
          cached_namespaces[namespace] ||= Brickdoc::Settings::Accessor.new(self, namespace: namespace)
          cached_namespaces[namespace].with_block(&block)
        end

        # at_contexts is a current session's context for calculating the scope.
        def cached_session_contexts
          Thread.current[:"#{self.class.name.underscore}_at_contexts"] ||= {}
        end

        # Calculate the cached key for current user's context
        def session_context_cached_key(user_id: nil, space_id: nil)
          "space#{space_id}.user#{user_id}"
        end

        # Set current session's context
        def at(user_id: nil, space_id: nil, &block)
          cached_key = session_context_cached_key(user_id: user_id, space_id: space_id)
          cached_session_contexts[cached_key] ||= Brickdoc::Settings::Accessor.new(self, user_id: user_id, space_id: space_id)
          cached_session_contexts[cached_key].with_block(&block)
        end

        def defined_fields
          @defined_fields
        end

        def frontend_fields
          @frontend_fields
        end

        def current
          Thread.current[:brickdoc_config_current] || self
        end

        def current=(config)
          Thread.current[:brickdoc_config_current] = config
        end

        def to_frontend(namespace: '')
          namespace = namespace.to_s
          frontend_fields[namespace].uniq.index_with do |key|
            get(key, namespace: namespace)
          end
        end

        def field(key, namespace: '', belongs_to: :global, type: :string, default: nil, read_only: false, **options)
          key = key.to_s
          # belongs_to value must be a valid scope
          raise ArgumentError, "unsupported belongs_to: #{belongs_to}" unless BELONG_TYPE.include?(belongs_to)

          # Avoid dirty data, this attributes is not allowed static defined.
          options.delete(:user_id)
          options.delete(:space_id)

          @frontend_fields ||= {}
          if options[:frontend]
            frontend_fields[namespace] ||= []
            frontend_fields[namespace].push key
          end

          @defined_fields ||= {}
          @defined_fields[namespace] ||= {}
          @defined_fields[namespace][key] = {
            type: type,
            default: default,
            read_only: read_only,
            options: options,
            belongs_to: belongs_to,
          }
        end

        def get_field(key, namespace: '', **_)
          key = key.to_s
          @defined_fields[namespace][key]
        end

        def defined_keys(namespace: '', **_)
          @defined_fields[namespace].keys
        end

        def truthy?(value)
          ['t', 'true', '1', 1, true].include?(value)
        end

        # Get value by key, namespace and session context
        def get(key, namespace: '', space_id: nil, user_id: nil, **_)
          key = key.to_s
          namespace = namespace.to_s
          cache_key = "#{namespace}.#{key}@#{session_context_cached_key(user_id: user_id, space_id: space_id)}"
          unless cached_values[cache_key]
            field_config = @defined_fields.dig(namespace, key) || {}
            value = _get_value(key, namespace: namespace,
              space_id: space_id, user_id: user_id, belongs_to: field_config[:belongs_to])
            value = if !value.nil?
              case field_config[:type]
              when :boolean
                truthy?(value)
              when :integer
                value&.to_i
              when :float
                value&.to_f
              when :encrypted
                _lockbox(cache_key).decrypt(value)
              else
                value
              end
            else
              field_config[:default]
            end
            value = value.deep_symbolize_keys if field_config.dig(:options, :symbolize_keys)
            cached_values[cache_key] = value
          end
          cached_values[cache_key]
        end

        def set(key, value, namespace: '', space_id: nil, user_id: nil, allow_global: false)
          field_config = @defined_fields.dig(namespace.to_s, key.to_s)
          raise Errors::NotFoundField.new(self, key, namespace: namespace) if field_config.nil?

          # Deny set value for read_only field
          raise Errors::ReadOnlyField.new(self, key, namespace: namespace) if field_config[:read_only]

          # Deny set value when field belongs_to is not global with empty session context
          empty_context = space_id.nil? && user_id.nil?
          if !allow_global && (empty_context || field_config[:belongs_to] == :global)
            raise ArgumentError, 'Please add `allow_global: true` options to set value for global scope'
          end

          # encrypted type fields
          if field_config[:type] == :encrypted
            cache_key = "#{namespace}.#{key}@#{session_context_cached_key(user_id: user_id, space_id: space_id)}"
            value = _lockbox(cache_key).encrypt(value.to_s)
          end

          _save_value(key.to_s, value, namespace: namespace, user_id: user_id, space_id: space_id, belongs_to: field_config[:belongs_to])
          touch(key, namespace: namespace, user_id: user_id, space_id: space_id)
        end

        def touch(key, namespace: '', user_id:, space_id:)
          cached_values.delete "#{namespace}.#{key}@#{session_context_cached_key(user_id: user_id, space_id: space_id)}"
        end

        # Calculate the full key with namespace for database access
        def _full_key(namespace, key)
          namespace.blank? ? key : "#{namespace}.#{key}"
        end

        # Calculate the scope by current session's context
        def _calc_scope(key, namespace, space_id, user_id, belongs_to)
          space_label = space_id.present? ? "space_#{Crypto.int_id_obfuscate(space_id)}" : nil
          user_label =  user_id.present? ? "user_#{Crypto.int_id_obfuscate(user_id)}" : nil
          scope = ['R']
          case belongs_to
          when :space
            scope.push space_label if space_label.present?
            scope.push user_label if space_label.present? && user_label.present?
          when :user
            scope.push user_label if user_label.present?
            scope.push space_label if user_label.present? && space_label.present?
          end
          scope.join('.')
        end

        # get value from database
        def _get_value(key, namespace: 'Undefined settings field', belongs_to:, space_id:, user_id:)
          scope = _calc_scope(key, namespace, space_id, user_id, belongs_to)
          # nlevel will returns number of labels in path. e.g. 'a.b.c' will return 3
          select('value', 'nlevel(scope::ltree) as depth')
            # ltree @> ltree → boolean.  Is left argument an ancestor of right (or equal)?
            .where('key = :key and scope @> :scope', key: _full_key(namespace, key), scope: scope)
            .order('depth desc')
            .first&.value
        end

        # save value to database
        def _save_value(key, value, namespace: '', belongs_to:, space_id:, user_id:)
          scope = _calc_scope(key, namespace, space_id, user_id, belongs_to)
          record = where(key: _full_key(namespace, key), scope: scope).first_or_initialize
          record.value = value
          record.save
        end

        def _lockbox(cache_key)
          Lockbox.new(key: Lockbox.attribute_key(table: :settings, attribute: cache_key))
        end
      end
    end
  end
end
