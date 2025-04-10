"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import Image from 'next/image';

{/* Button for share CODE*/}
import { LoadScriptNext, GoogleMap, Marker } from "@react-google-maps/api";

const ShareModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [currentURL, setCurrentURL] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentURL(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000); 
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Share this trip!</h2>
        <div className="share-buttons-container">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentURL}`} target="_blank" rel="noopener noreferrer">
            <Image src="/facebook.png" alt="Facebook" width="40" height="40" />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${currentURL}`} target="_blank" rel="noopener noreferrer">
            <Image src="/twitter.png" alt="Twitter" width="40" height="40" />
          </a>
          <a href={`https://api.whatsapp.com/send?text=${currentURL}`} target="_blank" rel="noopener noreferrer">
            <Image src="/whatsapp.png" alt="WhatsApp" width="40" height="40" />
          </a>
          <a href={`mailto:?subject=Check this out!&body=${currentURL}`} target="_blank" rel="noopener noreferrer">
            <Image src="/gmail.png" alt="Gmail" width="40" height="40" />
          </a>
        </div>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "✅ Copied!" : "📋 Copy Link"}
        </button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
{/* Button for share CODE END*/}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


const TripDetailPage = () => {

  {/* Button for share CODE*/}
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  
  const handleShareClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [tripRaw, setTripRaw] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [status, setStatus] = useState({ loading: true, error: null });

  const [currency, setCurrency] = useState("CAD");  // Default currency
  const [exchangeRates, setExchangeRates] = useState({ CAD: 1 });

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_EXCHANGE_RATE_API);
        const data = await res.json();
        setExchangeRates(data.conversion_rates);
      } catch (err) {
        console.error("Failed to fetch exchange rates:", err);
      }
    };
    fetchExchangeRates();
  }, []);

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
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        const result = await response.json();
        const tripData = result.data?.[0] ?? result.data?.data?.[0];

        if (result?.status === 'ok' && tripData) {
          const duration = tripData.endDate && tripData.startDate
            ? Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1
            : 0;


          setTripRaw(()=>({
            ...tripData,
            duration,
            username: tripData.username || 'Anonymous',
            destinationsByDay: tripData.destinationsByDay || {},
          }));

          const groupByDate = (trips) => {
            return trips.reduce((acc, trip) => {
              // Check if the trip has a visit_date; use 'unknown date' as fallback
              const date = trip.visitDate || "unknown date";
        
              // If the date doesn't exist in the accumulator, create an empty array
              if (!acc[date]) acc[date] = [];
        
              // Push the trip to the corresponding date array
              acc[date].push(trip);
        
              // Return the updated accumulator
              return acc;
            }, {}); // Initial value of acc is an empty object {}
          };

          let sortByDate = groupByDate(tripData.destinationsByDay)

          setTrip({
            ...tripData,
            duration,
            username: tripData.username || 'Anonymous',
            destinationsByDay: sortByDate,
          })


        }
      } catch (error) {
        setStatus({ loading: false, error: 'Failed to load trip details. Please try again later.' });
      } finally {
        setStatus({ loading: false });

      }
    })();
  }, [tripId]);

  useEffect(() => {
    if (tripRaw?.destinationsByDay && tripRaw.destinationsByDay.length > 0) {
      setMapCenter({
        lat: tripRaw.destinationsByDay[0].latitude,
        lng: tripRaw.destinationsByDay[0].longitude
      });
    }
  }, [tripRaw]); // This effect runs whenever tripRaw changes

  if (status.loading) return <div className="text-center text-lg font-semibold animate-pulse">Loading...</div>;
  if (status.error) return <div className="text-center text-red-500 font-bold">{status.error}</div>;
  if (!trip) return <div className="text-center text-gray-500 italic">No trip information available.</div>;

  console.log(tripRaw)

  return (
    <div className="min-h-screen bg-white py-12">
            <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{trip.tripName}</h1>
          <p className="text-sm text-gray-500 mb-1">📅 {trip.startDate} - {trip.endDate}</p>
          <p className="text-sm text-gray-500">Curated by <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">{trip.username}</span></p>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-gray-800">
                {currency} {Math.round(trip.totalCostEstimate * (exchangeRates[currency] || 1))}
              </p>
              <p className="text-xs text-gray-500 mt-1">💰 Total Cost</p>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-2 px-2 py-1 text-sm border border-gray-300 rounded-full focus:ring-1 focus:ring-indigo-500"
              >
                {Object.keys(exchangeRates).map((cur) => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{trip.duration} Days</p>
            <p className="text-xs text-gray-500 mt-1">🕒 Duration</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{trip.username}</p>
            <p className="text-xs text-gray-500 mt-1">👤 Traveler</p>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">✨ Itinerary</h2>
          {Object.entries(trip.destinationsByDay).map(([date, destinations], idx) => (
            <div key={idx} className="mb-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📅 Day {idx + 1} - {date}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destinations.map((dest, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={dest.imgUrl || "/default_trip.png"}
                        alt={dest.destinationName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-lg font-bold text-indigo-700 hover:underline">
                        <a
                          href={`https://www.google.com/maps?q=${dest.latitude},${dest.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {dest.destinationName}
                        </a>
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{dest.description}</p>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        📍 <span>{dest.city}, {dest.country}</span>
                      </div>
                      <div className="text-xs mt-1">
                        🏷️ <span className={`inline-block px-2 py-0.5 rounded-full text-white text-xs
                            ${
                              {
                                'Historical Site': 'bg-blue-600',
                                'Historical': 'bg-blue-600',
                                'Landmark': 'bg-yellow-600',
                                'Cultural Landmark': 'bg-yellow-500',
                                'Cultural': 'bg-yellow-500',
                                'Leisure': 'bg-pink-400',
                                'Local Activity': 'bg-orange-400',
                                'Market': 'bg-red-500',
                                'Museum': 'bg-indigo-600',
                                'Shopping': 'bg-pink-500',
                                'Sightseeing': 'bg-teal-600',
                                'Theme Park': 'bg-purple-500',
                                'Attraction': 'bg-green-500',
                                'attraction': 'bg-green-500',
                                'Restaurant': 'bg-red-400',
                                'restaurant': 'bg-red-400',
                                'hotel': 'bg-blue-500'
                              }[dest.category] || 'bg-gray-400'
                            }
                          `}>
                          {dest.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/*google map*/}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">🗺️ Map</h2>
            <LoadScriptNext googleMapsApiKey={apiKey}>
              <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "40vh" }}
                        center={mapCenter}
                        zoom={12}
                        options={{
                          styles: [
                            {
                              featureType: "poi", // Hide all points of interest
                              elementType: "labels",
                              stylers: [{ visibility: "off" }]
                            },
                            {
                              featureType: "poi.business", // Hide business labels
                              elementType: "labels",
                              stylers: [{ visibility: "off" }]
                            },
                            {
                              featureType: "poi.park", // Hide park labels
                              elementType: "labels",
                              stylers: [{ visibility: "off" }]
                            },
                          ],
                        }}
                        >
{tripRaw.destinationsByDay.map((data, index) => {
            const lat = parseFloat(data.latitude);
            const long = parseFloat(data.longitude);

            console.log("data", data)

            if (isNaN(lat) || isNaN(long)) {
              console.log("Invalid coordinates for trip:");
              console.log(data);
              return null;
            }
            return (
              <Marker
                key={index}
                position={{ lat: lat, lng: long }}
                title={data.destinationName}
                label={{
                  text: data.destinationName, // Display location name
                  color: "#5C4033", // Change text color
                  fontSize: "14px", // Change font size
                  fontWeight: "bold", // Make text bold
                }}
                
              />
            );
          })}
              </GoogleMap>
            </LoadScriptNext>
          </div>

            {/* Button for share CODE*/}
          <div className="sharebtn mt-10 flex flex-col items-center" onClick={handleShareClick} style={{ cursor: 'pointer' }}>
            <Image 
              src="/heart.png"
              alt="Share" 
              width={50} 
              height={50} 
              className={copied ? "bumping-heart" : ""} 
            />
            <span className="mt-2 font-medium text-indigo-600">{copied ? 'Link is ready' : 'Share this trip!'}</span>
          </div>
          <ShareModal isOpen={modalOpen} onClose={handleCloseModal} />
        </div>
            
        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>
          <CommentSection tripId={tripId} />
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
