import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        <p className="text-sm flex items-center">
          © {new Date().getFullYear()} WanderGoal.
        </p>
        <p className="text-sm flex items-center">
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
