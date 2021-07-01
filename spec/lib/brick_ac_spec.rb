# frozen_string_literal: true

require 'rails_helper'

describe BrickAc do
  
  context 'basic' do

    
    it 'can define access rules then check' do
      BrickAc.for_actor Accounts::User do
        to Docs::Block do
          roles :owner, :editor, :viewer


          permit :view
          permit :edit, on: [:owner, :editor]
        end
      end

      block1 = create(:docs_block)
      owner1 = create(:accounts_user)
      editor1 = create(:accounts_user)
      viewer1 = create(:accounts_user)


      owner1.can?(:view, block1)
    end

  end

end
