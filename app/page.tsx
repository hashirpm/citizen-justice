"use client"

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validateEvidence, verifyUser } from "@/components/lib/contract-txns";
import { getAllActiveEvents } from "@/components/lib/graph";
import { Event } from "@/components/lib/types";

// Mock data - replace with actual data fetching
const mockEvents = [
  {
    id: "1",
    description: "Suspicious activity in downtown area",
    location: "Main Street, Downtown",
    timestamp: BigInt(Date.now()),
    isActive: true,
    categoryIds: [0],
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

  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }

    async function fetchData() {
      let events = await getAllActiveEvents()
      setEvents(events)
    }

    fetchData()
  }, [])

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" onClick={() => validateEvidence(1, 1, true)}>Events</h1>
        <Link href="/create-event">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* <SignIn /> */}

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}