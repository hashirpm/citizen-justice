"use client";

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
import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    IndexService,
    decodeOnChainData,
    DataLocationOnChain,
} from "@ethsign/sp-sdk";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getEnsOrAddress } from "@/components/lib/ens";
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
    const indexService = new IndexService("testnet");
    const [txHash, setTxHash] = useState<string | null>(null);

    const { data: session } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }

        async function fetchData() {
            console.log(session);
            let userData = await getUserDetails(session?.user?.name);
            setUser(userData.users[0]);
        }

        fetchData();
    }, [session?.user]);

    const handleVerify = async () => {
        try {
            if (user?.attestationId) {
                const result = await indexService.queryAttestation(user?.attestationId);
                console.log("Attestation query result:", result);
                if (result?.transactionHash) {
                    setTxHash(result?.transactionHash);
                }

                return result;
            }
        } catch (error) {
            console.error("Error verifying invoice:", error);
            throw error;
        }
    };

    return (
        <div className="container max-w-md mx-auto p-4">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>Profile</span>
                        {user?.isVerified && (
                            <>
                                <CheckCircle className="h-5 w-5 text-primary" />
                                <button className="" onClick={handleVerify}>
                                    Verify Attestation
                                </button>
                            </>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">ID</span>
                            <span>{getEnsOrAddress(user?.id)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Reputation</span>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                {user?.reputationPoints.toString()}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span>
                                {(
                                    (Number(user?.acceptedSubmissions) /
                                        Number(user?.totalSubmissions)) *
                                    100
                                ).toFixed(0)}
                                %
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="events">
                <TabsList className="w-full">
                    <TabsTrigger value="events" className="flex-1">
                        Events
                    </TabsTrigger>
                    <TabsTrigger value="evidences" className="flex-1">
                        Evidences
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="flex-1">
                        Categories
                    </TabsTrigger>
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
                            {user?.createdEvents.map((event) => (
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
                            {user?.evidences.map((evidence) => (
                                <TableRow key={evidence.id}>
                                    <TableCell>{evidence.id}</TableCell>
                                    <TableCell>
                                        <Badge>evidence.status</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                {/* <TabsContent value="categories">
                    <div className="space-y-2">
                        {user?.categories.map((category) => (
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
            {txHash && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                                <h2 className="mt-4 text-xl font-semibold">
                                    Your attestation is verified!
                                </h2>

                                {txHash && (
                                    <a
                                        href={`https://scroll-sepolia.blockscout.com/tx/${txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline mt-4"
                                    >
                                        View Attestation on Blockscout
                                    </a>
                                )}
                            </div>
                        </Card>
                    </DialogTrigger>
                </Dialog>
            )}
        </div>
    );
}
