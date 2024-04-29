"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// UI component imports
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Home from "@/components/ui/home";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Actions imports
import {
  getAllIntegrations,
  getUserIntegrations,
  updateUserIntegration,
} from "./integrations_actions";

interface Integration {
  id: number;
  name: string;
  icon: string;
  coming_soon: boolean;
  link: string;
  description?: string;
}

interface UserIntegration {
  id: number;
  user_id: string;
  integration_id: number;
  active: boolean;
}

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>(
    []
  );
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allIntegrations, userIntegrations] = await Promise.all([
          getAllIntegrations(),
          getUserIntegrations(),
        ]);

        setIntegrations(allIntegrations);
        setUserIntegrations(userIntegrations);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setMessage("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  const handleToggleChange = async (integrationId: number, active: boolean) => {
    try {
      await updateUserIntegration(integrationId, active);
      setUserIntegrations((prevUserIntegrations) =>
        prevUserIntegrations.map((userIntegration) =>
          userIntegration.integration_id === integrationId
            ? { ...userIntegration, active }
            : userIntegration
        )
      );
      setMessage("User integration updated successfully");
    } catch (error) {
      console.error("Failed to update user integration:", error);
      setMessage("An error occurred while updating user integration.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Home />
      <h2 className="text-2xl font-bold mb-4 text-foreground">Integrations</h2>
      {integrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const userIntegration = userIntegrations.find(
              (ui) => ui.integration_id === integration.id
            );
            const active = userIntegration?.active || false;

            return (
              <Card
                key={integration.id}
                className="bg-background text-foreground"
              >
                <CardHeader>
                  <Link href={integration.link}>
                    <CardTitle className="cursor-pointer">
                      {integration.name}
                    </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent>
                  <CardDescription>{integration.description}</CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5">
                        <i className={`${integration.icon} text-foreground`} />
                      </div>
                      <span>
                        {integration.name}
                        {integration.coming_soon && (
                          <span className="text-sm text-gray-500">
                            {" "}
                            (Coming Soon)
                          </span>
                        )}
                      </span>
                    </div>
                    <Switch
                      checked={active}
                      onCheckedChange={() =>
                        handleToggleChange(integration.id, !active)
                      }
                      className={`${
                        active ? "bg-foreground" : "bg-gray-200"
                      } data-[state=checked]:bg-foreground data-[state=unchecked]:bg-gray-200`}
                      disabled={integration.coming_soon}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/integrations/${integration.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                    disabled={integration.coming_soon}
                  >
                    {integration.coming_soon ? "Coming Soon" : "Configure"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <p>No integrations available.</p>
      )}
      {message && (
        <Alert
          variant={message.includes("success") ? "default" : "destructive"}
        >
          <AlertTitle>
            {message.includes("success") ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Integrations;
