import { useEffect, useState } from "react";
import mockData from "../../../mockData/tripList.json";
import { GoogleMap,  Marker } from "@react-google-maps/api";
import { set } from "react-hook-form";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function TripMap() {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!data || data.length === 0) return; // Ensure data is available
    setLoading(true);
    const fetchCoordinates = async () => {
      try {
        const updatedData = await Promise.all(
          data.map(async (i) => {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                i.name
              )}&key=${apiKey}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch geocode data");
            }
            const result = await response.json();
            if (result.results.length > 0) {
              const { lat, lng } = result.results[0].geometry.location;
              return { ...i, latitude: lat, longitude: lng }; // Add latitude and longitude
            } else {
              console.log(`No results found for ${i.name}`);
              return { ...i, latitude: null, longitude: null }; // Handle cases with no results
            }
          })
        );
        // After fetching, set the updated data
        setData(updatedData);
      } catch (error) {
        console.error("Error fetching geocode data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinates();
  }, []); // Runs when `data` changes



  const center =
    data[0]?.latitude && data[0]?.longitude
      ? { lat: data[0].latitude, lng: data[0].longitude }
      : { lat: 0, lng: 0 };
  if (loading) return <p>Loading...</p>;
  return (
    <div>
        <GoogleMap
          mapContainerStyle={{ width: "30vw", height: "80vh" }}
          center={center}
          zoom={12}
        >
          {data.map((data) => {
            return (
              <Marker
                // key={data.id}
                position={{ lat: data.latitude, lng: data.longitude }}
              />
            );
          })}
        </GoogleMap>
    </div>
  );
}
