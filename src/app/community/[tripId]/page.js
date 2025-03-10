"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import Image from 'next/image';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    if (!tripId) {
      setStatus({ loading: false, error: 'Trip ID missing from URL.' });
      return;
    }

    (async () => {
      try {
        const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;    
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/v1/trips/public/${tripId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        });
        
        const result = await response.json();
        const tripData = result.data?.[0] ?? result.data?.data?.[0];

        if (result?.status === 'ok' && tripData) {
          const duration = tripData.endDate && tripData.startDate
            ? Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1
            : 0;

          setTrip({
            ...tripData,
            duration,
            username: tripData.username || 'Anonymous',
            destinationsByDay: tripData.destinationsByDay || {},
          });
        }
      } catch (error) {
        setStatus({ loading: false, error: 'Failed to load trip details. Please try again later.' });
      } finally {
        setStatus({ loading: false });
      }
    })();
  }, [tripId]);

  if (status.loading) return <div className="text-center text-lg font-semibold animate-pulse">Loading...</div>;
  if (status.error) return <div className="text-center text-red-500 font-bold">{status.error}</div>;
  if (!trip) return <div className="text-center text-gray-500 italic">No trip information available.</div>;

  return ( <>
    <div className="max-w-5xl mx-auto p-10 bg-gray-50 rounded-xl shadow-2xl border">
      <Image src="/trip-banner.jpg" alt="Trip Banner" width={800} height={300} className="object-cover rounded-xl mb-6" />
      <h1 className="text-6xl font-bold text-center mb-5 text-indigo-700">{trip.tripName}</h1>
      <p className="text-center text-xl mb-6 font-medium text-gray-800">💰 ${trip.totalCostEstimate} | 🕒 {trip.duration} Days | 👤 {trip.username}</p>
      
      <div className="flex justify-center gap-4 text-lg font-semibold text-gray-700 mb-4">
       <div className="text-center">🏛️ {trip.attractionCount} <div className="text-sm text-gray-500">Attractions</div></div>
       <div className="text-center">🍽️ {trip.restaurantCount} <div className="text-sm text-gray-500">Restaurants</div></div>
       <div className="text-center">🏨 {trip.hotelCount} <div className="text-sm text-gray-500">Hotels</div></div>
      </div>


      <div className="bg-white rounded-lg p-6 border border-gray-300">
        <h2 className="text-3xl font-bold mb-5 text-indigo-600">🗺️ Itinerary</h2>
        {Object.keys(trip.destinationsByDay).length > 0 ? (
          Object.entries(trip.destinationsByDay).map(([date, destinations], idx) => (
            <div key={idx} className="mb-6 bg-indigo-50 shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-indigo-800">📅 Day {idx + 1} - {new Date(date).toLocaleDateString()}</h3>
              {destinations.map((dest, i) => (
                <div key={i} className="p-3 mb-2 border-l-4 border-indigo-400 bg-white rounded-lg">
                  <h4 className="font-bold text-indigo-700">{dest.destinationName}</h4>
                  <p className="text-sm text-gray-600">📍 {dest.city}, {dest.country}</p>
                  <p className="text-xs text-gray-500">🏷️ {dest.category}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">No destinations listed for this trip.</p>
        )}
      </div>
    </div>

    <div className="mt-10 text-center">
    <h4 className="text-4xl font-bold mb-6 text-indigo-700">💬 Comments</h4>
    <CommentSection tripId={tripId} />
    </div>
    </>
  );
}