"use client"

// saved-trips/[id].jsx
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getToken } from "@/lib/authenticate";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export default function TripDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchTripDetail() {
      try {
        const res = await fetch(NEXT_PUBLIC_API_URL +  `/v1/trip/${id}`, { headers: { Authorization: `Bearer ${getToken()}` }}); // adjust endpoint if needed
        if (res.ok) {
          const data = await res.json();
          setTrip(data);
        }
      } catch (error) {
        console.error("Error fetching trip detail:", error);
      }
    }
    fetchTripDetail();
  }, [id]);

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1 className="text-3xl font-sans font-semibold mb-6">{trip.tripName}</h1>
      <p>Total Cost Estimate: ${trip.totalCostEstimate}</p>
      <p>Start Date: {trip.startDate}</p>
      <p>End Date: {trip.endDate}</p>
      
    </div>
  );
}
