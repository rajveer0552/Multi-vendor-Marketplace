# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::Auth::SessionsController, type: :request do
  let(:login_path) { "/api/v1/auth/login" }
  let(:user) { create(:user) }

  let(:valid_credentials) do
    {
      email: user.email,
      password: "Test@123456"
    }
  end

  describe "POST /api/v1/auth/login" do
    context "with valid credentials" do
      it "returns a successful response" do
        post login_path, params: { user: valid_credentials }, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["message"]).to eq("Login successful")
      end

      it "returns the authenticated user" do
        post login_path, params: { user: valid_credentials }, as: :json

        expect(response.parsed_body["user"]["id"]).to eq(user.id)
        expect(response.parsed_body["user"]["email"]).to eq(user.email)
      end

      it "returns only permitted user attributes" do
        post login_path, params: { user: valid_credentials }, as: :json

        expect(response.parsed_body["user"].keys).to match_array(
          %w[id first_name last_name email role]
        )
      end

      it "prevents caching of the login response" do
        post login_path, params: { user: valid_credentials }, as: :json

        expect(response.headers["Cache-Control"]).to include("no-store")
      end
    end

    context "with invalid credentials" do
      it "rejects an incorrect password" do
        credentials = valid_credentials.merge(password: "incorrect-password")

        post login_path, params: { user: credentials }, as: :json

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body["error"]).to eq("Invalid email or password")
      end

      it "rejects an unregistered email" do
        credentials = valid_credentials.merge(email: "unknown@example.com")

        post login_path, params: { user: credentials }, as: :json

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body["error"]).to eq("Invalid email or password")
      end

      it "rejects a missing email" do
        credentials = valid_credentials.except(:email)

        post login_path, params: { user: credentials }, as: :json

        expect(response).to have_http_status(:unauthorized)
      end

      it "rejects a missing password" do
        credentials = valid_credentials.except(:password)

        post login_path, params: { user: credentials }, as: :json

        expect(response).to have_http_status(:unauthorized)
      end

      it "rejects invalid credentials even when already authenticated" do
        post login_path, params: { user: valid_credentials }, as: :json

        expect(response).to have_http_status(:ok)

        credentials = valid_credentials.merge(password: "incorrect-password")

        post login_path, params: { user: credentials }, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "with different user roles" do
      it "authenticates a customer" do
        post login_path, params: { user: valid_credentials }, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["user"]["role"]).to eq("customer")
      end

      it "authenticates a vendor" do
        vendor = create(:user, :vendor)
        credentials = { email: vendor.email, password: "Test@123456" }

        post login_path, params: { user: credentials }, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["user"]["role"]).to eq("vendor")
      end

      it "authenticates an admin" do
        admin = create(:user, :admin)
        credentials = { email: admin.email, password: "Test@123456" }

        post login_path, params: { user: credentials }, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["user"]["role"]).to eq("admin")
      end
    end
  end

  describe "DELETE /api/v1/auth/logout" do
    let(:logout_path) { "/api/v1/auth/logout" }
    let(:current_user_path) { "/api/v1/auth/me" }

    context "when authenticated" do
      before do
        post login_path, params: { user: valid_credentials }, as: :json
      end

      it "returns a successful logout response" do
        delete logout_path, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["message"]).to eq("Logout successful")
      end

      it "clears the authenticated session" do
        delete logout_path, as: :json
        get current_user_path, as: :json

        expect(response).to have_http_status(:unauthorized)
      end

      it "prevents caching of the logout response" do
        delete logout_path, as: :json

        expect(response.headers["Cache-Control"]).to include("no-store")
      end

      it "allows the user to log in again after logout" do
        delete logout_path, as: :json
        post login_path, params: { user: valid_credentials }, as: :json
        get current_user_path, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["user"]["id"]).to eq(user.id)
      end

      it "rejects a second logout request" do
        delete logout_path, as: :json
        delete logout_path, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when unauthenticated" do
      it "rejects the logout request" do
        delete logout_path, as: :json

        expect(response).to have_http_status(:unauthorized)
        expect(response.parsed_body["error"]).to eq("Authentication required")
      end
    end
  end
end
