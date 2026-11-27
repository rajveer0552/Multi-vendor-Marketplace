import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ErrorAlert from '../common/ErrorAlert'
import useAuth from '../../hooks/useAuth'

export default function Layout() {
  const { sessionError } = useAuth()

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        {sessionError && (
          <div className="container mt-3">
            <ErrorAlert message={sessionError} />
          </div>
        )}

        <Outlet />
      </main>

      <Footer />
    </div>
  )
}