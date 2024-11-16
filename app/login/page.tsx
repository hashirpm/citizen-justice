"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitAndRecieveData } from "@/lib/avail";
import { Globe } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session]);

  const handleLogin = async () => {
    // Implement World ID login logic here
    signIn("worldcoin");
    router.push("/");
  };

  const handleAvail = async () => {
    await submitAndRecieveData();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 text-lg h-12"
          >
            <Globe className="h-5 w-5" />
            Login with World ID
          </Button>
          <Button
            onClick={handleAvail}
            className="w-full flex items-center justify-center gap-2 text-lg h-12"
          >
            <Globe className="h-5 w-5" />
            Send to Avail
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
