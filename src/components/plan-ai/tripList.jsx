import React, { useEffect, useState, useMemo } from "react";
import { ChevronRight, CircleMinus } from "lucide-react";
import { aiTripAtom } from "@/lib/aiTripAtom";
import { useAtom } from "jotai";
import { getToken } from "@/lib/authenticate";
import { toast } from "sonner"

import Image from "next/image";

import { useRouter } from 'next/navigation'


import { SaveTripBtn } from "@/components/SaveTripBtn";

const IMAGE_WIDTH = 300;
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const imageApiUrl = process.env.NEXT_PUBLIC_API_URL;
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function TripList({ setIsMapOpen, myTrip }) {
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen1] = useState(false);
  const [aiTrip, setAiTripAtom] = useAtom(aiTripAtom);

  const router = useRouter();

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
    setAiTripAtom((prev) => {
      const newArray = prev.filter((item) => item.name !== trip.name);
      return newArray;
    });
  };

  // Save Trip
  const handleSaveTripBtn = async (isPublic) => {
    const timeString = 'T00:00:00'
    const lastTrip = aiTrip.length - 1;

    let minDate = new Date(aiTrip[0].visit_date + timeString) //convert from string to timestamp
    let maxDate = new Date(aiTrip[lastTrip].visit_date + timeString) //convert from string to timestamp

    aiTrip.forEach((trip) => {
      let currDate = new Date(trip.visit_date + timeString)
      minDate = Math.min(currDate, minDate)
      maxDate = Math.max(currDate, maxDate)
    });

    minDate = new Date(minDate); // convert to Date object
    maxDate = new Date(maxDate); // convert to Date object


    // Format date to YYYY-MM-DD
    const formattedDateMin = minDate.toISOString().split('T')[0];
    const formattedDateMax = maxDate.toISOString().split('T')[0];

    myTrip.startDate = formattedDateMin;
    myTrip.endDate = formattedDateMax;


    console.log(myTrip.startDate, myTrip.endDate)
    
    const newTrip = {
      tripName: myTrip.tripName,
      startDate: myTrip.startDate,
      endDate: myTrip.endDate,
      totalCostEstimate: myTrip.totalCostEstimate,
      isPublic: isPublic?'Y':'N',
      destinations: aiTrip
    };

    try {
      console.log(myTrip)
      const response = await fetch(publicApiUrl + "/v1/trip", 
        { 
          method: "POST" ,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
          }, 
          body: JSON.stringify(newTrip)
        });

      if (!response.ok) {
        console.error()
        return;
      }

      toast("✅ Trip saved!")
      // Redirect to saved trips page
      router.push("/account/saved-trips");

      
    } catch(error) {
      console.error(error.message);
    }
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
          <h1 className="text-3xl font-bold font-sans mt-4">{myTrip ? myTrip.tripName : "Your Trip"}</h1>
          <h2 className="mt-4">{myTrip ? "Total Estimated Cost: $" + myTrip.totalCostEstimate : "Total Estimated Cost"}</h2>
        </div>

        <button
          className="bg-themePink rounded-lg px-4 py-2"
          onClick={handleMapBtn}
          style={{
            marginLeft: "auto",
            marginRight: "20px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginRight: "50px",
            fontSize: "14px",
          }}
        >
          View Map
        </button>
      </div>

      {aiTrip[0]?.city ? (
      // <button
      //     className="bg-themePink rounded-lg"
      //     onClick={handleSaveTripBtn}
      //     style={{
      //       marginLeft: "auto",
      //       color: "white",
      //       padding: "20px",
      //       height: "30px",
      //       display: "flex",
      //       alignItems: "center",
      //       justifyContent: "center",
      //       alignSelf: "center",
      //       marginRight: "50px",
      //     }}
      //   >
      //    Save Trip
      //   </button>
        <div style={{ 
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: "50px",

        }}>
          <SaveTripBtn handleSaveTripBtn={handleSaveTripBtn} />
        </div>
      ) : null
      }

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
                <h2 className="text-lg font-bold">{date}</h2>
              </div>
              <div
                style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
                key={index}
              >
                {groupedTrips[date].map((trip, index) => (
                  <div key={index} className="flex flex-row ml-8 w-full">
                    <h3 className='flex text-lg justify-center items-center' style={{ width: "2ch", minWidth: "2ch"}}>{trip.id}.</h3>
                    <div
                      key={index}
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "8px",
                        minWidth: "90%",
                        marginLeft : "10px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <button className="flex items-center" onClick={()=>handleOnDelete(trip)}>
                        <CircleMinus />
                      </button>
                      <div style={{ flexDirection: "row", display: "flex" }}>
                        {/* Show image if fetched */}
                        <div style={{ position: "relative", width: "150px", height: "100px", overflow: "hidden", flexShrink: 0  }}>
                          {trip.imgUrl ? (
                            <Image 
                              fill
                              src={trip.imgUrl}
                              alt={trip.name}
                              style={{
                                objectFit: "cover",
                              }}
                              className={'rounded-lg'}
                            />   
                          ) : (
                            <div>Loading image...</div> // Fallback UI while image is loading
                          )}
                        </div>
                        <h3 className="flex text-xl ml-4 justify-center items-center">{trip.name}</h3>
                      </div>
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
