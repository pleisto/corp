# frozen_string_literal: true

# See https://docs.gitlab.com/ee/development/migration_style_guide.html
# for more information on how to write migrations for GitLab.

class AddPathsToFormula < ActiveRecord::Migration[7.0]
  # Uncomment the following include if you require helper functions:
  # include Brickdoc::Database::MigrationHelper

  def up
    add_column :docs_formulas, :path_ids, :uuid, null: false, default: [], array: true
    add_column :docs_formulas, :type, :integer, null: false, default: 0
    remove_column :docs_formulas, :view
  end

  def down
    remove_column :docs_formulas, :path_ids
    remove_column :docs_formulas, :type
    add_column :docs_formulas, :view, :json, null: false, default: {}
  end
end
