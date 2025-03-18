"use client"

// React 
import { useEffect } from "react"

// Atoms
import { useAtom } from "jotai"
import { tripsAtom } from "@/lib/tripsAtom"

// Components
import AccountTripCard from "@/components/AccountTripCard"
import { Button } from "@/components/ui/button"

// Utils
import { getToken } from "@/lib/authenticate"


const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Page(){
  const [ trips, setTrips] = useAtom(tripsAtom);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await fetch(NEXT_PUBLIC_API_URL + "/v1/trip", { headers: { Authorization: `Bearer ${getToken()}` }});
        if (!response.ok) {
          console.error("Error fetching trips:", response.message);
          return
        }
        const data = await response.json();
        setTrips(data.trips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    }
    fetchTrips();
  }, [setTrips]);


    return (
      <div className="container">
        <h1 className="text-3xl font-sans font-semibold mb-6">Saved Trips</h1>
        <div className="flex flex-wrap flex-row gap-6 my-4">
          {trips.length ? (
            trips.map((trip) => (
                <AccountTripCard key={trip.tripId} trip={trip} />
            ))
          ) : (
            <p>No saved trips found.</p>
          )}
        </div>
      </div>
    );
  };