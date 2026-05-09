// src/pages/NotFound.jsx
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white text-center px-4">
      {/* Big 404 */}
      <h1 className="text-9xl font-extrabold drop-shadow-lg">404</h1>
      <p className="mt-4 text-2xl font-semibold">Oops! Page not found</p>
      <p className="mt-2 text-lg text-blue-100 max-w-lg">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Back Button */}
      <Link
        to="/"
        className="mt-8 inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
