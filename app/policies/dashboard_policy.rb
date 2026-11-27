# frozen_string_literal: true

class DashboardPolicy < ApplicationPolicy
  def customer?
    user.present? && user.customer?
  end

  def vendor?
    user.present? && user.vendor?
  end

  def admin?
    user.present? && user.admin?
  end
end
