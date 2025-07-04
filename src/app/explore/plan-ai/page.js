"use client";

import TripList from "@/components/plan-ai/tripList";
import Image from "next/image";
import AiResponse from "@/components/plan-ai/AiResponse";
import { useState, useEffect, useRef } from "react";
import TripMap from "@/components/plan-ai/tripMap";
import { LoadScript } from "@react-google-maps/api";
import { aiTripAtom } from "@/lib/aiTripAtom";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { getToken } from "@/lib/authenticate";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function Page() {
  //Messages are stored in arrays and only rerender when new messages are added
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageAreaRef = useRef(null);
  const [token, setToken] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [containerHeight, setContainerHeight] = useState("calc(100vh - 64px)");

  // Destinations Generated from AI

  const [aiTrip, setAiTripAtom] = useAtom(aiTripAtom);

  // My Trip Generated from AI
  const [myTrip, setMyTrip] = useState(null);

  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  useEffect(() => {
    // Clear the aiTripAtom on first page load
    setAiTripAtom([]);

    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, [setAiTripAtom]);

  // Dynamically calculate the navbar height to fit chatbox into viewport
  useEffect(() => {
    const updateHeight = () => {
      const navbar = document.querySelector("nav"); // adjust selector to match your navbar
      if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        setContainerHeight(`calc(100vh - ${navbarHeight}px)`);
      }
    };

    // Initial calculation
    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  });

  // For edit trip, the tripId will be passed in the url as a query (/explore/plan-ai?tripId=127)
  useEffect(() => {
    if (tripId) {
      const fetchTripData = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/trips/public/${tripId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const tripData = data.data.data[0];

            setMyTrip(tripData);

            // Restructure the fetched data JSON
            const cleanedTripResponse = {
              trip: {
                tripName: tripData.tripName,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
                totalCostEstimate: tripData.totalCostEstimate,
                isPublic: tripData.isPublic,
                destinations: [],
              },
              message:
                "How would you like to edit this trip? Here is the current trip: ",
              isTripGenerated: true,
            };

            // Add destinations from tripData
            tripData.destinationsByDay.forEach((destination) => {
              cleanedTripResponse.trip.destinations.push({
                name: destination.destinationName,
                description: destination.description,
                city: destination.city,
                country: destination.country,
                coordinates: destination.coordinates,
                category: destination.category,
                visit_date: destination.visitDate,
              });
            });

            setAiTripAtom(() => {
              cleanedTripResponse.trip.destinations.forEach(
                (destination, index) => {
                  destination.id = index + 1;
                }
              );

              console.log(cleanedTripResponse);

              return cleanedTripResponse.trip.destinations;
            });

            // Return the cleaned-up response
            const aiMessage = {
              id: messages.length + 1,
              role: "assistant",
              content: cleanedTripResponse, // Set fetched trip data as the assistant's message
            };
            setMessages([aiMessage]);
          } else {
            console.error("Failed to fetch trip data");
          }
        } catch (error) {
          console.error("Error fetching trip data:", error);
        }
        setLoading(false);
      };

      fetchTripData();
    }
  }, [tripId, token]);

  // Effect to handle API call when new user message is added
  useEffect(() => {
    //Auto scrolls to the bottom when message is sent and received
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length === 0) return; // Skip if no messages

    // Only make the API call when the user has sent a new message
    const userMessage = messages[messages.length - 1];
    if (userMessage.role === "user") {
      fetchAIResponse(messages); // Fetch AI response after user message
    }
  }, [messages]); // This will run whenever messages change

  const fetchAIResponse = async (messages) => {
    setLoading(true);

    try {
      const formattedMessages = messages.map((msg) => ({
        ...msg,
        content:
          typeof msg.content === "object"
            ? JSON.stringify(msg.content)
            : msg.content,
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/ai`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: formattedMessages }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          id: messages.length + 1,
          role: "assistant",
          content: data,
        };

        setMessages((prevMessages) => {
          return [...prevMessages, aiMessage];
        });

        setMyTrip(data.trip);

        setAiTripAtom(() => {
          data.trip.destinations.forEach((destination, index) => {
            destination.id = index + 1;
          });

          console.log("trip in map", data.trip.destinations);
          return data.trip.destinations;
        });
      } else {
        console.error("Failed to fetch response from backend");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          role: "assistant",
          content: "The AI tool is not running, please try again later",
        },
      ]);
    }

    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input.trim(),
    };

    setInput("");
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  };

  return (
    <div
      className="flex flex-row flex-grow"
      style={{ height: containerHeight }}
    >
      <div className=" p-4 w-1/2">
        <div className="flex flex-col h-full max-h-full rounded-lg bg-themePink">
          <div
            ref={messageAreaRef}
            className="pt-4 pl-4 pr-4 flex flex-col flex-grow overflow-auto space-y-5"
          >
            {messages.length === 0 && (
              <div className="ml-8 m-auto text-white">
                <h1 className="text-5xl">
                  Ask Me Anything and Start Planning Your Trip!
                </h1>
                <br></br>
                <p className="text-2xl">Try:</p>
                <ul>
                  <li>
                    I have a budget of $2000, what should I do on a three-day
                    trip to [destination]?
                  </li>
                  <li>
                    I don’t like crowded places, any suggestions for
                    [destination]?
                  </li>
                  <li>What can I do for a 5 hour layover in [destination]</li>
                </ul>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex max-w-full ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="relative min-w-12 max-w-12 h-12 mr-2">
                    <Image
                      src={"/AI Icon.png"}
                      alt="AI Icon"
                      width={48}
                      height={48}
                      className="rounded-full object-contain"
                    />
                  </div>
                )}

                <div
                  className={`break-words p-3 rounded-lg max-w-full ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <AiResponse response={message.content} />
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="relative min-w-12 max-w-12 h-12 mr-2">
                  <Image
                    src={"/AI Icon.png"}
                    alt="AI Icon"
                    width={48}
                    height={48}
                    className="rounded-full object-contain"
                  />
                </div>
                <div className="p-3 rounded-lg bg-gray-300 flex items-center">
                  <div className="flex space-x-1">
                    <span
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-strong"
                      style={{ animationDelay: "0s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-strong"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-strong"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="m-2 pt-4 pb-4 px-3 flex items-center space-x-4 bottom-0 rounded-xl bg-themePinkLight">
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-lg"
            />
            <button
              onClick={handleSend}
              className="px-2 py-2 bg-blue-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* <LoadScript googleMapsApiKey={apiKey}> */}
      <TripList setIsMapOpen={setIsMapOpen} myTrip={myTrip} />
      {isMapOpen && (
        <LoadScript googleMapsApiKey={apiKey}>
          <TripMap />
        </LoadScript>
      )}
      {/* </LoadScript> */}
    </div>
  );
}
