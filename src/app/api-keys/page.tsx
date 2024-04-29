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
import { updateApiKeys, getApiKeys } from "./api_key_actions";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ApiKeys {
  open_ai_api_key?: string;
//   anthropic_api_key?: string;
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
      Update API Keys
    </Button>
  );
}

export default function ApiKeyPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeys | null>(null);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const keys = await getApiKeys();
        setApiKeys(keys);
      } catch (error) {
        console.error("Error fetching API keys:", error);
      }
    };

    fetchApiKeys();
  }, []);

  const [state, formAction] = useFormState(updateApiKeys, initialState);

  const handleToggleOpenAIKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowOpenAIKey(!showOpenAIKey);
  };

  const handleToggleAnthropicKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowAnthropicKey(!showAnthropicKey);
  };

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
          <CardTitle className="text-2xl text-center">API Keys</CardTitle>
          <CardDescription className="text-center">
            Manage your API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={formAction}>
            <div className="grid gap-2">
              <Label htmlFor="openAiApiKey">OpenAI API Key</Label>
              <div className="flex items-center">
                <Input
                  id="openAiApiKey"
                  name="open_ai_api_key"
                  type={showOpenAIKey ? "text" : "password"}
                  defaultValue={apiKeys?.open_ai_api_key || ""}
                  className="flex-1"
                />
                <Button variant="ghost" onClick={handleToggleOpenAIKey}>
                  {showOpenAIKey ? <EyeOff size={16} /> : <Eye size={16} />}
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
