import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaMapMarkedAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FiTarget } from "react-icons/fi";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiTarget size={24} />
          <span className="text-xl font-bold">WanderGoal</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="hover:underline flex items-center space-x-2"
          >
            <FaHome size={20} />
            <span>Home</span>
          </Link>
          <Link
            href="/plans"
            className="hover:underline flex items-center space-x-2"
          >
            <FaMapMarkedAlt size={20} />
            <span>Travel Plans</span>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-green-700">
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col space-y-2">
            <Link
              href="/"
              className="hover:underline flex items-center space-x-2"
              onClick={() => setMenuOpen(false)}
            >
              <FaHome size={20} />
              <span>Home</span>
            </Link>
            <div className="h-px bg-green-600" />
            <Link
              href="/plans"
              className="hover:underline flex items-center space-x-2"
              onClick={() => setMenuOpen(false)}
            >
              <FaMapMarkedAlt size={20} />
              <span>Travel Plans</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
