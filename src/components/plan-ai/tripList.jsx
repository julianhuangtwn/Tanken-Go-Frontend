import React, { useEffect, useState, useMemo } from "react";
import { ChevronRight, CircleMinus } from "lucide-react";
import { aiTripAtom } from "@/lib/aiTripAtom";
import { useAtom } from "jotai";

const IMAGE_WIDTH = 300;

export default function TripList({setIsMapOpen}) {
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen1] = useState(false);
  const [aiTrip, setAiTripAtom] = useAtom(aiTripAtom);


  useEffect(() => {
    const fetchImagesSequentially = async () => {
      const updatedTrips = [...aiTrip]; // Create a copy to hold updates
      let imagesFetched = false;

      for (const trip of aiTrip) {
        if (!trip.imgUrl) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/image?query=${encodeURIComponent(trip.name)}&orientation=landscape`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const imageUrl = data.imageUrl;

              // Update the trip in the copy of aiTrip
              const tripIndex = updatedTrips.findIndex((t) => t.name === trip.name);
              if (tripIndex !== -1) {
                updatedTrips[tripIndex] = { ...updatedTrips[tripIndex], imgUrl: imageUrl };
              }
              imagesFetched = true;
            }
          } catch (err) {
            console.error("Error fetching image:", err);
          }
        }
      }

      // After fetching images, update the state only if images were fetched
      if (imagesFetched) {
        setAiTripAtom(updatedTrips);
      }
    };

    // Run fetch only if aiTrip has not been updated already
    if (aiTrip.length > 0) {
      fetchImagesSequentially();
    }
  }, [aiTrip, setAiTripAtom]); // Only runs when aiTrip changes
  

  const groupByDate = (trips) => {
    console.log ("trips ",trips);
    return trips.reduce((acc, trip) => {
      console.log("date"  , trip.visit_date);
      // Check if the trip has a visit_date; use 'unknown date' as fallback
      const date = trip.visit_date || 'unknown date';
  
      // If the date doesn't exist in the accumulator, create an empty array
      if (!acc[date]) acc[date] = [];
  
      // Push the trip to the corresponding date array
      acc[date].push(trip);
  
      // Return the updated accumulator
      return acc;
    }, {}); // Initial value of acc is an empty object {}
  };

  const handleMapBtn = () => {
    setIsMapOpen1((prev) => {
      console.log(!prev);
      return !prev
    });
    setIsMapOpen((prev) => !prev);
  }

  const groupedTrips = useMemo(() => groupByDate(aiTrip), [aiTrip]);

  if(loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "50%",
        maxHeight: "100vh",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        overflowY: 'scroll'
      }}
    >
      <div
        style={{
          flexDirection: "row",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ marginLeft: "20px" }}>
          <h1>Your Trip</h1>
          <h2>Total Budget: $$$ ~ $$$</h2>
        </div>
        <button
          className="bg-themePink rounded-lg"
          onClick={handleMapBtn}
          style={{
            marginLeft: "auto",
            marginRight: "20px",
            color: "white",
            padding: "20px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginRight: "50px",
          }}
        >
          View Map
        </button>
      </div>

      {aiTrip.length === 1 && !aiTrip[0].city ? (
        <div
          style={{
            margin: "auto",
            padding: "20px",
            justifySelf: "center",
            alignSelf: "center",
            display: "flex",
          }}
        >
          Nothing here yet! Talk to the AI on the left to add destinations
        </div>
      ) : (
        <>
          {Object.keys(groupedTrips).map((date, index) => (
            <div key={date}>
              <div
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <ChevronRight />
                <h2>{date}</h2>
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }} key={index}>
                {groupedTrips[date].map((trip) => (
                  <div
                    key={trip.id}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "8px",
                      minWidth: "90%",
                      marginLeft: "30px",
                      flexDirection: "row",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center"
                    }}
                  >
                    <CircleMinus />
                    <div style={{ flexDirection: "row", display: "flex" }}>
                      {/* Show image if fetched */}
                      {trip.imgUrl ? (
                        <img
                          src={trip.imgUrl}
                          alt={trip.name}
                          style={{ width: IMAGE_WIDTH, height:"auto", borderRadius: "5px", objectFit: "contain" }}
                          
                        />
                      ) : (
                        <div>Loading image...</div> // Fallback UI while image is loading
                      )}
                      <h3 style={{ width: "100%" }}>{trip.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}