# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::DashboardsController, type: :request do
  let(:login_path) { "/api/v1/auth/login" }
  let(:customer_path) { "/api/v1/dashboard/customer" }
  let(:vendor_path) { "/api/v1/dashboard/vendor" }
  let(:admin_path) { "/api/v1/dashboard/admin" }

  shared_context "authenticated user" do
    before do
      post login_path, params: {
        user: {
          email: user.email,
          password: "Test@123456"
        }
      }, as: :json
    end
  end

  context "when authenticated as a customer" do
    let(:user) { create(:user) }

    include_context "authenticated user"

    it "allows access to the customer dashboard" do
      get customer_path, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["role"]).to eq("customer")
    end

    it "denies access to the vendor dashboard" do
      get vendor_path, as: :json

      expect(response).to have_http_status(:forbidden)
    end

    it "denies access to the admin dashboard" do
      get admin_path, as: :json

      expect(response).to have_http_status(:forbidden)
    end
  end

  context "when authenticated as a vendor" do
    let(:user) { create(:user, :vendor) }

    include_context "authenticated user"

    it "denies access to the customer dashboard" do
      get customer_path, as: :json

      expect(response).to have_http_status(:forbidden)
    end

    it "allows access to the vendor dashboard" do
      get vendor_path, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["role"]).to eq("vendor")
    end

    it "denies access to the admin dashboard" do
      get admin_path, as: :json

      expect(response).to have_http_status(:forbidden)
    end
  end

  context "when authenticated as an admin" do
    let(:user) { create(:user, :admin) }

    include_context "authenticated user"

    it "denies access to the customer dashboard" do
      get customer_path, as: :json

      expect(response).to have_http_status(:forbidden)
    end

    it "denies access to the vendor dashboard" do
      get vendor_path, as: :json

      expect(response).to have_http_status(:forbidden)
    end

    it "allows access to the admin dashboard" do
      get admin_path, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["role"]).to eq("admin")
    end
  end

  context "when unauthenticated" do
    it "rejects access to the customer dashboard" do
      get customer_path, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects access to the vendor dashboard" do
      get vendor_path, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects access to the admin dashboard" do
      get admin_path, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "when verifying response security" do
    let(:user) { create(:user) }

    include_context "authenticated user"

    it "returns a forbidden error message" do
      get admin_path, as: :json

      expect(response.parsed_body["error"]).to eq(
        "You are not authorized to perform this action"
      )
    end

    it "prevents caching of dashboard information" do
      get customer_path, as: :json

      expect(response.headers["Cache-Control"]).to include("no-store")
    end

    it "rejects dashboard access after logout" do
      delete "/api/v1/auth/logout", as: :json
      get customer_path, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
