// page.tsx
"use client";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Home from "@/components/ui/home";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateUser, getUserData } from "./settings_actions";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserData {
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="default"
      className="w-full"
      disabled={pending}
    >
      Update Settings
    </Button>
  );
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const [state, formAction] = useFormState(updateUser, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Home />
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Settings</CardTitle>
          <CardDescription className="text-center">
            Update your profile settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={formAction}>
            <div className="my-4">
              <h3 className="text-lg font-semibold my-2">User Profile</h3>
              <div className="grid gap-2">
                <div className="mt-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                </div>
                <Input
                  id="avatarUrl"
                  name="avatar_url"
                  type="text"
                  placeholder="https://example.com/avatar.png"
                  defaultValue={userData?.avatar_url || ""}
                />
              </div>
              <div className="grid gap-2">
                <div className="mt-2">
                  <Label htmlFor="firstName">First Name</Label>
                </div>
                <Input
                  id="firstName"
                  name="first_name"
                  type="text"
                  defaultValue={userData?.first_name || ""}
                />
              </div>
              <div className="grid gap-2">
                <div className="mt-2">
                  <Label htmlFor="lastName">Last Name</Label>
                </div>
                <Input
                  id="lastName"
                  name="last_name"
                  type="text"
                  defaultValue={userData?.last_name || ""}
                />
              </div>
              <div className="grid gap-2">
                <div className="mt-2">
                  <Label htmlFor="username">Username</Label>
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={userData?.username || ""}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Application Settings
              </h3>
              {/* Add application settings here */}
            </div>
            {state?.message && (
              <Alert
                variant={
                  state.message.includes("success") ? "default" : "destructive"
                }
              >
                <AlertTitle>
                  {state.message.includes("success") ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
