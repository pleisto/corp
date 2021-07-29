# frozen_string_literal: true

class BrickdocHook
  @hooks = {}

  class << self
    attr_reader :hooks

    def on(hook_name, scope: '', &block)
      hook_name = hook_name.to_sym
      @hooks[hook_name] ||= []
      @hooks[hook_name].push(scope: scope, block: block)
    end

    def off(hook_name, scope: '', &block)
      hook_name = hook_name.to_sym
      if @hooks[hook_name]
        @hooks[hook_name] = @hooks[hook_name].reject { |h| (h[:scope] == scope) && (block.nil? || (h[:block] == block)) }
      end
    end
  end
end
