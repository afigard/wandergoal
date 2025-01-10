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
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 mb-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
          <Link href="/" className="text-lg sm:text-xl font-bold">
            Home
          </Link>
          <Link href="/plan" className="text-lg sm:text-xl font-bold">
            Travel Plans
          </Link>
        </div>

        <div className="space-y-2 sm:space-y-0 sm:space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-lg border border-white px-3 py-2 rounded sm:px-4"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-lg bg-white text-blue-600 px-3 py-2 rounded sm:px-4"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-2 rounded sm:px-4"
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
