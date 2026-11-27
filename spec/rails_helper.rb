# frozen_string_literal: true

require "spec_helper"

ENV["RAILS_ENV"] ||= "test"

abort("RSpec must run in the test environment!") unless ENV["RAILS_ENV"] == "test"

require_relative "../config/environment"
require "rspec/rails"

abort("RSpec must run in the test environment!") unless Rails.env.test?

# Ensure tests use the marketplace test database.
database_config = ActiveRecord::Base.connection_db_config

abort("Incorrect test database!") unless database_config.database == "marketplace_test"

# Load support files.
Rails.root.glob("spec/support/**/*.rb").sort_by(&:to_s).each { |f| require f }

# Check for pending migrations.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.fixture_paths = [
    Rails.root.join("spec/fixtures")
  ]

  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end
