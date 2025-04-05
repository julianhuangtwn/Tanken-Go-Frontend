"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Page() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(""); // Single sorting state
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
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
      });
        const data = await response.json();
        
        console.log("API Response:", data);

        if (data?.status === "ok" && Array.isArray(data.data)) {
          setTrips(data.data);
          setFilteredTrips(data.data);
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

  // Handle search filtering
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTrips(
      trips.filter((trip) => trip.tripName.toLowerCase().includes(query))
    );
  };

  // Handle sorting (both budget & duration)
  const handleSort = (option) => {
    setSortOption(option);
    let sortedTrips = [...filteredTrips];

    if (option === "lowToHigh") {
      sortedTrips.sort((a, b) => a.totalCostEstimate - b.totalCostEstimate);
    } else if (option === "highToLow") {
      sortedTrips.sort((a, b) => b.totalCostEstimate - a.totalCostEstimate);
    } else if (option === "shortestToLongest") {
      sortedTrips.sort((a, b) => {
        const durationA = new Date(a.endDate) - new Date(a.startDate);
        const durationB = new Date(b.endDate) - new Date(b.startDate);
        return durationA - durationB;
      });
    } else if (option === "longestToShortest") {
      sortedTrips.sort((a, b) => {
        const durationA = new Date(a.endDate) - new Date(a.startDate);
        const durationB = new Date(b.endDate) - new Date(b.startDate);
        return durationB - durationA;
      });
    } else if (option === "newestToOldest") {
      sortedTrips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (option === "oldestToNewest") {
      sortedTrips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    setFilteredTrips(sortedTrips);
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header + Search Bar + Combined Filter */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-gray-600 mt-2">Discover exciting trips shared by the community.</p>
        </div>

        <div className="flex justify-end items-center gap-4 mt-8 mb-6 flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-full shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-700 placeholder-gray-400 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            onChange={(e) => handleSort(e.target.value)}
            value={sortOption}
            className="px-4 py-2 border border-pink-300 rounded-full shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-700 cursor-pointer"
          >
            <option value="">Sort by</option>
            <option value="lowToHigh">💰 Budget: Low to High</option>
            <option value="highToLow">💰 Budget: High to Low</option>
            <option value="newestToOldest">📆 Date: Newest to Oldest</option>
            <option value="oldestToNewest">📆 Date: Oldest to Newest</option>
            <option value="shortestToLongest">🗓 Duration: Shortest to Longest</option>
            <option value="longestToShortest">🗓 Duration: Longest to Shortest</option>
          </select>
        </div>


        {error && <p className="text-center text-red-500">{error}</p>}
        {loading ? <p className="text-center">Loading...</p> : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <div 
                key={trip.tripId} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/community/${trip.tripId}`)}
              >
              <img
                src={trip.imageUrl || "/default_trip.png"}
                alt={trip.tripName}
                className="w-full h-[200px] object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h2 className="font-semibold text-lg">{trip.tripName}</h2>
                  <p className="text-gray-500 text-sm">
                    🗓 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 font-semibold mt-1">💰 ${trip.totalCostEstimate}</p>
                  <p className="text-gray-600 font-semibold mt-1">📍 {trip.city}, {trip.country}</p>
                </div>

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
