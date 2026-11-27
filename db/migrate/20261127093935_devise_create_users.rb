# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      # Personal information
      t.string :first_name, null: false
      t.string :last_name, null: false

      # Database authenticatable
      t.string :email, null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      # Role management
      t.integer :role, null: false, default: 0

      # Recoverable
      t.string :reset_password_token
      t.datetime :reset_password_sent_at

      # Rememberable
      t.datetime :remember_created_at

      t.timestamps null: false
    end

    add_index :users, :email, unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :role

    add_check_constraint :users, "role IN (0, 1, 2)",
                         name: "users_role_check"
  end
end
