"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import Image from 'next/image';

{/* Button for share CODE*/}
import heartIcon from '../../../../public/heart.png'; 

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
 {/* Button for share CODE END*/}
 
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
            "Authorization": `Bearer ${localStorage.getItem("token")}`
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

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{trip.tripName}</h1>
          <p className="text-sm text-gray-600">Curated by <span className="font-semibold text-indigo-600">{trip.username}</span></p>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">${trip.totalCostEstimate}</p>
            <p className="text-xs text-gray-500">💰 Total Cost</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">{trip.duration} Days</p>
            <p className="text-xs text-gray-500">🕒 Duration</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">{trip.username}</p>
            <p className="text-xs text-gray-500">👤 Traveler</p>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✨Itinerary</h2>
          {Object.entries(trip.destinationsByDay).map(([date, destinations], idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📅 Day {idx + 1} - {date}</h3>
              <div className="grid grid-cols-2 gap-4">
                {destinations.map((dest, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-indigo-700">
                     <a href={`https://www.google.com/maps?q=${dest.coordinates}`} target="_blank" rel="noopener noreferrer">{dest.destinationName}</a>
                    </h4>
                    <p className="text-xs text-gray-500">📍 {dest.city}, {dest.country}</p>
                    <p className="text-xs text-gray-500 mt-1">🏷️ {dest.category}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Button for share CODE*/}
        <div className="sharebtn" onClick={handleShareClick} style={{ cursor: 'pointer' }}>
                  <Image 
                    src={heartIcon} 
                    alt="Share" 
                    width={50} 
                    height={50} 
                    className={copied ? "bumping-heart" : ""} 
                  />
                  <span>{copied ? 'Link is ready' : 'Share this trip!'}</span>
                </div>
                <ShareModal isOpen={modalOpen} onClose={handleCloseModal} />
          {/* Button for share CODE END*/}
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