# frozen_string_literal: true

module Brickdoc
  module UsernameDenylist
    extend self

    def all
      return @username_denylist if @username_denylist.present?

      list = YAML.load_file(Brickdoc.root.join('config', 'username_denylist.yml'))
      @username_denylist = list[:common]
    end
  end
end
