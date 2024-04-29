"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FiMenu,
  FiSettings,
  FiHelpCircle,
  FiUser,
  FiUserPlus,
  FiInfo,
  FiMail,
} from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { signOut } from "./navigation_actions";
import Link from "next/link";

interface NavItem {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
}

const Navigation = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [user]);

  const navItems: NavItem[] = [
    {
      label: "How it works / FAQ",
      icon: FiInfo,
      path: "/how-it-works", // Add the path here
    },
    {
      label: "Contact Us",
      icon: FiMail,
      path: "/contact-us", // Add the path here
    },
    ...(!user
      ? [
          {
            label: "Login",
            icon: FiUser,
            path: "/auth/login", // Add the path here
          },
          {
            label: "Sign up",
            icon: FiUserPlus,
            path: "/auth/signup", // Add the path here
          },
        ]
      : []),
    ...(user
      ? [
          {
            label: "Settings",
            icon: FiSettings,
            path: "/settings", // Add the path here
          },
        ]
      : []),
  ];

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
              <Link key={item.label} href={item.path} passHref legacyBehavior>
                <Button variant="ghost" className="w-full justify-start">
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </Button>
              </Link>
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
                <form action={signOut} method="post">
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    type="submit"
                  >
                    Log Out
                  </Button>
                </form>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;
