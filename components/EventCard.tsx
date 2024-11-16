"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Calendar,
  Upload,
  Image,
  CheckCircle,
  Loader,
} from "lucide-react";
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [storedImageUrl, setStoredImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
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
      setIsUploading(true);
      toast({
        title: "Uploading Evidence to Nillion...",
        variant: "default", // Optional, customize as per your toast setup
      });
      if (selectedFile) {
        const result = await uploadEvidence(selectedFile[0], event.id);

        const { commandPayload, finalPayload } = await submitEvidence(
          result.result.store_id,
          "w4rw063p",
          event.categoryIds,
          Number(event.id),
          "metadata"
        );
        if (finalPayload.status == "success") {
          setIsSuccess(true);
          setTxHash(finalPayload.transaction_id);
          toast({
            title: "Evidence uploaded to nillion!",
            variant: "default", // Optional, customize as per your toast setup
          });
          console.log(result);
        }
        setIsUploading(false);
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
      setIsUploading(false);
    }
  };
  const handleViewImage = async () => {
    setIsFetching(true);
    const APP_ID = NILLION_APP_ID;
    const API_BASE = NILLION_APP_BASE;
    const USER_SEED = session?.user?.name?.slice(0, 10);

    const storeIds = await fetch(`${API_BASE}/api/apps/${APP_ID}/store_ids`)
      .then((res) => res.json())
      .then((data) => data.store_ids);
    console.log({ storeIds });
    // Get the latest stored image
    const latestStoreId = storeIds[0];
    console.log({ latestStoreId });
    toast({
      title: "Retrieving Evidence from Nillion...",
      variant: "default", // Optional, customize as per your toast setup
    });
    const retrievedImage = await fetch(
      `${API_BASE}/api/secret/retrieve/${latestStoreId.store_id}?retrieve_as_nillion_user_seed=${USER_SEED}&secret_name=${latestStoreId.secret_name}`
    ).then((res) => res.json());
    console.log({ retrievedImage });
    setStoredImageUrl(retrievedImage.secret);
    setIsFetching(false);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-xl font-semibold">
                Evidence added Successfully!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your evidence has been successfully added.
              </p>
              {txHash && (
                <a
                  href={`https://worldchain-mainnet.explorer.alchemy.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-4"
                >
                  View Transaction on Blockscout
                </a>
              )}
              <button onClick={handleViewImage}>
                View uploaded evidence from Nillion
              </button>
              {storedImageUrl && (
                <div>
                  <p style={{ marginBottom: "10px", fontWeight: "500" }}>
                    Retrieved Image:
                  </p>
                  <img
                    src={storedImageUrl}
                    alt="Retrieved from Nillion"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
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
                    <span>
                      {formatDistanceToNow(Number(event.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Status: {event.isActive ? "Active" : "Closed"}
                </div>
              </CardFooter>
            </>
          )}
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
            <Button className="btn">
              {selectedFile != null ? selectedFile[0].name : "Select Document"}
            </Button>
            <Input
              type="file"
              name="myfile"
              onChange={(e: any) => setSelectedFile(e.target.files)}
            />
          </div>
          <Button
            onClick={handleUpload}
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Evidence
              </>
            )}
          </Button>
          {/* <p>{status}</p> */}
          <Button variant="outline" className="w-full" disabled={isFetching}>
            {isFetching ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                Show Evidences
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
