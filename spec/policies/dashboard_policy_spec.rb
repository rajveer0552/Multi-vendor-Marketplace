# frozen_string_literal: true

require "rails_helper"

RSpec.describe DashboardPolicy do
  subject(:policy) { described_class.new(user, :dashboard) }

  context "when the user is a customer" do
    let(:user) { build(:user) }

    it "allows access to the customer dashboard" do
      expect(policy.customer?).to be(true)
    end

    it "denies access to the vendor dashboard" do
      expect(policy.vendor?).to be(false)
    end

    it "denies access to the admin dashboard" do
      expect(policy.admin?).to be(false)
    end
  end

  context "when the user is a vendor" do
    let(:user) { build(:user, :vendor) }

    it "denies access to the customer dashboard" do
      expect(policy.customer?).to be(false)
    end

    it "allows access to the vendor dashboard" do
      expect(policy.vendor?).to be(true)
    end

    it "denies access to the admin dashboard" do
      expect(policy.admin?).to be(false)
    end
  end

  context "when the user is an admin" do
    let(:user) { build(:user, :admin) }

    it "denies access to the customer dashboard" do
      expect(policy.customer?).to be(false)
    end

    it "denies access to the vendor dashboard" do
      expect(policy.vendor?).to be(false)
    end

    it "allows access to the admin dashboard" do
      expect(policy.admin?).to be(true)
    end
  end

  context "when the user is unauthenticated" do
    let(:user) { nil }

    it "denies access to the customer dashboard" do
      expect(policy.customer?).to be(false)
    end

    it "denies access to the vendor dashboard" do
      expect(policy.vendor?).to be(false)
    end

    it "denies access to the admin dashboard" do
      expect(policy.admin?).to be(false)
    end
  end
end
