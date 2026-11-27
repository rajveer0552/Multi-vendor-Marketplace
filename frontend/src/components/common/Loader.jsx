export default function Loader({
  message = 'Loading...',
}) {
  return (
    <div
      className="d-flex flex-column align-items-center
                 justify-content-center py-5"
      role="status"
    >
      <div
        className="spinner-border text-primary"
        aria-hidden="true"
      />

      <p className="text-muted mt-3">
        {message}
      </p>
    </div>
  )
}