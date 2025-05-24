import { useState } from "react";
import experiencesData from "../../lib/constants/experiencesData";
import { format } from "date-fns";

export default function TravelPlan({ trips }) {
  return (
    <div className="space-y-4">
      {trips.length > 0 ? (
        trips.map((trip, index) => {
          // Extract individual country names
          const countryNames = trip.country
            .split(",")
            .map((c) => c.trim().replace(/\s[^\p{L}]+/gu, ""));

          // Gather experiences for all countries
          const experiences = countryNames.flatMap(
            (cleanCountry) => experiencesData[cleanCountry] || []
          );

          // Local state for collapsible experiences
          const [expanded, setExpanded] = useState(false);

          return (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg shadow-md bg-white"
            >
              <h2 className="text-lg font-bold text-green-700">
                {trip.country}
              </h2>
              <p className="text-sm text-gray-500">
                {format(new Date(trip.startDate), "MMMM dd")}
                {trip.startDate.slice(0, 4) === trip.endDate.slice(0, 4)
                  ? " → "
                  : ` ${format(new Date(trip.startDate), "(yyyy)")} → `}
                {format(new Date(trip.endDate), "MMMM dd (yyyy)")}
              </p>

              {/* Recommended Experiences Section with Toggle */}
              {experiences.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <svg
                      className={`mr-1 w-3 h-3 transform transition-transform ${
                        expanded ? "rotate-90" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <polygon points="5,3 15,10 5,17" />
                    </svg>
                    {experiences.length === 1
                      ? "Recommended Experience"
                      : "Recommended Experiences"}
                  </button>

                  {expanded && (
                    <ul className="mt-2 text-gray-700">
                      {experiences.map((experience, idx) => (
                        <li key={idx}>{experience}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No trips planned yet!</p>
      )}
    </div>
  );
}
