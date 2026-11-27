# frozen_string_literal: true

module Api
  module V1
    class BaseController < ApplicationController
      include Pundit::Authorization

      protect_from_forgery with: :exception

      rescue_from ActionController::InvalidAuthenticityToken,
                  with: :invalid_authenticity_token

      rescue_from Pundit::NotAuthorizedError,
                  with: :user_not_authorized

      private

      def invalid_authenticity_token
        render json: {
          error: "Invalid CSRF token"
        }, status: :unprocessable_content
      end

      def require_authenticated_user!
        return if user_signed_in?

        render json: {
          error: "Authentication required"
        }, status: :unauthorized
      end

      def user_not_authorized
        render json: {
          error: "You are not authorized to perform this action"
        }, status: :forbidden
      end
    end
  end
end
