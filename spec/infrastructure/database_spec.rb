# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Database configuration" do
  let(:connection) { ActiveRecord::Base.connection }

  it "connects to the marketplace test database" do
    expect(connection.current_database).to eq("marketplace_test")
  end

  it "uses PostgreSQL as the database adapter" do
    expect(connection.adapter_name).to eq("PostgreSQL")
  end

  it "establishes an active database connection" do
    expect(connection.active?).to be(true)
  end

  it "runs in the test environment" do
    expect(Rails.env.test?).to be(true)
  end
end
