import Header from "../components/layout/Header";
import TravelForm from "../components/travel/TravelForm";
import Footer from "../components/layout/Footer";
import { useRef, useState } from "react";
import {
  FaPlane,
  FaBusAlt,
  FaUmbrellaBeach,
  FaPassport,
  FaGlobeAmericas,
} from "react-icons/fa";

export default function Home() {
  const formRef = useRef(null);
  const [isWiggling, setIsWiggling] = useState(true);

  const icons = [
    FaPlane,
    FaBusAlt,
    FaUmbrellaBeach,
    FaPassport,
    FaGlobeAmericas,
  ];

  const gridSize = 6;
  const iconGrid = Array.from({ length: gridSize * gridSize });

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col">
      {/* Background Grid with React Icons */}
      <div className="absolute inset-0 grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-6 sm:gap-x-6 lg:gap-y-10 pointer-events-none">
        {iconGrid.map((_, index) => {
          const Icon = icons[index % icons.length];
          const animationDelay = `${Math.random() * 2}s`;

          return (
            <div
              key={index}
              className="flex justify-center items-center animate-float"
              style={{ animationDelay }}
            >
              <Icon className="text-4xl text-green-700 opacity-5 transform rotate-45" />
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <Header />
      <main className="container mx-auto px-4 py-8 flex flex-col items-center md:flex-row md:items-center md:justify-between flex-grow relative z-10">
        {/* Text Section */}
        <div className="text-center md:text-left md:w-1/2 p-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-transparent bg-clip-text mb-6">
            Travel With Intention.
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto md:mx-0">
            Built for those who move with purpose. Plan with clarity. Track the
            full journey.
          </p>

          {/* CTA Button (mobile-only) */}
          <a
            onClick={() => {
              setIsWiggling(false);
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
              // Focus the first input inside the form
              if (formRef.current) {
                const firstInput = formRef.current.querySelector(
                  "input, select, textarea"
                );
                if (firstInput) {
                  firstInput.focus();
                }
              }
            }}
            className={`inline-block bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-3 px-6 rounded-lg shadow-lg transition md:hidden mb-6 ${
              isWiggling ? "animate-wiggle" : ""
            }`}
          >
            Start the Journey
          </a>
        </div>

        {/* Form Section */}
        <div ref={formRef} className="w-full md:w-1/2">
          <TravelForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
