# frozen_string_literal: true

require 'rails_helper'

## NOTE bundle exec rspec plugins
RSpec.describe BrickdocPlugin::GithubWebhook do
  it 'works' do
    expect(BrickdocPlugin.all_plugins[:github_webhook].class).to be(BrickdocPlugin)
    expect(BrickdocPlugin.enabled?(:github_webhook)).to be(false)
    # plugin = BrickdocPlugin.plugin(:github_webhook)
  end
end
