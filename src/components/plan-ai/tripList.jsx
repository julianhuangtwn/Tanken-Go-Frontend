import React, { useEffect, useState, useMemo } from "react";
import { ChevronRight, CircleMinus } from "lucide-react";
import { aiTripAtom } from "@/lib/aiTripAtom";
import { useAtom } from "jotai";


const IMAGE_WIDTH = 300;
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const imageApiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function TripList({ setIsMapOpen }) {
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen1] = useState(false);
  const [aiTrip, setAiTripAtom] = useAtom(aiTripAtom);

  useEffect(() => {
    const fetchData = async () => {
      let updatedTrips = [...aiTrip];
      let hasUpdates = false;

      // Create promises for missing images and coordinates
      const fetchPromises = aiTrip.map(async (trip, index) => {
        let updatedTrip = { ...trip };

        // Fetch image if missing
        if (!trip.imgUrl) {
          try {
            const response = await fetch(
              `${imageApiUrl}/v1/image?query=${encodeURIComponent(
                trip.name
              )}&orientation=landscape`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              updatedTrip.imgUrl = data.imageUrl;
              hasUpdates = true;
            }
          } catch (err) {
            console.error(`Error fetching image for ${trip.name}:`, err);
          }
        }

        // Fetch lat/long if missing
        if (!trip.lat || !trip.long) {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                trip.name
              )}&key=${apiKey}`
            );

            if (response.ok) {
              const data = await response.json();
              const lat = data.results[0]?.geometry?.location?.lat;
              const long = data.results[0]?.geometry?.location?.lng;

              if (lat && long) {
                updatedTrip.latitude = lat;
                updatedTrip.longitude = long;
                hasUpdates = true;
              }
            }
          } catch (err) {
            console.error(`Error fetching lat/long for ${trip.name}:`, err);
          }
        }

        updatedTrips[index] = updatedTrip;
      });

      await Promise.all(fetchPromises);

      // Update state only if data changed
      if (hasUpdates) {
        setAiTripAtom(updatedTrips);
      }
    };

    if (aiTrip.length > 0) {
      const lastTrip = aiTrip.length - 1;
      if (
        aiTrip[lastTrip].imgUrl &&
        aiTrip[lastTrip].latitude &&
        aiTrip[lastTrip].longitude
      ) {
        setLoading(false);
      } else {
        fetchData();
      }
    }
  }, [aiTrip, setAiTripAtom]);

  const groupByDate = (trips) => {
    return trips.reduce((acc, trip) => {
      // Check if the trip has a visit_date; use 'unknown date' as fallback
      const date = trip.visit_date || "unknown date";

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
      return !prev;
    });
    setIsMapOpen((prev) => !prev);
  };

  const handleOnDelete = (trip) => {
    console.log("aiTrip", aiTrip);
    console.log("Delete button clicked", trip);

    setAiTripAtom((prev) => {
      const newArray = prev.filter((item) => item.name !== trip.name);
      console.log(newArray);
      return newArray;
    });
  };

  // Save Trip
  const handleSaveTripBtn = async () => {
    console.log(aiTrip);
    // Dummy Data 
    const newTrip = {
      tripName: "New Trip",
      startDate: "2022-12-01",
      endDate: "2022-12-15",
      totalCostEstimate: 1000,
      isPublic: "N",
    };

    
    // try {
    //   const response = await fetch(NEXT_PUBLIC_API_URL + "/v1/trip", 
    //     { 
    //       method: "POST" ,
    //       headers: { 
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${getToken()}`
    //       }, 
    //       body: JSON.stringify(newTrip)
    //     });

    //   if (!response.ok) {
    //     console.error()
    //     return;
    //   }
    //   const data = await response.json();
    //   // setTrips([...trips, data.trip]);
      
      
    // } catch(error) {
    //   console.error(error.message);
    // }
  }


  const groupedTrips = useMemo(() => groupByDate(aiTrip), [aiTrip]);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "50%",
        maxHeight: "100vh",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
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

      <button
          className="bg-themePink rounded-lg"
          onClick={handleSaveTripBtn}
          style={{
            marginLeft: "auto",
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
         Save Trip
        </button>

      {!aiTrip[0]?.city ? (
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
              <div
                style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
                key={index}
              >
                {groupedTrips[date].map((trip, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "8px",
                      minWidth: "90%",
                      marginLeft: "30px",
                      flexDirection: "row",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <button onClick={()=>handleOnDelete(trip)}>
                      <CircleMinus />
                    </button>
                    <div style={{ flexDirection: "row", display: "flex" }}>
                      {/* Show image if fetched */}
                      {trip.imgUrl ? (
                        <img
                          src={trip.imgUrl}
                          alt={trip.name}
                          style={{
                            width: IMAGE_WIDTH,
                            height: "auto",
                            borderRadius: "5px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div>Loading image...</div> // Fallback UI while image is loading
                      )}
                      <h3 style={{ width: "100%" }}>{trip.id}. {trip.name}</h3>
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
