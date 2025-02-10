import React, { useEffect, useState } from "react";
import mockData from "../../mockData/tripList.json";

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

  return (
    <>
      <div
        style={{
          border: "1px solid black",
          margin: "20px",
          width: "50%",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flexDirection: "row",
            width: "100%",
            height: "12%",
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
          <>{data.map(data=>{
            return (
              <div
                style={{
                  // margin: "auto",
                  // padding: "20px",
                  // justifySelf: "center",
                  // alignSelf: "center",
                  display: "flex",
                  flexDirection: "row",
                  border: "1px solid black",
                  width: "90%",
                }}
              >
                  <h1>{data.name}</h1>
                  {/* <h2>{data.description}</h2>
                  <h2>{data.price}</h2> */}
              </div>
            );
          })}</>
        )}
      </div>
    </>
  );
}
