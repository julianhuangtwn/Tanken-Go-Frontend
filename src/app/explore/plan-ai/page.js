"use client";

import TripList from "@/components/plan-ai/tripList";
import Image from "next/image";
import AiResponse from "@/components/plan-ai/AiResponse";
import { useState, useEffect, useRef } from "react";
import TripMap from "@/components/plan-ai/tripMap";
import { aiTripAtom } from "@/lib/aiTripAtom";
import { useAtom } from "jotai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState([]);
  const messageAreaRef = useRef(null);
  const [token, setToken] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [aiTrip, setAiTripAtom] = useAtom(aiTripAtom);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }

    if (messages.length === 0) return;

    const userMessage = messages[messages.length - 1];
    if (userMessage.role === "user") {
      fetchAIResponse(messages);
    }
  }, [messages]);

  const fetchAIResponse = async (messages) => {
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

        setAiTripAtom(() => data.trip.destinations);
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
    <>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            maxHeight: "80vh",
          }}
        >
          <div className="h-screen p-4" style={{ width: "50%" }}>
            <div
              className="flex flex-col h-full max-h-full rounded-lg bg-themePink"
              style={{ width: "100%", maxHeight: "75vh" }}
            >
              <div
                ref={messageAreaRef}
                className="pt-4 pl-4 pr-4 flex flex-col flex-grow overflow-auto space-y-5"
              >
                {messages.length === 0 && (
                  <div className="ml-8 m-auto text-white">
                    <h1 className="text-5xl">
                      Ask Me Anything and Start Planning Your Trip!
                    </h1>
                    <br />
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
                      <li>What can I do for a 5-hour layover in [destination]</li>
                    </ul>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex max-w-full ${
                      message.role === "user" ? "justify-end" : "justify-start"
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
              </div>
              <div className="mx-2 pt-4 pb-4 px-3 flex items-center space-x-4 bottom-0 rounded-xl bg-themePinkLight">
                <input
                  type="text"
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

          
          <TripList setIsMapOpen={setIsMapOpen} />
          {isMapOpen && <TripMap />}
        </div>
    </>
  );
}
