import React from "react";
import Link from "next/link";
import { Button } from "./button";
import { Home as Home2 } from "lucide-react";

const Home = () => {
  return (
    <div className="fixed top-4 left-4">
      <Link href="/">
        <Button variant="outline">
          <Home2 className="h-4 w-4 mr-2" />
          Home
        </Button>
      </Link>
    </div>
  );
};

export default Home;
