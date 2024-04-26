import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FiMenu,
  FiSettings,
  FiHelpCircle,
  FiInfo,
  FiMail,
  FiGrid,
  FiArrowUp,
} from "react-icons/fi";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const navItems = [
  { label: "How it works / FAQ", href: "/how-it-works", icon: FiInfo },
  { label: "Contact Us", href: "/contact", icon: FiMail },
  { label: "Settings", href: "/settings", icon: FiSettings },
];

const Navigation = async () => {
  const supabase = createClient();
  const { data: { user } = {} } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  return (
    <div className="fixed top-4 left-4 flex space-x-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <FiMenu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-4">
          <nav className="space-y-2 pt-6">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </Button>
            ))}
          </nav>
          <div className="mt-auto border-t border-gray-200 pt-4">
            {user ? (
              <div>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.email}</span>
                </div>
                <form action={signOut}>
                  <Button variant="outline" className="mt-2 w-full">
                    Log Out
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="ghost">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;
