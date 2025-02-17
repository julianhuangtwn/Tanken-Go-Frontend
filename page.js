// app/community/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/trips/public");
        const data = await response.json();

        console.log("API Response:", data); 

        // Ensure the data structure matches before setting state
        if (data && data.status === "ok" && Array.isArray(data.data)) {
          setTrips(data.data);
        } else {
          setError("API response structure is unexpected.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching trips.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center">More Trips</h1>
        <p className="text-gray-600 text-center mt-2">
          Explore more trips for your next trip idea!
        </p>

        {error && <p className="text-center text-red-500">{error}</p>}
        {loading ? <p className="text-center">Loading...</p> : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {trips.length > 0 ? (
            trips.map((trip) => (
              <div 
                key={trip.tripId} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/community/trips/${trip.tripId}/details`)} // Redirect to trip details page
              >
                <img
                  src={trip.imgUrl || `https://source.unsplash.com/400x300/?travel,${trip.tripId}`}
                  alt={trip.destinationName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{trip.tripName}</h2>
                  <p className="text-gray-500 text-sm">{trip.destinationName}</p>
                  <div className="flex items-center justify-between mt-2 text-gray-500 text-sm">
                    <span>👤 {trip.username || "Anonymous"}</span>
                    <span>📍 {trip.city}, {trip.country}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No trips available</p>
          )}
        </div>
      </div>
    </div>
  );
}
