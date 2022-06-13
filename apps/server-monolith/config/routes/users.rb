# frozen_string_literal: true

resources :users, only: [:create] do
  collection do
    get :sign_in, to: 'sessions#new'
    get :sign_up, to: 'users#new'
    delete :sign_out, to: 'sessions#destroy'
    match 'auth/:provider/callback', to: 'sessions#callback', as: :auth_callback, via: [:get, :post]
    get ':username/available', to: 'users#check_username'

    # Magic link
    get 'auth/magic_link/sent', to: 'users#magic_link_sent'
  end
end
