# frozen_string_literal: true
require 'open-uri'
require 'nokogiri'

module Brickdoc
  module PreviewBox
    def self.add_engine(engine_cls, priority = nil)
      @engines ||= []
      @engines.push({
        cls: engine_cls,
        priority: priority || engine_cls.try(:priority) || 0
      })
    end

    def self.match_engine(url, doc)
      @engines.sort_by { |e| -e[:priority] }.map { |e| e[:cls].new(url, doc) }.find(&:matched?)
    end

    def self.preview(url)
      doc = Nokogiri::HTML(URI.parse(url).open.read)
      engine = match_engine url, doc
      engine.data
    rescue => e
      Rails.logger.error(e)
      Rails.logger.error(e.backtrace.join("\n"))
      {
        title: url,
        description: '',
        cover: nil
      }
    end

    add_engine OpenGraph, 10
    add_engine Base
  end
end
