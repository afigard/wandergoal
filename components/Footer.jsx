import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col items-center space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
        <p className="text-sm flex items-center">
          © {new Date().getFullYear()} WanderGoal. All rights reserved. By{" "}
          <a
            href="https://www.instagram.com/ad.fgrd/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
