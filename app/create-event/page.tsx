"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createCategory, createEvent } from "@/components/lib/contract-txns";
import { toast } from "@/components/hooks/use-toasts";

const categories = [{ id: "0", name: "Security" }];

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateEvent() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
   const [txHash, setTxHash] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      location: "",
      category: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Implement event creation logic here
    try {
      console.log(data);
      const { commandPayload, finalPayload } = await createEvent(
        data.description,
        data.location,
        [Number(data.category)]
      );
      if (finalPayload.status == "success") {
        setIsSuccess(true);
        setTxHash(finalPayload.transaction_id);
        // await createCategory(data.description, data.description);
        toast({
          title: "Event Created",
          description: "Your event has been successfully created.",
          variant: "default", // Optional, customize as per your toast setup
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Unable to create an event due to an error",
        variant: "destructive", // Optional, customize as per your toast setup
      });
    }
  };
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <Card>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-xl font-semibold">
              Event Created Successfully!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your event has been successfully created.
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
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter event description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Create Event
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
