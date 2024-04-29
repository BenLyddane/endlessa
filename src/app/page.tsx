import { SearchBar } from "@/components/ui/search-bar";
import Navigation from "@/components/navigation/navigation";
import Integrations from "@/components/integrations";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const { data: user, error } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold mb-8">Endlessa</h1>
        <p>Search your own data.</p>
        {!user.user && (
          <div className="pt-4">
            <Link href="/auth/login" className="underline">
              Log In
            </Link>
            <span> or </span>
            <Link href="/auth/login" className="underline">
              Sign up
            </Link>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="max-w-4xl rounded mx-auto flex">
          <SearchBar />
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
