# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::HealthController, type: :request do
  describe "GET /api/v1/health" do
    it "returns a successful response" do
      get "/api/v1/health"

      expect(response).to have_http_status(:ok)
    end

    it "returns the API health status" do
      get "/api/v1/health"

      expect(response.parsed_body).to eq(
        "status" => "ok",
        "message" => "Marketplace API is running"
      )
    end
  end
end
