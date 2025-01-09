import { useRouter } from "next/router";
import TravelPlan from "../components/TravelPlan";

export default function Plan() {
  const router = useRouter();
  const trips = JSON.parse(router.query.trips || "[]");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Travel Plan</h1>
      <TravelPlan trips={trips} />
    </div>
  );
}
