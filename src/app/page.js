"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../app/styles/home.css"; // if you need your custom styles
import { travel } from "../components/ui/fonts";

export default function Home() {
  const router = useRouter();

  // --- Added for "Start to Explore" ---
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We fetch the 3 most recent public trips, similar to your guide page
    const fetchTrips = async () => {
      try {
        const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/fetchPublicTrips`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });

        const data = await response.json();
        if (data?.status === "ok" && Array.isArray(data.data)) {
          setTrips(data.data.slice(0, 3));
        } else {
          setError("Unexpected API response.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch trips.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);
  // --- End "Start to Explore" additions ---

  return (
    <div>
      {/* Hero Section */}
      <div className="heroSection">
        <div className="overlay"></div>
        <Image
          src="/home.png"
          alt="Hero Background"
          fill
          quality={100}
          className="heroImage opacity-50 object-cover"
        />
        <div className="heroContent">
          <h1 className={`${travel.className} antialiased`}>Tanken-GO</h1>
          <p className="heroSubtitle">Explore more trips for your next trip idea!</p>
          <Link href="/explore">
            <button className="heroButton">Explore Trips</button>
          </Link>
        </div>
      </div>

      {/* Trip Planners Section */}
      <div className="tripPlannersSection">
        <h2 className="sectionTitle">Trip Planners</h2>
        <p className="sectionSubtitle">
          Explore inspiring travel plans created by fellow travelers. Discover new destinations, get ideas for your next
          adventure, and customize a plan that suits your style. Start your journey today!
        </p>
        <button className="viewPlansButton" onClick={() => router.push("/community")}>
          View all trip plans
        </button>
        
      </div>
      {/* ---------- “Start to Explore” section copied from guide/page.js ---------- */}
      <div className="explore-section bg-gray-200 text-white py-10 px-6 rounded-lg shadow-md text-center mt-12 max-w-3xl mx-auto mb-16">
        <h2 className="sectionTitle">Explore shared trips</h2>
        <p className="sectionSubtitle">
          Find the best travel experiences shared by our community and start planning your next adventure!
        </p>

        {loading && <p className="text-white mt-4">Loading trips...</p>}
        {error && <p className="text-red-300 mt-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {!loading && !error && trips.length > 0 ? (
            trips.map((trip) => (
              <div
                key={trip.tripId}
                className="bg-white text-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/community/${trip.tripId}`)}
              >
                <img
                  src={trip.imageUrl || "/default_trip.png"}
                  alt={trip.tripName}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{trip.tripName}</h3>
                  <p className="text-gray-600 text-sm">
                    🕒{" "}
                    {trip.startDate && trip.endDate
                      ? Math.ceil(
                          (new Date(trip.endDate) - new Date(trip.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )
                      : "N/A"}{" "}
                    Days
                  </p>
                  <p className="text-gray-700 font-semibold">
                    💰 ${trip.totalCostEstimate}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white mt-4">No trips available</p>
          )}
        </div>

        
      </div>
     
      {/* Traveler's Experiences Section */}
      <div className="travelersExperiences">
        <h2 className="sectionTitle">Traveler’s Experiences</h2>
        <p className="sectionSubtitle">Here are some awesome feedback from our travelers</p>
        <div className="experienceCard">
          <div className="profileImage">
            <Image
              src="/traveller.png"
              alt="Traveler"
              width={100}
              height={100}
              className="profileImg"
            />
          </div>
          
          <div className="feedbackContent">
            <p className="feedbackText">
              Using Tanken GO made planning my trip so much easier! The personalized itinerary suggestions and the
              user-friendly interface saved me a lot of time and stress.
            </p>
            <div className="feedbackRating">
              <span>⭐⭐⭐⭐⭐</span>
            </div>
            <p className="travelerName">John Doe</p>
          </div>
        </div>
      </div>


      {/* ---------- End “Start to Explore” Section ---------- */}
    </div>
  );
}
