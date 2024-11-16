import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Calendar, Upload, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "./hooks/use-toasts";
import { submitEvidence } from "./lib/contract-txns";
import { geohashForLocation } from "geofire-common";

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
  if (session) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setSelectedFile(e.target.files[0]);
      }
    };
    const uploadEvidence = async (file: File, eventId: string) => {
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
        const APP_ID = process.env.NILLION_API_ID;
        const API_BASE = process.env.NILLION_APP_BASE;
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
          const result = await uploadEvidence(selectedFile, event.id);

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
          <div className="cursor-pointer hover:shadow-lg transition-shadow">
            <div>
              <div>{event.description}</div>
              <div>
                <MapPin className="h-4 w-4" /> {event.location}
              </div>
              <div>
                <Calendar className="h-4 w-4" />{" "}
                {formatDistanceToNow(Number(event.timestamp), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.description}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input type="file" onChange={handleFileChange} />
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
}
