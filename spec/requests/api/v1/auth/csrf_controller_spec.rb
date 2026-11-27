# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::Auth::CsrfController, type: :request do
  let(:csrf_path) { "/api/v1/auth/csrf" }
  let(:registration_path) { "/api/v1/auth/register" }

  let(:valid_attributes) do
    {
      first_name: "Test",
      last_name: "Customer",
      email: "csrf@example.com",
      password: "Test@123456",
      password_confirmation: "Test@123456"
    }
  end

  around do |example|
    original_setting = ActionController::Base.allow_forgery_protection

    ActionController::Base.allow_forgery_protection = true
    example.run
  ensure
    ActionController::Base.allow_forgery_protection = original_setting
  end

  describe "Session CSRF verification" do
    let(:login_path) { "/api/v1/auth/login" }
    let(:logout_path) { "/api/v1/auth/logout" }
    let(:current_user_path) { "/api/v1/auth/me" }
    let(:user) { create(:user) }

    let(:credentials) do
      {
        email: user.email,
        password: "Test@123456"
      }
    end

    it "rejects login without a CSRF token" do
      post login_path, params: { user: credentials }, as: :json

      expect(response).to have_http_status(422)
      expect(response.parsed_body["error"]).to eq("Invalid CSRF token")
    end

    context "when authenticated" do
      before do
        get csrf_path
        token = response.parsed_body.fetch("csrf_token")

        post login_path,
             params: { user: credentials },
             headers: { "X-CSRF-Token" => token },
             as: :json
      end

      it "rejects logout without a CSRF token" do
        delete logout_path, as: :json

        expect(response).to have_http_status(422)
      end

      it "preserves the session when CSRF verification fails" do
        delete logout_path, as: :json
        get current_user_path, as: :json

        expect(response).to have_http_status(:ok)
      end

      it "allows logout with a valid CSRF token" do
        get csrf_path
        token = response.parsed_body.fetch("csrf_token")

        delete logout_path,
               headers: { "X-CSRF-Token" => token },
               as: :json

        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET /api/v1/auth/csrf" do
    it "returns a successful response" do
      get csrf_path

      expect(response).to have_http_status(:ok)
    end

    it "generates a CSRF token" do
      get csrf_path

      expect(response.parsed_body["csrf_token"]).to be_present
    end

    it "prevents caching of the CSRF response" do
      get csrf_path

      expect(response.headers["Cache-Control"]).to include("no-store")
    end
  end

  describe "CSRF verification" do
    it "rejects registration without a CSRF token" do
      post registration_path, params: { user: valid_attributes }, as: :json

      expect(response).to have_http_status(422)
      expect(response.parsed_body["error"]).to eq("Invalid CSRF token")
    end

    it "rejects registration with an invalid CSRF token" do
      post registration_path,
           params: { user: valid_attributes },
           headers: { "X-CSRF-Token" => "invalid-token" },
           as: :json

      expect(response).to have_http_status(422)
    end

    it "does not create a user without a valid CSRF token" do
      expect do
        post registration_path, params: { user: valid_attributes }, as: :json
      end.not_to change(User, :count)
    end

    it "allows registration with a valid CSRF token" do
      get csrf_path
      token = response.parsed_body.fetch("csrf_token")

      post registration_path,
           params: { user: valid_attributes },
           headers: { "X-CSRF-Token" => token },
           as: :json

      expect(response).to have_http_status(:created)
      expect(User.find_by(email: valid_attributes[:email])).to be_customer
    end
  end
end
