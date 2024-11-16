"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserDetails } from "@/components/lib/graph";
import { User } from "@/components/lib/types";

// Mock data - replace with actual data fetching
const mockuser = {
    id: "0x123",
    isVerified: true,
    reputationPoints: BigInt(100),
    acceptedSubmissions: BigInt(5),
    totalSubmissions: BigInt(8),
    createdEvents: [
        {
            id: "1",
            description: "Suspicious activity",
            location: "Downtown",
            timestamp: BigInt(Date.now()),
            isActive: true,
        },
    ],
    evidences: [
        {
            id: "1",
            eventId: "1",
            timestamp: BigInt(Date.now()),
            status: "Accepted",
        },
    ],
    categories: [
        {
            id: "1",
            name: "Security",
        },
    ],
};

export default function Profile() {

    const { data: session } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }

        async function fetchData() {
            console.log(session)
            let userData = await getUserDetails(session?.user?.name)
            console.log({ userData })
            setUser(userData)
        }

        fetchData()

    }, [session?.user])



    return (
        <div className="container max-w-md mx-auto p-4">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>Profile</span>
                        {mockuser.isVerified && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">ID</span>
                            <span>{mockuser.id.toString().slice(0, 6)}...</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Reputation</span>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                {mockuser.reputationPoints.toString()}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span>
                                {(Number(mockuser.acceptedSubmissions) / Number(mockuser.totalSubmissions) * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="events">
                <TabsList className="w-full">
                    <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
                    <TabsTrigger value="evidences" className="flex-1">Evidences</TabsTrigger>
                    <TabsTrigger value="categories" className="flex-1">Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockuser.createdEvents.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={event.isActive ? "default" : "secondary"}>
                                            {event.isActive ? "Active" : "Closed"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="evidences">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event ID</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockuser.evidences.map((evidence) => (
                                <TableRow key={evidence.id}>
                                    <TableCell>{evidence.id}</TableCell>
                                    <TableCell>
                                        <Badge >
                                            evidence.status
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                {/* <TabsContent value="categories">
                    <div className="space-y-2">
                        {mockuser.categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center gap-2 p-3 rounded-lg border"
                            >
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{category.name}</span>
                            </div>
                        ))}
                    </div>
                </TabsContent> */}
            </Tabs>
        </div>
    );
}