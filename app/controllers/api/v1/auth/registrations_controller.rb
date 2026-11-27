# frozen_string_literal: true

module Api
  module V1
    module Auth
      class RegistrationsController < BaseController
        def create
          user = User.new(registration_params)
          user.role = :customer

          if user.save
            render json: {
              message: "Registration successful",
              user: user.as_json(only: %i[id first_name last_name email role])
            }, status: :created
          else
            render json: {
              errors: user.errors.full_messages
            }, status: :unprocessable_content
          end
        end

        private

        def registration_params
          params.require(:user).permit(
            :first_name,
            :last_name,
            :email,
            :password,
            :password_confirmation
          )
        end
      end
    end
  end
end
