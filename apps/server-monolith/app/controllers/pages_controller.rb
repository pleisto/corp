# frozen_string_literal: true

class PagesController < ApplicationController
  before_action :require_signed_in, only: [:pwa]
  def pwa
  end

  def unsupported
  end
end
