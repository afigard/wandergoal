import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-green-600 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
        <div className="flex space-x-16">
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
      </div>
    </header>
  );
};

export default Header;
