import { useEffect, useState } from "react";
import mockData from "../../../mockData/tripList.json";
import { GoogleMap,  LoadScriptNext,  Marker } from "@react-google-maps/api";
import { set } from "react-hook-form";
import { useAtom } from "jotai";
import { aiTripAtom } from "@/lib/aiTripAtom";
import number_2 from "../../../public/mapMarker/number_2.png";
import number_3 from "../../../public/mapMarker/number_3.png";
import number_4 from "../../../public/mapMarker/number_4.png";
import number_5 from "../../../public/mapMarker/number_5.png";
import number_6 from "../../../public/mapMarker/number_6.png";
import number_7 from "../../../public/mapMarker/number_7.png";
import number_8 from "../../../public/mapMarker/number_8.png";
import number_9 from "../../../public/mapMarker/number_9.png";
import number_10 from "../../../public/mapMarker/number_10.png";
import number_11 from "../../../public/mapMarker/number_11.png";
import number_12 from "../../../public/mapMarker/number_12.png";
import number_13 from "../../../public/mapMarker/number_13.png";
import number_14 from "../../../public/mapMarker/number_14.png";
import number_15 from "../../../public/mapMarker/number_15.png";
import number_16 from "../../../public/mapMarker/number_16.png";
import number_17 from "../../../public/mapMarker/number_17.png";
import number_18 from "../../../public/mapMarker/number_18.png";
import number_19 from "../../../public/mapMarker/number_19.png";
import number_20 from "../../../public/mapMarker/number_20.png";
import number_21 from "../../../public/mapMarker/number_21.png";
import number_22 from "../../../public/mapMarker/number_22.png";
import number_23 from "../../../public/mapMarker/number_23.png";
import number_24 from "../../../public/mapMarker/number_24.png";
import number_25 from "../../../public/mapMarker/number_25.png";
import number_26 from "../../../public/mapMarker/number_26.png";
import number_27 from "../../../public/mapMarker/number_27.png";
import number_28 from "../../../public/mapMarker/number_28.png";
import number_29 from "../../../public/mapMarker/number_29.png";
import number_30 from "../../../public/mapMarker/number_30.png";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MAP_MARKER_ICON = [
  "/mapMarker/number_1.png",
  "/mapMarker/number_2.png",
  "/mapMarker/number_3.png",
  "/mapMarker/number_4.png",
  "/mapMarker/number_5.png",
  "/mapMarker/number_6.png",
  "/mapMarker/number_7.png",
  "/mapMarker/number_8.png",
  "/mapMarker/number_9.png",
  "/mapMarker/number_10.png",
  "/mapMarker/number_11.png",
  "/mapMarker/number_12.png",
  "/mapMarker/number_13.png",
  "/mapMarker/number_14.png",
  "/mapMarker/number_15.png",
  "/mapMarker/number_16.png",
  "/mapMarker/number_17.png",
  "/mapMarker/number_18.png",
  "/mapMarker/number_19.png",
  "/mapMarker/number_20.png",
  "/mapMarker/number_21.png",
  "/mapMarker/number_22.png",
  "/mapMarker/number_23.png",
  "/mapMarker/number_24.png",
  "/mapMarker/number_25.png",
  "/mapMarker/number_26.png",
  "/mapMarker/number_27.png",
  "/mapMarker/number_28.png",
  "/mapMarker/number_29.png",
"/mapMarker/number_30.png"]

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
                icon={{
                  url: MAP_MARKER_ICON[index],
                  // size: new window.google.maps.Size(30, 40),
                  // scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            );
          })}
        </GoogleMap>
        </LoadScriptNext>
    </div>
  );
}
