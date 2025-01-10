import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import TravelForm from "../components/TravelForm";

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
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-6">
        WanderGoal: Plan Your Adventures
      </h1>
      <TravelForm />
    </div>
  );
}
