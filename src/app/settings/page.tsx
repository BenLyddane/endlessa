// page.tsx
"use client";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, EyeOff, Eye } from "lucide-react";
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
  open_ai_api_key?: string;
  anthropic_api_key?: string;
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
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);

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
      <div className="fixed top-4 left-4">
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Settings</CardTitle>
          <CardDescription className="text-center">
            Update your profile settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={formAction}>
            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatar_url"
                type="text"
                placeholder="https://example.com/avatar.png"
                defaultValue={userData?.avatar_url || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="first_name"
                type="text"
                defaultValue={userData?.first_name || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="last_name"
                type="text"
                defaultValue={userData?.last_name || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                defaultValue={userData?.username || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="openAiApiKey">OpenAI API Key</Label>
              <div className="flex items-center">
                <Input
                  id="openAiApiKey"
                  name="open_ai_api_key"
                  type={showOpenAIKey ? "text" : "password"}
                  defaultValue={userData?.open_ai_api_key || ""}
                />
                <Button
                  variant="ghost"
                  onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                >
                  {showOpenAIKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="anthropicApiKey">Anthropic API Key</Label>
              <div className="flex items-center">
                <Input
                  id="anthropicApiKey"
                  name="anthropic_api_key"
                  type={showAnthropicKey ? "text" : "password"}
                  defaultValue={userData?.anthropic_api_key || ""}
                />
                <Button
                  variant="ghost"
                  onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                >
                  {showAnthropicKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
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
