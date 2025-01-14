import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import TravelForm from "../components/TravelForm";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Header />
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-600 text-center mb-8">
          WanderGoal: Plan Your Adventures 🚕🚌🚃✈️🌍
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 text-center mb-6 max-w-2xl">
          Your personalized travel planner to help you achieve your adventure
          goals. Set your targets, plan your trips, and make every journey
          memorable!
        </p>
        <TravelForm />
      </main>
      <Footer />
    </div>
  );
}
