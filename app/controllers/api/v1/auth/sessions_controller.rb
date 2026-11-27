# frozen_string_literal: true

module Api
  module V1
    module Auth
      class SessionsController < BaseController
        before_action :require_authenticated_user!, only: :destroy
        def create
          user = User.find_for_database_authentication(
            email: login_params[:email]
          )

          if valid_credentials?(user)
            sign_in(:user, user, force: true)
            render_success(user)
          else
            render_failure
          end
        end

        def destroy
          sign_out(:user)
          reset_session

          response.headers["Cache-Control"] = "no-store"

          render json: {
            message: "Logout successful"
          }, status: :ok
        end

        private

        def login_params
          params.require(:user).permit(:email, :password)
        end

        def valid_credentials?(user)
          return false unless user

          user.valid_for_authentication? do
            user.valid_password?(login_params[:password])
          end && user.active_for_authentication?
        end

        def render_success(user)
          response.headers["Cache-Control"] = "no-store"

          render json: {
            message: "Login successful",
            user: user.as_json(only: %i[id first_name last_name email role])
          }, status: :ok
        end

        def render_failure
          render json: {
            error: "Invalid email or password"
          }, status: :unauthorized
        end
      end
    end
  end
end
