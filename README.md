# Multi-Vendor Marketplace

A full-stack multi-vendor e-commerce marketplace built with Ruby on Rails, designed to support customers, vendors, and administrators through a secure and scalable architecture.

## Project Status

Under active development. Currently, the application foundation, database infrastructure, automated testing, and code quality configurations are complete.

## Planned Features

- User authentication and role-based authorization
- Customer, vendor, and admin dashboards
- Vendor registration and approval
- Product and category management
- Inventory and stock management
- Multi-vendor shopping cart
- Order management and checkout
- Stripe payment integration in test mode
- Vendor commissions and refunds
- Product search, filtering, and reviews
- Background jobs and notifications
- REST APIs and API documentation
- Automated testing and CI/CD

## Technology Stack

| Technology | Version / Tool |
|---|---|
| Ruby | 3.2.11 |
| Ruby on Rails | 7.1.6 |
| PostgreSQL | 16 |
| Redis | 7 |
| Frontend | Hotwire, Turbo, Stimulus |
| Testing | RSpec, FactoryBot, Shoulda Matchers |
| Code Quality | RuboCop |
| Code Coverage | SimpleCov |
| Infrastructure | Docker Compose |
| Version Control | Git and GitHub |

## Local Development Setup

### Prerequisites

- Ruby 3.2.11
- Bundler
- Docker
- Docker Compose
- Git

### Installation

```bash
bundle config set --local path vendor/bundle
bundle install
```

### Start Infrastructure

```bash
docker compose -p marketplace up -d
```

### Database Setup

```bash
rails db:create
rails db:migrate
```

### Start Application

```bash
rails s -p 3001
```

Visit http://localhost:3001.

## Local Service Configuration

| Service | Port |
|---|---|
| Rails | 3001 |
| PostgreSQL | 5434 |
| Redis | 6380 |

## Running Tests

```bash
bundle exec rspec
```

## Code Quality

```bash
bundle exec rubocop
```

## Test Coverage

SimpleCov generates an HTML coverage report at `coverage/index.html`.

The project aims to maintain at least 70% automated test coverage as business functionality is implemented.

## Development Roadmap

- Phase 1: Project foundation
- Phase 2: Authentication and authorization
- Phase 3: Vendor and product management
- Phase 4: Shopping cart and order management
- Phase 5: Payments, commissions, and refunds
- Phase 6: Background jobs and notifications
- Phase 7: APIs, security, and performance
- Phase 8: Deployment and documentation