# frozen_string_literal: true

resources :users, only: [:create] do
  collection do
    get :sign_in, to: 'sessions#new'
    get :sign_up, to: 'users#new'
    delete :sign_out, to: 'sessions#destroy'
    match 'auth/:provider/callback', to: 'sessions#callback', as: :auth_callback, via: [:get, :post]
  end
end
