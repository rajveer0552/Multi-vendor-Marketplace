# frozen_string_literal: true

module Api
  module V1
    class DashboardsController < BaseController
      before_action :require_authenticated_user!
      after_action :verify_authorized

      def customer
        authorize :dashboard, :customer?

        render_dashboard("Customer dashboard")
      end

      def vendor
        authorize :dashboard, :vendor?

        render_dashboard("Vendor dashboard")
      end

      def admin
        authorize :dashboard, :admin?

        render_dashboard("Admin dashboard")
      end

      private

      def render_dashboard(message)
        response.headers["Cache-Control"] = "no-store"

        render json: {
          message: message,
          role: current_user.role
        }, status: :ok
      end
    end
  end
end
