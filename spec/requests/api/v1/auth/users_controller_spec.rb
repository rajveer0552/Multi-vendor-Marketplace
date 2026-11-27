# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::Auth::UsersController, type: :request do
  let(:user) { create(:user) }
  let(:login_path) { "/api/v1/auth/login" }
  let(:current_user_path) { "/api/v1/auth/me" }

  describe "GET /api/v1/auth/me" do
    context "when authenticated" do
      before do
        post login_path, params: {
          user: {
            email: user.email,
            password: "Test@123456"
          }
        }, as: :json
      end

      it "returns a successful response" do
        get current_user_path, as: :json

        expect(response).to have_http_status(:ok)
      end

      it "returns the authenticated user" do
        get current_user_path, as: :json

        expect(response.parsed_body["user"]["id"]).to eq(user.id)
        expect(response.parsed_body["user"]["email"]).to eq(user.email)
      end

      it "returns the correct user role" do
        get current_user_path, as: :json

        expect(response.parsed_body["user"]["role"]).to eq(user.role)
      end

      it "returns only permitted user attributes" do
        get current_user_path, as: :json

        expect(response.parsed_body["user"].keys).to match_array(
          %w[id first_name last_name email role]
        )
      end

      it "prevents caching of user information" do
        get current_user_path, as: :json

        expect(response.headers["Cache-Control"]).to include("no-store")
      end

      it "maintains the authenticated session across requests" do
        2.times do
          get current_user_path, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body["user"]["id"]).to eq(user.id)
        end
      end
    end

    context "when unauthenticated" do
      it "returns an unauthorized response" do
        get current_user_path, as: :json

        expect(response).to have_http_status(:unauthorized)
      end

      it "returns an authentication error" do
        get current_user_path, as: :json

        expect(response.parsed_body["error"]).to eq("Authentication required")
      end
    end
  end
end
