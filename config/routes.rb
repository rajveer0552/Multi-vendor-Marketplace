# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, skip: :all

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"

      namespace :auth do
        get "csrf", to: "csrf#show"
        post "register", to: "registrations#create"
        get "me", to: "users#show"

        devise_scope :user do
          post "login", to: "sessions#create"
          delete "logout", to: "sessions#destroy"
        end
      end

      namespace :dashboard do
        get "customer", to: "/api/v1/dashboards#customer"
        get "vendor", to: "/api/v1/dashboards#vendor"
        get "admin", to: "/api/v1/dashboards#admin"
      end
    end
  end
end
