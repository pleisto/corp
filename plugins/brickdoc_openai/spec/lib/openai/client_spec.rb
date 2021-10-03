# frozen_string_literal: true

require 'rails_helper'

describe OpenAI::Client do
  before(:each) do
    @client = OpenAI::Client.new(ENV['OPENAI_ACCESS_TOKEN'])
  end

  context '.engines' do
    it 'should returns all engines' do
      VCR.use_cassette('brickdoc_openai_engines_all') do
        expect(@client.engines.all['data'].size).to be > 0
      end
    end

    it 'should retrieve engine' do
      VCR.use_cassette('brickdoc_openai_engines_find_davinci') do
        result = @client.engines.find('davinci')
        expect(result['object']).to eq('engine')
      end
    end

    it 'should create completion' do
      VCR.use_cassette('brickdoc_openai_engines_create_completion_api') do
        result = @client.engines.create_completion({
          prompt: 'The personal computer was the bicycle of',
          max_tokens: 1
        })
        expect(result['object']).to eq('text_completion')
        expect(result['choices'][0]['text']).not_to be_empty
      end
    end

    it 'should create_search' do
      VCR.use_cassette('brickdoc_openai_engines_create_search_api') do
        result = @client.engines.create_search({
          documents: [
            'Kasei Valles',
            'Dublin',
            'Great Wall',
            'Tallinn',
            'River Liffey North',
          ],
          query: 'China'
        })['data'].sort_by { |r| r['score'] }
        expect(result.last['document']).to eq(2)
      end
    end
  end

  context '.answers' do
    it 'should create answer' do
      VCR.use_cassette('brickdoc_openai_answer_create_api') do
        result = @client.answers.create({
          question: 'what is the answer to the universe and everything?',
          # rubocop:disable LineLength
          documents: ['The number 42 is, in The Hitchhiker\'s Guide to the Galaxy by Douglas Adams, the "Answer to the Ultimate Question of Life, the Universe, and Everything," calculated by an enormous supercomputer named Deep Thought over a period of 7.5 million years.'],
          examples: [
            ['where was Arthur Dent from?', 'UK'],
          ],
          examples_context: ' One of these was the Order for Destruction, which placed Arthur Dent\'s home at 155 Country Lane, Cottington, Cottingshire County, UK, and set the date of the demolition (and thus the game events) on October 4th, 1982.'
        })
        # rubocop:enable LineLength
        expect(result['answers'][0]).to eq('42')
      end
    end
  end

  context '.classifications' do
    it 'should create classification' do
      VCR.use_cassette('brickdoc_openai_classification_create_api') do
        result = @client.classifications.create({
          query: 'figma',
          examples: [
            ['linux', 'software'],
            ['salesforce', 'software'],
            ['office', 'software'],
            ['photoshop', 'software'],
            ['keyboard', 'hardware'],
            ['cpu', 'hardware'],
            ['threadripper', 'hardware'],
            ['google pixel 6', 'hardware'],
          ]
        })
        expect(result['label'].downcase).to eq('software')
      end
    end
  end
end
