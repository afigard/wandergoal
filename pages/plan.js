import { useState, useEffect } from "react";
import Header from "../components/Header";
import TravelPlan from "../components/TravelPlan";
import Footer from "../components/Footer";
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
    txtContent += `${trip.country}, Start Date: ${format(
      new Date(trip.startDate),
      "yyyy-MM-dd"
    )}, End Date: ${format(new Date(trip.endDate), "yyyy-MM-dd")}\n`;
  });

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

                {/* Download button */}
                <button
                  className="text-green-700 p-2 rounded-full shadow flex items-center justify-center hover:text-green-800"
                  title="Download"
                  onClick={() => downloadTXT(plan)}
                >
                  {/* Download arrow icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v12m0 0l-4-4m4 4l4-4M4.5 19.5h15"
                    />
                  </svg>
                </button>
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
    </div>
  );
}
