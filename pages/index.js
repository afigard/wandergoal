import TravelForm from "../components/TravelForm";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">WanderGoal</h1>
      <p className="mb-6">Plan your journey to reach your travel goals!</p>
      <TravelForm />
    </div>
  );
}
