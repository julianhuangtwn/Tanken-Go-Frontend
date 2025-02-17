import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import Link from "next/link"
  

  export default function AccountTripCard({ trip }) {
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
            <CardFooter>
                <Link href={`/account/saved-trips/${trip.tripId}`}>
                    <p>Click for more details</p>
                </Link>
            </CardFooter>
        </Card>
    )
  }
