# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }

    sequence(:email) { |n| "user#{n}@example.com" }

    password { "Test@123456" }
    password_confirmation { password }

    role { :customer }

    trait :vendor do
      role { :vendor }
    end

    trait :admin do
      role { :admin }
    end
  end
end
