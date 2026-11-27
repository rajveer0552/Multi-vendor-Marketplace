# frozen_string_literal: true

module Api
  module V1
    module Auth
      class UsersController < BaseController
        before_action :require_authenticated_user!

        def show
          response.headers["Cache-Control"] = "no-store"

          render json: {
            user: current_user.as_json(
              only: %i[id first_name last_name email role]
            )
          }, status: :ok
        end
      end
    end
  end
end
