import { useState } from "react";
import { useRouter } from "next/router";

export default function TravelForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    targetCountries: "",
    targetAge: "",
    currentAge: "",
    residence: "",
    visited: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/travel-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      router.push({
        pathname: "/plan",
        query: { trips: JSON.stringify(data.trips) },
      });
    } else {
      console.error("Error generating travel plan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Target Countries
        </label>
        <input
          type="number"
          name="targetCountries"
          value={formData.targetCountries}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Target Age
        </label>
        <input
          type="number"
          name="targetAge"
          value={formData.targetAge}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Age
        </label>
        <input
          type="number"
          name="currentAge"
          value={formData.currentAge}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Residence
        </label>
        <input
          type="text"
          name="residence"
          value={formData.residence}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Visited Countries (ISO codes)
        </label>
        <input
          type="text"
          name="visited"
          value={formData.visited}
          onChange={handleChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg"
      >
        Plan My Travel
      </button>
    </form>
  );
}
