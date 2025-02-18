import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { Trash2 } from "lucide-react"

  import { Button } from "@/components/ui/button"

import Link from "next/link"

import { useAtom } from "jotai"
import { tripsAtom } from "@/lib/tripsAtom"
import { getToken } from "@/lib/authenticate"
  

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

  export default function AccountTripCard({ trip }) {
    const [ trips, setTrips] = useAtom(tripsAtom);
    
    const handleDelete = async () => {
        try {
            const response = await fetch(`${NEXT_PUBLIC_API_URL}/v1/trip/${trip.tripId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) {
                console.error("Error deleting trip:", response.message);
                return;
            }
            const data = await response.json();
            setTrips((trips) => trips.filter((t) => t.tripId !== trip.tripId));
        } catch (error) {
            console.error("Error deleting trip:", error);
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{trip.tripName}</CardTitle>
                <CardDescription>
                    {trip.startDate} - {trip.endDate}
                </CardDescription>
            </CardHeader>
            <CardContent>
            <p>Total Cost Estimate: ${trip.totalCostEstimate}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Link href={`/account/saved-trips/${trip.tripId}`}>
                    <p>Click for more details</p>
                </Link>

                <Button variant="outline" onClick={handleDelete}>
                    <Trash2 />
                </Button>
            </CardFooter>
        </Card>
    )
  }
