# frozen_string_literal: true

module Brickdoc
  module Plugins
    module ServerPlugin
      module Hooks
        class << self
          #  Oauth2 provider hook
          # @param [Proc] extra_block extra proc to be executed
          def oauth_provider(&extra_block)
            proc do
              ServerPlugin.find_hook(:oauth_provider)&.each do |id, block|
                options = block.extract_options!
                options[:vendor] = id
                # append extra options
                provider(*(block + [options]))
              end
              instance_eval(&extra_block)
            end
          end
        end
      end
    end
  end
end
