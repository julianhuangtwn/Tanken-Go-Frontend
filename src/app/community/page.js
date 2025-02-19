// app/community/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Page() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;    
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/v1/trips/public`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token if needed
          }
      });
        const data = await response.json();
        
        console.log("API Response:", data);

        if (data?.status === "ok" && Array.isArray(data.data)) {
          setTrips(data.data);
        } else {
          setError("Unexpected API response structure.");
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
        <h1 className="text-3xl font-bold text-center">Public Trips</h1>
        <p className="text-gray-600 text-center mt-2">Discover exciting trips shared by the community.</p>

        {error && <p className="text-center text-red-500">{error}</p>}
        {loading ? <p className="text-center">Loading...</p> : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {trips.length > 0 ? (
            trips.map((trip) => (
              <div 
                key={trip.tripId} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/community/${trip.tripId}`)}
              >
                <img
                  src={`https://source.unsplash.com/400x300/?travel,${trip.tripId}`}
                  alt={trip.tripName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{trip.tripName}</h2>
                  <p className="text-gray-500 text-sm">🗓 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                  <p className="text-gray-600 font-semibold">💰 ${trip.totalCostEstimate}</p>
    
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No public trips available</p>
          )}
        </div>
      </div>
    </div>
  );
}

