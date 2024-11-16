"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Implement World ID login logic here
    router.push("/home");
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
        </CardContent>
      </Card>
    </div>
  );
}