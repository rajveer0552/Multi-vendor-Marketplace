export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1 fw-semibold">
          Multi-Vendor Marketplace
        </p>

        <p className="small text-white-50 mb-1">
          Built with Ruby on Rails and React
        </p>

        <p className="small text-white-50 mb-0">
          © {new Date().getFullYear()} Marketplace
        </p>
      </div>
    </footer>
  )
}