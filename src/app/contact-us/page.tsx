"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { sendContactMessage } from "./contact_actions";
import { useFormState } from "react-dom";
import Link from "next/link";
type ContactState = {
  success: boolean;
  message: string;
};

export default function ContactPage() {
  const initialState: ContactState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useFormState<ContactState, FormData>(
    async (state, payload) => {
      const response = await sendContactMessage(payload);
      return response;
    },
    initialState
  );

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
      <Card className="w-full max-w-md mx-4"> {/* Make the card responsive */}
        <CardHeader>
          <CardTitle className="text-2xl text-center"> {/* Center the title */}
            Contact Us
          </CardTitle>
          <CardDescription className="text-center"> {/* Center the description */}
            Send us a message and we&apos;ll get back to you
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
                placeholder="your@email.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={8}
                className="w-full" 
              />
            </div>
            {state?.message && (
              <Alert variant={state.success ? "default" : "destructive"}>
                {state.message}
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}