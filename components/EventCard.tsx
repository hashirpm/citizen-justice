"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Calendar, Upload, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { submitEvidence } from "./lib/contract-txns";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "./ui/input";
import { NILLION_APP_ID, NILLION_APP_BASE } from "./lib/const";
type Event = {
  id: string;
  description: string;
  location: string;
  timestamp: bigint;
  isActive: boolean;
  categoryIds: number[];
  creator: {
    id: string;
    isVerified: boolean;
    reputationPoints: bigint;
    acceptedSubmissions: bigint;
    totalSubmissions: bigint;
  };
};

export default function EventCard({ event }: { event: Event }) {

  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<any>();

  const uploadEvidence = async (file: File, eventId: string) => {

    // console.log("-->", process.env.NILLION_API_ID)
    // console.log("-->", process.env.NILLION_APP_BASE)
    if (!file) {
      throw new Error("Please select a file first.");
    }

    try {
      // Convert file to Base64
      const base64File = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) resolve(reader.result.toString());
          else reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file);
      });
      const APP_ID = NILLION_APP_ID;
      const API_BASE = NILLION_APP_BASE;

      console.log("APP_ID", APP_ID);
      console.log("API_BASE", API_BASE);
      // Make API request to store evidence
      const response = await fetch(`${API_BASE}/api/apps/${APP_ID}/secrets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: {
            nillion_seed: session?.user?.name?.slice(0, 10),
            secret_value: base64File,
            secret_name: `evidence_${eventId}`,
          },
          permissions: {
            retrieve: [],
            update: [],
            delete: [],
            compute: {},
          },
        }),
      });

      const result = await response.json();
      console.log("result", result);
      if (!response.ok) {
        throw new Error(result.message || "Error storing evidence");
      }

      return { success: true, result };
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    try {
      toast({
        title: "Uploading Evidence",
        variant: "default", // Optional, customize as per your toast setup
      });
      if (selectedFile) {
        const result = await uploadEvidence(selectedFile[0], event.id);

        await submitEvidence(
          result.result.store_id,
          "geohash",
          event.categoryIds,
          Number(event.id),
          "metadata"
        );
        toast({
          title: "Evidence uploaded successfully!",
          variant: "default", // Optional, customize as per your toast setup
        });
        console.log(result);
      } else {
        toast({
          title: "Select a file",
          variant: "default", // Optional, customize as per your toast setup
        });
      }
    } catch (error) {
      toast({
        title: "Error uploading file",
        variant: "default", // Optional, customize as per your toast setup
      });
      console.error(error);
    }
  };

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

      {/* <DialogContent>
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
      </DialogContent> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.description}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* <input type="file" onChange={handleFileChange} /> */}
          <div className="upload-btn-wrapper mt-4 cursor-pointer">
            <Button className="btn">{selectedFile != null ? selectedFile[0].name : "Upload Document"}</Button>
            <Input type="file" name="myfile" onChange={(e: any) => setSelectedFile(e.target.files)} />
          </div>
          <Button onClick={handleUpload} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Evidence
          </Button>
          <p>{status}</p>
          <Button variant="outline" className="w-full">
            <Image className="h-4 w-4 mr-2" />
            Show Evidences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}