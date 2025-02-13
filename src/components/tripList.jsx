import React, { useEffect, useState, useMemo } from "react";
import mockData from "../../mockData/tripList.json";
import { ChevronRight, CircleMinus } from "lucide-react";

export default function TripList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    //fetch data from backend
    setData(mockData);
  }, []);

  useEffect(() => {
    //fetch data from backend
    console.log(data);
  }, [data]);

  const groupByDate = (trips) => {
    return trips.reduce((acc, trip) => {
      if (!acc[trip.date]) acc[trip.date] = []; // If date doesn't exist, create an empty array
      acc[trip.date].push(trip); // Add the trip to the corresponding date array
      return acc; // Return the updated accumulator
    }, {}); // Initial value of acc is an empty object {}
  };

  const groupedTrips = useMemo(() => groupByDate(data), [data]);

  return (
    <>
      <div
        style={{
          border: "1px solid black",
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
          <div style={{ marginLeft: "20px", border: "solid black 2px" }}>
            <h1>Your Trip</h1>
            <h2>Total Budget: $$$ ~ $$$</h2>
          </div>
          <button
            className="bg-themePink rounded-lg"
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

        {!data ? (
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
                <div style={{ marginLeft: "20px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <ChevronRight />
                  <h2>{date}</h2>
                </div>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
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
                        alignItems:"center"
                      }}
                    >
                      <CircleMinus />
                      <div style={{flexDirection:"row", display:"flex"}}>
                        <img
                        src={trip.imageUrl}
                        alt={trip.name}
                        style={{ width: "100%", borderRadius: "5px" }}
                      />
                        <h3 style={{width:"100%"}}>{trip.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </>
        )}
      </div>
    </>
  );
}
