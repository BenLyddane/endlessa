// page.tsx
import { ChatWindow } from "@/components/chat-window/chat-window";
import Navigation from "@/components/navigation/navigation";
import Integrations from "@/components/integrations";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiGrid } from "react-icons/fi";

export default async function Home() {
  const supabase = createClient();
  const { data: user, error } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="mx-auto px-4 py-8">
          <ChatWindow />
        </div>
      </div>

      {/* Mode Toggle and Integrations/Login Buttons */}
      <div className="fixed top-4 right-4 flex space-x-2">
        <ModeToggle />
        {user ? (
          <Integrations />
        ) : (
          <div className="flex space-x-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
