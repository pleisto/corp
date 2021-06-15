# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      module ChangeAction
        ADD = 1
        UPDATE = 2
        DELETE = 3
      end

      class ChangesCollection
        def initialize
          @added = Set.new
          @deleted = Set.new
          @delta = Set.new
          @keys = {}
        end
      end

      class Delta
        def initialize
          @insert = nil
          @delete = 0
          @retain = 0
          @attributes = {}
        end
      end

      class ChangeKey
        def initialize
          @action = nil
          @old_value = nil
        end
      end

      class Yevent
        def initialize(target, transaction)
          @target = target
          @transaction = transaction
          @current_target = target

          @_changes = nil
          @_keys = nil
          @_delta = nil
        end

        def path
          result = []
          child = current_target
          parent = target

          loop do
            break if child._item.nil?
            break if child == parent

            if child._item.parent_sub.nil?
              i = 0
              c = child._item.parent._start
              loop do
                break if c == child._item
                break if c.nil?

                i += 1 unless c.deleted
                c = c.right
              end
            else
              result << child._item.parent_sub
            end
          end

          result
        end
      end
    end
  end
end
