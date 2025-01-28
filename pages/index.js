import Header from "../components/Header";
import TravelForm from "../components/TravelForm";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex flex-col items-center md:flex-row md:items-center md:justify-between flex-grow">
        {/* Text Section */}
        <div className="text-center md:text-left md:w-1/2 p-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-600 text-center md:text-left mb-8">
            WanderGoal: Plan Your Adventures 🗺️🚕🚌🚃✈️
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 text-center md:text-left mb-6 max-w-2xl mx-auto md:mx-0">
            Your personalized travel planner to help you achieve your adventure
            goals. Set your targets, plan your trips, and make every journey
            memorable!
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2">
          <TravelForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
