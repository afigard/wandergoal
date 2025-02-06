import experiencesData from "../data/experiencesData";
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

          return (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg shadow-md bg-white"
            >
              <h2 className="text-lg font-bold text-green-700">
                {trip.country}
              </h2>
              <p className="text-sm text-gray-600">
                {format(new Date(trip.startDate), "MMMM dd")}
                {trip.startDate.slice(0, 4) === trip.endDate.slice(0, 4)
                  ? " → "
                  : ` ${format(new Date(trip.startDate), "(yyyy)")} → `}
                {format(new Date(trip.endDate), "MMMM dd (yyyy)")}
              </p>

              {/* Recommended Experiences Section */}
              <h3 className="text-lg font-medium text-green-600 mt-2">
                {experiences.length === 1
                  ? "Recommended Experience"
                  : "Recommended Experiences"}
                :
              </h3>
              {experiences.length > 0 ? (
                <ul className="text-gray-700">
                  {experiences.map((experience, idx) => (
                    <li key={idx}>{experience}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recommendations available.</p>
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
