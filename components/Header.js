import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="bg-green-600 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold hover:underline"
          >
            Home
          </Link>
          <Link
            href="/plan"
            className="text-lg sm:text-xl font-bold hover:underline"
          >
            Travel Plans
          </Link>
        </div>

        {/* Authentication Buttons */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-sm sm:text-lg border border-white px-3 py-2 rounded hover:bg-white hover:text-green-600 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm sm:text-lg bg-white text-green-600 px-3 py-2 rounded hover:bg-green-700 hover:text-white transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm sm:text-lg bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
