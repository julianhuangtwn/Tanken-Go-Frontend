// app/guide  /page.js

"use client"; 
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "../styles/guide.css";

export default function Page() {

  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prompts = [
    "Can you plan a trip to Montreal, Canada for 4 days, including hotel, restaurants, and with a focus on museums and historic places?",
    "What places can you recommend for me to visit in July 2025 in New York?",
    "Please plan a trip from April 29, 2025, for 10 days to Italy. My budget is $5000, and I would like to focus on fine dining and museums.",
    "I don’t like crowded places, any suggestions for Tokyo?",
    "What can I do for a 10-hour layover in London?",
  ];

  const [visiblePrompts, setVisiblePrompts] = useState([prompts[0]]); 
  const [openIndex, setOpenIndex] = useState([]); 
  const toggleFAQ = (index) => {
    setOpenIndex((prev) => 
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  useEffect(() => {
    prompts.slice(1).forEach((prompt, i) => {
      setTimeout(() => {
        setVisiblePrompts((prev) => {
          if (!prev.includes(prompt)) { 
            return [...prev, prompt];
          }
          return prev;
        });
      }, (i + 1) * 1000); 
    });
  }, []);
  
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
  const lightenColor = (hex, percent) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, r + (255 - r) * (percent / 100));
    g = Math.min(255, g + (255 - g) * (percent / 100));
    b = Math.min(255, b + (255 - b) * (percent / 100));

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  const faqItems = [
    {
      question: "How can I plan and customize my trip?",
      answer: (
        <div>
          <h3 className="exampleHeader"><strong>Our AI assistant helps you plan personalized trips based on your preferences:</strong></h3><br />

          <ul className="list">
            <li>Go to <strong>"Explore Trips"</strong></li>
            <li>Click on <strong>"Ask AI"</strong> button</li>
            <li>Type and send your message</li>
          </ul>

         
          <div className="promptContainer">
          <motion.div 
  className="promptContainer"
  initial={{ height: "auto" }}
  animate={{ height: visiblePrompts.length * 85 + "px" }}   
  transition={{ duration: 0.5 }}
>
  {visiblePrompts.map((prompt, index) => (
    <motion.div
      key={`prompt-${index}`}
      className="prompt-box"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 10, duration: 0.8, delay: index * 0.3 }}
    >
      {prompt}
    </motion.div>
  ))}
</motion.div>

          </div>
          <h3 className="exampleHeader"><strong>Once the AI generates your trip:</strong></h3><br />
          <ul className="list">
            <li><strong>Itinerary Display</strong> <br />Your itinerary will be organized by day, with locations and descriptions</li>
            <li><strong>Image Previews</strong>  <br /> Each recommended location will be displayed with an image for easy identification</li>
            <li><strong>View on Map</strong>  <br /> Click the <strong>"View Map"</strong> button to see all your planned destinations pinned on an interactive map</li>
          </ul>
          <br />
          <h3 className="exampleHeader"><strong>Exploring & Customizing Your Trip:</strong></h3> <br/>
          <ul className="list">
            <li>Add or remove suggested locations from your itinerary</li>
            <li>Adjust your trip length, budget, and activity preferences</li>
            <li>Save your trip plan and revisit it later</li>
          </ul>
        </div>
      ),
      color: "#d6336c"
    },
    {
      question: "Where can I find my trips?",
      answer: (
        
        <ul className="list">
          <li>Navigate to the <strong>"Accont"</strong> Tab</li>
          <li>Click <strong>"My Trips"</strong> menu option</li>
          <li>Now you can explore and manage the trips you have created!</li>
      </ul>
      ),
       color: "#d6336c"
    },
    {
      question: "Where can I see trips of other users?",
      answer: (
        <div>
          <ul className="list">
            <li >
            The <strong>"Community"</strong> Tab allows you to view and interact with trips planned by other users</li>
            <li>Browse itineraries created by other users and get inspiration for your next adventure</li>
            <li>View detailed feedback and ratings left by users who have experienced these trips</li>
            <li>Access the comment section to read reviews from travelers</li>
            <li>Save trips created by TankenGO users</li>
          </ul>
        </div>
      ),
       color: "#d6336c"
    },
    {
      question: "Where can I change my account settings?",
      answer: (
        <div >
        <ul className="list">
          <li>The <strong>"Account"</strong> Tab allows you to manage your account</li>
          <li>Update your profile information</li>
          <li>Change your password</li>
          <li>Manage your past and upcoming trips</li>
          <li>Publish your trips</li>
        </ul>
        </div>
      ),
       color: "#d6336c"
    },
    {
      question: "How can I share my trip with the community?",
      answer: (
        <div>
          <ul className="list">
            <li>Navigate to the <strong>"Account"</strong> Tab</li>
            <li>Click <strong>"My Trips"</strong> in the menu</li>
            <li>Select an itinerary by clicking on it</li>
            <li>Click the <strong>"Post"</strong> button</li>
            <li>Your trip is now published and ready to receive feedback!</li>
          </ul>
        </div>
      ),
       color: "#d6336c"
    }
  ];

  return (
    <>
      <div className="hero">
        <img src="/beach.png" alt="Tanken-GO Guide" className="hero-image" />
        <div className="hero-text">
          <h1 className="title1">Guide</h1>
          <h1 className="title2">Tanken-GO</h1>
          <p className="subtitle1">Welcome to Tanken-GO Guide! Your planning companion instructions.</p>
        </div>
      </div>

      <div className="about-us">
        <h2 className="about-title">About Us</h2>
        <p className="about-text">
          TankenGO is designed to help you organize your trip using AI, based on your preferences, chosen destination, budget, and vacation style.
          With TankenGO, you can easily plan your trip and fill each day of your vacation with exciting experiences!
          You can also share your trip plan with the TankenGO community.
        </p>
        <p className="about-text1">
          This guide will help you navigate the website and provide information about our features.
        </p>
      </div>
      
      <div className="faq-container">
        {faqItems.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex.includes(index) ? "open" : ""}`} style={{ backgroundColor: item.color }}>
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {item.question}
              <span className="faq-arrow">{openIndex.includes(index) ? "▲" : "▼"}</span>
            </button>
            {openIndex.includes(index) && (
              <div className="faq-answer" style={{ backgroundColor: lightenColor(item.color, 60), color: "#333" }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="explore-section bg-gray-200 text-white py-10 px-6 rounded-lg shadow-md text-center mt-12 max-w-3xl mx-auto mb-16">
        <h2 className="about-title">Start to Explore</h2>
        <p className="about-text">
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
                  src={`https://source.unsplash.com/400x300/?travel,${trip.tripId}`} 
                  alt={trip.tripName} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{trip.tripName}</h3>
                  <p className="text-gray-600 text-sm">
                    🕒 {trip.startDate && trip.endDate ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) : "N/A"} Days
                  </p>
                  <p className="text-gray-700 font-semibold">💰 ${trip.totalCostEstimate}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white mt-4">No trips available</p>
          )}
        </div>

        <div className="explore-section">
          <button
            className="explore-button"
            onClick={() => router.push("/community")}
          >
            Explore Now
          </button>
        </div>
      </div>
    </>
  );
}
