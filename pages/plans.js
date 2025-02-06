import { useState, useEffect } from "react";
import Header from "../components/Header";
import TravelPlan from "../components/TravelPlan";
import Footer from "../components/Footer";
import experiencesData from "../data/experiencesData";
import { format } from "date-fns";

function downloadTXT(plan) {
  // Format travel plan details
  let txtContent = `Travel Plan #${plan.plan_number}\n`;
  txtContent += `Created On: ${format(
    new Date(plan.created_at),
    "MMMM dd, yyyy"
  )}\n`;
  txtContent += `Target: ${plan.target_countries} ${
    plan.target_countries === 1 ? "country" : "countries"
  } in ${plan.target_age - plan.current_age} ${
    plan.target_age - plan.current_age === 1 ? "year" : "years"
  }\n`;
  txtContent += `Residence: ${plan.residence}\n`;
  txtContent += `Visited Countries: ${plan.visitedCountries.join(", ")}\n\n`;

  // Add recommended trips
  txtContent += `Recommended Trips:\n`;
  plan.trips.forEach((trip) => {
    txtContent += `\n📍 ${trip.country}\n`;
    txtContent += `   - Start Date: ${format(
      new Date(trip.startDate),
      "yyyy-MM-dd"
    )}\n`;
    txtContent += `   - End Date: ${format(
      new Date(trip.endDate),
      "yyyy-MM-dd"
    )}\n`;

    // Extract individual country names
    const countryNames = trip.country
      .split(",")
      .map((c) => c.trim().replace(/\s[^\p{L}]+/gu, ""));

    // Gather experiences for all countries
    const experiences = countryNames.flatMap(
      (cleanCountry) => experiencesData[cleanCountry] || []
    );

    if (experiences.length > 0) {
      txtContent += `   - Recommended Experience${
        experiences.length > 1 ? "s" : ""
      }:\n`;
      experiences.forEach((exp) => {
        txtContent += `     ${exp}\n`;
      });
    } else {
      txtContent += `   - Recommended Experience: No recommendations available.\n`;
    }
  });

  // Add a friendly closing note with a trademark
  txtContent += `\n---\nBrought to you by WanderGoal™ 💚 Explore the world your way!\n`;

  // Convert to Blob and trigger download
  const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Travel_Plan_${plan.plan_number}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Plan() {
  const [travelPlans, setTravelPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    const guestId = localStorage.getItem("guestId");

    if (!guestId) {
      console.error("User not logged in");
      setLoading(false);
      setError("User not logged in");
      return;
    }

    const fetchTravelPlans = async () => {
      try {
        const response = await fetch(`/api/travel-plan?guestId=${guestId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setTravelPlans([]);
            return;
          }
          throw new Error(`Failed to fetch travel plans: ${response.status}`);
        }

        const data = await response.json();
        setTravelPlans(data.travelPlans || []);
      } catch (error) {
        console.error("Error fetching travel plans:", error);
        setError(error.message);
        setTravelPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPlans();
  }, []);

  const deleteTravelPlan = async () => {
    if (!planToDelete) return;

    try {
      const response = await fetch(`/api/travel-plan/?planId=${planToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete travel plan.");
      }

      setTravelPlans(travelPlans.filter((plan) => plan.id !== planToDelete));
    } catch (error) {
      console.error("Error deleting travel plan:", error);
    } finally {
      setShowModal(false);
      setPlanToDelete(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-[90%] max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
          My Travel Plans
        </h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading travel plans...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : travelPlans.length > 0 ? (
          travelPlans.map((plan) => (
            <div
              key={plan.id}
              className="mb-8 bg-white border border-gray-200 p-6 rounded-lg shadow-md"
            >
              {/* Row for title, date, and download button */}
              <div className="flex items-center justify-between">
                {/* Travel Plan title and date */}
                <div>
                  <h2 className="text-2xl font-semibold text-green-700">
                    Travel Plan #{plan.plan_number}
                  </h2>
                  <p className="text-gray-500">
                    Created on{" "}
                    {format(new Date(plan.created_at), "MMMM dd, yyyy")}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    className="text-green-700 p-2 rounded-full shadow flex items-center justify-center hover:text-green-800"
                    title="Download"
                    onClick={() => downloadTXT(plan)}
                  >
                    📥
                  </button>

                  <button
                    className="text-red-600 p-2 rounded-full shadow flex items-center justify-center hover:text-red-800"
                    title="Delete"
                    onClick={() => {
                      setShowModal(true);
                      setPlanToDelete(plan.id);
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="mt-4">
                <h3 className="text-xl font-medium mb-2 text-green-600">
                  Details:
                </h3>
                <p className="text-gray-700 font-medium">
                  Target: {plan.target_countries}{" "}
                  {plan.target_countries === 1 ? "country" : "countries"} in{" "}
                  {plan.target_age - plan.current_age}{" "}
                  {plan.target_age - plan.current_age === 1 ? "year" : "years"}
                </p>
                <p className="text-gray-700">Residence: {plan.residence}</p>
                <div>
                  <p className="text-gray-700">Visited Countries:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {plan.visitedCountries.length > 0 ? (
                      plan.visitedCountries.map((country, idx) => (
                        <li key={idx}>{country}</li>
                      ))
                    ) : (
                      <li>No countries visited yet.</li>
                    )}
                  </ul>
                </div>

                {/* Recommended Trips Section */}
                <h3 className="text-xl font-medium mt-4 mb-2 text-green-600">
                  Recommended Trips:
                </h3>
                {plan.trips.length > 0 ? (
                  <TravelPlan trips={plan.trips} />
                ) : (
                  <p className="text-gray-500">No trips planned yet.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            You don't have any travel plans yet. Start planning your next
            adventure!
          </p>
        )}
      </main>
      <Footer />

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-xs sm:max-w-sm text-center">
            <h2 className="text-xl font-semibold text-red-600">
              Delete Travel Plan?
            </h2>
            <p className="text-gray-700 mt-2">This action cannot be undone.</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700"
                onClick={deleteTravelPlan}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
