import TravelForm from "../components/TravelForm";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        WanderGoal: Plan Your Adventures
      </h1>
      <TravelForm />
    </div>
  );
}
