export default function TravelPlan({ trips }) {
  return (
    <div className="space-y-4">
      {trips.length > 0 ? (
        trips.map((trip, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-bold">{trip.location}</h2>
            <p className="text-sm text-gray-600">Date: {trip.date}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No trips planned yet!</p>
      )}
    </div>
  );
}
