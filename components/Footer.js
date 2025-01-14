import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center items-center">
        <p className="text-center flex items-center space-x-2">
          <span>Made by</span>
          <a
            href="https://www.instagram.com/ad.fgrd/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 transition"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
          <span>with ❤️</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
