// integrations.tsx
"use client";
import { useEffect, useState } from "react";
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
import { getAllIntegrations } from "./integrations_actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Integration {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  coming_soon: boolean;
  link: string;
  description?: string;
}

const initialState = {
  message: "",
  integrations: [] as Integration[],
};


const Integrations: React.FC = () => {
  const [state, setState] = useState<typeof initialState>(initialState);
  const router = useRouter();

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const integrations = await getAllIntegrations();
        setState({ ...state, integrations });
      } catch (error) {
        console.error("Error fetching integrations:", error);
        setState({
          ...state,
          message: "An error occurred while fetching integrations.",
        });
      }
    };

    fetchIntegrations();
  }, []);

  const isIntegrationActive = (
    integrationId: number,
    integrations: Integration[]
  ) => {
    const integration = integrations.find(
      (integration) => integration.id === integrationId
    );
    return integration ? integration.active : false;
  };

  const handleConfigureClick = (integrationName: string) => {
    if (integrationName === "Your Files") {
      router.push("/integrations/documents");
    } else {
      router.push(
        `/integrations/cloud/${integrationName.toLowerCase().replace(" ", "-")}`
      );
    }
  };

  console.log("State integrations:", state.integrations);

  return (
    <div className="container mx-auto px-4 py-8">
      <Home />
      <h2 className="text-2xl font-bold mb-4 text-foreground">Integrations</h2>
      {state.integrations?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.integrations.map((integration) => (
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
                    checked={integration.active}
                    onCheckedChange={() => {}}
                    className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-gray-200 bg-border"
                    disabled={integration.coming_soon}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={integration.coming_soon}
                  onClick={() => handleConfigureClick(integration.name)}
                >
                  {integration.coming_soon ? "Coming Soon" : "Configure"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No integrations available.</p>
      )}
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
    </div>
  );
};

export default Integrations;
