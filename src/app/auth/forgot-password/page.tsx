import Image from "next/image";
import Link from "next/link";
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
import { forgotPassword } from "./actions";

export default function MagicLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email below to log in with magic email link. 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
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
              
              </div>
            
            </div>
            <Button formAction={forgotPassword} className="w-full">
              Send magic email link
            </Button>
          </form>
       
        </CardContent>
      </Card>
    </div>
  );
}
