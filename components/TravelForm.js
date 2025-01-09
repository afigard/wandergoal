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
    const data = await response.json();
    router.push({
      pathname: "/plan",
      query: { trips: JSON.stringify(data.trips) },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Target Countries:</label>
        <input
          type="number"
          name="targetCountries"
          value={formData.targetCountries}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Target Age:</label>
        <input
          type="number"
          name="targetAge"
          value={formData.targetAge}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Current Age:</label>
        <input
          type="number"
          name="currentAge"
          value={formData.currentAge}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Residence:</label>
        <input
          type="text"
          name="residence"
          value={formData.residence}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Visited Countries (comma-separated ISO codes):</label>
        <input
          type="text"
          name="visited"
          value={formData.visited}
          onChange={handleChange}
          className="input"
        />
      </div>
      <button type="submit" className="btn-primary">
        Plan My Travel
      </button>
    </form>
  );
}
