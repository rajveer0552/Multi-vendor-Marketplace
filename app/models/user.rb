# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum :role, { customer: 0, vendor: 1, admin: 2 }, validate: true

  validates :first_name, :last_name, presence: true, length: { maximum: 50 }

  def full_name
    "#{first_name} #{last_name}"
  end
end
