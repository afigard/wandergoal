import { format } from "date-fns";

export default function TravelPlan({ trips }) {
  return (
    <div className="space-y-4">
      {trips.length > 0 ? (
        trips.map((trip, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg shadow-md bg-white"
          >
            <h2 className="text-lg font-bold text-green-700">{trip.country}</h2>
            <p className="text-sm text-gray-600">
              {format(new Date(trip.startDate), "MMMM dd")}
              {trip.startDate.slice(0, 4) === trip.endDate.slice(0, 4)
                ? " → "
                : ` ${format(new Date(trip.startDate), "(yyyy)")} → `}
              {format(new Date(trip.endDate), "MMMM dd (yyyy)")}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No trips planned yet!</p>
      )}
    </div>
  );
}
