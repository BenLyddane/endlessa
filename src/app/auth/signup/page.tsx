// app/auth/signup/page.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { signup } from "./actions";
import { Home } from "lucide-react";
import { useFormState } from "react-dom";
import { redirect } from "next/navigation";

type LoginState = {
  success: boolean;
  message: string;
};

export default function SignupPage() {
  const router = useRouter();
  const initialState: LoginState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useFormState<LoginState, FormData>(
    async (state, payload) => {
      const response = await signup(payload);

      return response;
    },
    initialState
  );

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed top-4 left-4">
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <Card className="mx-auto w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your email and password to Sign Up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" action={formAction}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" />
              </div>
              {state?.message && (
                <Alert variant={state.success ? "default" : "destructive"}>
                  {state.message}
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline">
                Log In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
