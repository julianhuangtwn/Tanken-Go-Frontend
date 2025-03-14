import { useEffect, useState } from "react";
import mockData from "../../../mockData/tripList.json";
import { GoogleMap,  LoadScriptNext,  Marker } from "@react-google-maps/api";
import { set } from "react-hook-form";
import { useAtom } from "jotai";
import { aiTripAtom } from "@/lib/aiTripAtom";


const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function TripMap() {
  const [aiTrip, setAiTripAtom] = useAtom(aiTripAtom);
  

  console.log("trip in map",aiTrip)
  const center =
    aiTrip[0]?.latitude && aiTrip[0]?.longitude
      ? { lat: aiTrip[0].latitude, lng: aiTrip[0].longitude }
      : { lat: 0, lng: 0 };
  return (
    <div>
      <LoadScriptNext googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={{ width: "30vw", height: "80vh" }}
          center={center}
          zoom={12}
        >
          {aiTrip.map((aiTrip, index) => {
            return (
              <Marker
                key={index}
                position={{ lat: aiTrip.latitude, lng: aiTrip.longitude }}
              />
            );
          })}
        </GoogleMap>
        </LoadScriptNext>
    </div>
  );
}
