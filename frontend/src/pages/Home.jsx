import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/constants'

const features = [
  {
    title: 'Multiple Vendors',
    description:
      'Discover products from different sellers in one marketplace.',
  },
  {
    title: 'Secure Shopping',
    description:
      'Shop with protected accounts and secure transactions.',
  },
  {
    title: 'Easy Order Management',
    description:
      'Manage your purchases and orders from one dashboard.',
  },
]

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <>
      <section className="marketplace-hero">
        <div className="container py-5 text-center">
          <h1 className="display-4 fw-bold">
            Multi-Vendor Marketplace
          </h1>

          <p className="lead mx-auto hero-description">
            Discover, shop and sell products through
            a single marketplace platform.
          </p>

          {!loading && (
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              {user ? (
                <Link
                  to={getDashboardRoute(user.role)}
                  className="btn btn-light btn-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-light btn-lg"
                  >
                    Get Started
                  </Link>

                  <Link
                    to="/login"
                    className="btn btn-outline-light btn-lg"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">
          Our Marketplace
        </h2>

        <div className="row g-4">
          {features.map((feature) => (
            <div className="col-md-4" key={feature.title}>
              <div className="card feature-card h-100">
                <div className="card-body p-4">
                  <h4>{feature.title}</h4>

                  <p className="text-muted mb-0">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted mt-4">
          Marketplace features are currently under development.
        </p>
      </section>
    </>
  )
}