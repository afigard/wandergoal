import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col items-center space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
        <p className="text-sm border-b border-white-200">
          © {new Date().getFullYear()} WanderGoal. All rights reserved.
        </p>
        <div className="text-sm flex items-center space-x-2 border-b border-white-200">
          <span>Made with 💚 by</span>
          <a
            href="https://www.instagram.com/ad.fgrd/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
