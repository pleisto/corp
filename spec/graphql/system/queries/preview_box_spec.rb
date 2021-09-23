# frozen_string_literal: true

require 'rails_helper'

describe System::Queries::PreviewBox , type: :query do
  describe '#resolver' do
    query = <<-'GRAPHQL'
       query QueryPreviewBox($url: String!) {
         previewBox(url: $url) {
          html
        }
       }
    GRAPHQL

    it 'works' do
      internal_graphql_execute(query, { url: 'http://www.amazon.com/gp/product/B005T3GRNW/ref=s9_simh_gw_p147_d0_i2' })
      expect(response.success?).to be true
      expect(response.data['previewBox']['html']).to include('onebox amazon')
    end
  end
end
