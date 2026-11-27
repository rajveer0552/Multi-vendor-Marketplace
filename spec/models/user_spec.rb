# frozen_string_literal: true

require "rails_helper"

RSpec.describe User do
  describe "validations" do
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }
    it { is_expected.to validate_presence_of(:email) }

    it { is_expected.to validate_length_of(:first_name).is_at_most(50) }
    it { is_expected.to validate_length_of(:last_name).is_at_most(50) }
  end

  describe "roles" do
    it "assigns customer as the default role" do
      expect(described_class.new.role).to eq("customer")
    end

    it "supports the customer role" do
      user = build(:user)

      expect(user).to be_customer
    end

    it "supports the vendor role" do
      user = build(:user, :vendor)

      expect(user).to be_vendor
    end

    it "supports the admin role" do
      user = build(:user, :admin)

      expect(user).to be_admin
    end

    it "rejects an invalid role" do
      user = build(:user, role: :manager)

      expect(user).not_to be_valid
    end
  end

  describe "#full_name" do
    it "returns the first name and last name" do
      user = build(:user, first_name: "Test", last_name: "Customer")

      expect(user.full_name).to eq("Test Customer")
    end
  end

  describe "authentication" do
    it "creates a valid user" do
      expect(build(:user)).to be_valid
    end

    it "rejects duplicate email addresses" do
      existing_user = create(:user)
      user = build(:user, email: existing_user.email)

      expect(user).not_to be_valid
    end

    it "authenticates a valid password" do
      user = create(:user)

      expect(user.valid_password?("Test@123456")).to be(true)
    end

    it "rejects an incorrect password" do
      user = create(:user)

      expect(user.valid_password?("incorrect-password")).to be(false)
    end
  end
end
