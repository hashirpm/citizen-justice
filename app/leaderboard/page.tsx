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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsersByReputation } from "@/components/lib/graph";
import { User } from "@/components/lib/types";
import { Trophy, Medal, Award, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

function getRankIcon(rank: number) {
    switch (rank) {
        case 1:
            return <Trophy className="h-6 w-6 text-yellow-500" />;
        case 2:
            return <Medal className="h-6 w-6 text-gray-400" />;
        case 3:
            return <Medal className="h-6 w-6 text-amber-700" />;
        default:
            return <Award className="h-6 w-6 text-blue-500" />;
    }
}

function getBackgroundColor(rank: number) {
    switch (rank) {
        case 1:
            return "bg-yellow-50";
        case 2:
            return "bg-gray-50";
        case 3:
            return "bg-amber-50";
        default:
            return "bg-white";
    }
}


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
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Top Contributors</h1>
                <p className="text-muted-foreground">Compete to reach the top!</p>
            </div>

            <div className="space-y-3">
                {leaderboardData.map((user, index) => (
                    <Card
                        key={user.id.toString()}
                        className={cn(
                            "p-4 transition-all hover:scale-102 cursor-pointer",
                            getBackgroundColor(index + 1)
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                {getRankIcon(index + 1)}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">
                                        {user.id.toString().slice(0, 6)}...
                                    </span>
                                    {user.isVerified && (
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Success Rate:{" "}
                                    <span className="text-primary font-medium">
                                        {Number(user?.totalSubmissions) != 0 ? (
                                            (Number(user.acceptedSubmissions) /
                                                Number(user.totalSubmissions)) *
                                            100
                                        ).toFixed(0) : 0}
                                        %
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-lg">
                                    {user.reputationPoints.toString()}
                                </div>
                                <div className="text-xs text-muted-foreground">POINTS</div>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 h-2 bg-primary/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{
                                    width: `${Number(user?.totalSubmissions) != 0 ? (Number(user.acceptedSubmissions) /
                                        Number(user.totalSubmissions)) : 0 *
                                    100}%`,
                                }}
                            />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">How to Earn Points</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Submit verified evidence (+50 points)
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Create events (+20 points)
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Validate submissions (+10 points)
                    </li>
                </ul>
            </div>
        </div>
    );
}