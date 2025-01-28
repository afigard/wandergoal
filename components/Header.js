import Link from "next/link";
import { FaHome, FaMapMarkedAlt } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
        <div className="flex space-x-16">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold hover:underline flex items-center space-x-2"
          >
            <FaHome size={20} />
            <span>Home</span>
          </Link>
          <Link
            href="/plan"
            className="text-lg sm:text-xl font-bold hover:underline flex items-center space-x-2"
          >
            <FaMapMarkedAlt size={20} />
            <span>Travel Plans</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
