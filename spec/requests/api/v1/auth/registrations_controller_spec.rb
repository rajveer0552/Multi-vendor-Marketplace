# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::Auth::RegistrationsController, type: :request do
  let(:registration_path) { "/api/v1/auth/register" }

  let(:valid_attributes) do
    {
      first_name: "Test",
      last_name: "Customer",
      email: "customer@example.com",
      password: "Test@123456",
      password_confirmation: "Test@123456"
    }
  end

  describe "POST /api/v1/auth/register" do
    context "with valid parameters" do
      it "creates a new user" do
        expect do
          post registration_path, params: { user: valid_attributes }, as: :json
        end.to change(User, :count).by(1)
      end

      it "returns a successful registration response" do
        post registration_path, params: { user: valid_attributes }, as: :json

        expect(response).to have_http_status(:created)
        expect(response.parsed_body["message"]).to eq("Registration successful")
      end

      it "assigns the customer role" do
        post registration_path, params: { user: valid_attributes }, as: :json

        expect(User.find_by(email: valid_attributes[:email])).to be_customer
      end

      it "returns only permitted user attributes" do
        post registration_path, params: { user: valid_attributes }, as: :json

        expect(response.parsed_body["user"].keys).to match_array(
          %w[id first_name last_name email role]
        )
      end
    end

    context "with invalid parameters" do
      it "rejects a missing first name" do
        attributes = valid_attributes.merge(first_name: "")

        post registration_path, params: { user: attributes }, as: :json

        expect(response).to have_http_status(422)
      end

      it "rejects a missing last name" do
        attributes = valid_attributes.merge(last_name: "")

        post registration_path, params: { user: attributes }, as: :json

        expect(response).to have_http_status(422)
      end

      it "rejects an invalid email address" do
        attributes = valid_attributes.merge(email: "invalid-email")

        post registration_path, params: { user: attributes }, as: :json

        expect(response).to have_http_status(422)
      end

      it "rejects duplicate email addresses" do
        create(:user, email: valid_attributes[:email])

        post registration_path, params: { user: valid_attributes }, as: :json

        expect(response).to have_http_status(422)
      end

      it "rejects a short password" do
        attributes = valid_attributes.merge(
          password: "123",
          password_confirmation: "123"
        )

        post registration_path, params: { user: attributes }, as: :json

        expect(response).to have_http_status(422)
      end

      it "rejects mismatched password confirmation" do
        attributes = valid_attributes.merge(password_confirmation: "incorrect")

        post registration_path, params: { user: attributes }, as: :json

        expect(response).to have_http_status(422)
      end

      it "does not create an invalid user" do
        attributes = valid_attributes.merge(email: "")

        expect do
          post registration_path, params: { user: attributes }, as: :json
        end.not_to change(User, :count)
      end
    end

    context "with unauthorized role parameters" do
      it "prevents admin role assignment" do
        attributes = valid_attributes.merge(role: "admin")

        post registration_path, params: { user: attributes }, as: :json

        expect(response).to have_http_status(:created)
        expect(User.find_by(email: valid_attributes[:email])).to be_customer
      end

      it "prevents vendor role assignment" do
        attributes = valid_attributes.merge(role: "vendor")

        post registration_path, params: { user: attributes }, as: :json

        expect(response).to have_http_status(:created)
        expect(User.find_by(email: valid_attributes[:email])).to be_customer
      end
    end
  end
end
