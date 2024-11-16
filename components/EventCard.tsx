"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Calendar, Upload, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Event = {
    id: string;
    description: string;
    location: string;
    timestamp: bigint;
    isActive: boolean;
    creator: {
        id: string;
        isVerified: boolean;
        reputationPoints: bigint;
        acceptedSubmissions: bigint;
        totalSubmissions: bigint;
    };
};

export default function EventCard({ event }: { event: Event }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg">{event.description}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDistanceToNow(Number(event.timestamp), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="text-xs text-muted-foreground">
                            Status: {event.isActive ? "Active" : "Closed"}
                        </div>
                    </CardFooter>
                </Card>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{event.description}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Button className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Evidence
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Image className="h-4 w-4 mr-2" />
                        Show Evidences
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}