"use client";
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
        const response = await fetch(`http://localhost:8080/api/trips/public/${tripId}`);
        const result = await response.json();
        const tripData = result.data?.[0] ?? result.data?.data?.[0];

        if (result?.status === 'ok' && tripData) {
          const duration = tripData.endDate && tripData.startDate
            ? Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24))
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

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
      <Image src="/trip-banner.jpg" alt="Trip Banner" width={800} height={250} className="object-cover rounded-xl mb-6" />
      <h1 className="text-5xl font-extrabold text-center mb-4 text-indigo-600">{trip.tripName}</h1>
      <p className="text-center text-lg mb-6 font-medium text-gray-700">💰 ${trip.totalCostEstimate} | 🕒 {trip.duration} Days | 👤 {trip.username}</p>

      <div className="bg-gray-100 rounded-lg p-5 border border-gray-300">
        <h2 className="text-3xl font-bold mb-4 text-indigo-500">🗺️ Itinerary</h2>
        {Object.keys(trip.destinationsByDay).length > 0 ? (
          Object.entries(trip.destinationsByDay).map(([date, destinations], idx) => (
            <div key={idx} className="mb-6 bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">📅 Day {idx + 1} - {new Date(date).toLocaleDateString()}</h3>
              {destinations.map((dest, i) => (
                <div key={i} className="p-4 mb-3 border-l-4 border-indigo-300 bg-indigo-50 rounded-lg">
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
  );
}
=======
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommentSection from "@/components/CommentSection";

export default function CommunityPage() {
    const { tripId } = useParams();

    if (!tripId) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className="flex flex-col items-center text-center">
            <h4 className="text-3xl font-bold mb-4">Comments</h4>
            </div>
            <CommentSection tripId={tripId} />
        </div>
    );
}

