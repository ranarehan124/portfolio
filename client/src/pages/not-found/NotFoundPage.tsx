import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark px-4">
      <h1 className="font-display text-hero-xl font-bold text-white">404</h1>
      <p className="mt-4 text-lg text-white/50">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;