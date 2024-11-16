"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsersByReputation } from "@/components/lib/graph";
import { User } from "@/components/lib/types";

// Mock data - replace with actual data fetching
const mockUsers = [
    {
        id: "0x123",
        isVerified: true,
        reputationPoints: BigInt(100),
        acceptedSubmissions: BigInt(5),
        totalSubmissions: BigInt(8),
    },
    // Add more mock users as needed
];

export default function Leaderboard() {

    const { data: session } = useSession();
    const router = useRouter();
    const [leaderboardData, setLeaderboardData] = useState<User[]>([])

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }

        async function fetchData() {
            let leaderboardData = await getUsersByReputation()
            console.log('leaderboardData :', leaderboardData);
            setLeaderboardData(leaderboardData)
        }
        fetchData()
    }, [])

    return (
        <div className="container max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                            <TableHead className="text-right">Success Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboardData.map((user) => (
                            <TableRow key={user.id.toString()}>
                                <TableCell className="flex items-center gap-2">
                                    {user.id.toString().slice(0, 6)}...
                                    {user.isVerified && (
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="secondary">
                                        {user.reputationPoints.toString()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {(Number(user.acceptedSubmissions) / Number(user.totalSubmissions) * 100).toFixed(0)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}