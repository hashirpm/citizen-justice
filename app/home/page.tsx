import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EventCard from "@/components/EventCard";
import Link from "next/link";

// Mock data - replace with actual data fetching
const mockEvents = [
    {
        id: "1",
        description: "Suspicious activity in downtown area",
        location: "Main Street, Downtown",
        timestamp: BigInt(Date.now()),
        isActive: true,
        creator: {
            id: "0x123",
            isVerified: true,
            reputationPoints: BigInt(100),
            acceptedSubmissions: BigInt(5),
            totalSubmissions: BigInt(8),
        },
    },
    // Add more mock events as needed
];

export default function Home() {
    return (
        <div className="container max-w-md mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <Link href="/create-event">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {mockEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}