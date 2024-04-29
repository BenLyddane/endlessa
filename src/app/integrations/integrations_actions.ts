// integrations_actions.ts
"use server";
import { createClient } from "@/utils/supabase/server";

interface Integration {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  coming_soon: boolean;
  link: string;
}

export async function updateUserIntegration(
  prevState: { message: string; integrations: Integration[] },
  formData: FormData
) {
  const supabase = createClient();
  const authUser = await supabase.auth.getUser();
  if (!authUser.data.user) {
    throw new Error("User not authenticated.");
  }
  const userId = authUser.data.user.id;
  const integrationId = Number(formData.get("integrationId"));
  const active = Boolean(formData.get("active"));

  try {
    const { data, error } = await supabase
      .from("user_integrations")
      .upsert(
        { user_id: userId, integration_id: integrationId, active },
        { onConflict: "integration_id" }
      )
      .select("*")
      .single();

    if (error) {
      console.error(`Failed to upsert user integration: ${error.message}`);
      throw new Error(`Failed to upsert user integration: ${error.message}`);
    }

    console.log("User integration data:", data);

    // Update the integrations in the state with the new active status
    const updatedIntegrations = prevState.integrations.map((integration) => {
      const userIntegration = prevState.integrations.find(
        (ui) => ui.id === integration.id && ui.active
      );
      return { ...integration, active: userIntegration ? true : false };
    });

    console.log("Updated integrations:", updatedIntegrations);

    return {
      message: "User integration updated successfully",
      integrations: updatedIntegrations,
    };
  } catch (error: any) {
    console.error(`An error occurred while updating user integration: ${error.message}`);
    return {
      message: `An error occurred while updating user integration: ${error.message}`,
      integrations: prevState.integrations,
    };
  }
}

export async function getUserIntegrations() {
  const supabase = createClient();
  const authUser = await supabase.auth.getUser();
  if (!authUser.data.user) {
    throw new Error("User not authenticated.");
  }
  const userId = authUser.data.user.id;
  const { data: userIntegrations, error } = await supabase
    .from("user_integrations")
    .select("*, integrations(*)")
    .eq("user_id", userId);

  if (error) {
    console.error(`Failed to fetch user integrations: ${error.message}`);
    throw new Error(`Failed to fetch user integrations: ${error.message}`);
  }

  console.log("User integrations:", userIntegrations);
  return userIntegrations;
}

export async function getAllIntegrations() {
    const supabase = createClient();
    console.log("Getting all integrations...");
  
    const { data: integrations, error } = await supabase
      .from("integrations")
      .select("*");
  
    if (error) {
      console.error(`Failed to fetch integrations: ${error.message}`);
      throw new Error(`Failed to fetch integrations: ${error.message}`);
    }
  
    console.log("Integrations data from Supabase:", integrations);
  
    if (!integrations) {
      console.warn("Integrations data is null or undefined.");
    } else if (integrations.length === 0) {
      console.warn("No integrations found in the database.");
    } else {
      console.log("Integrations found:", integrations);
    }
  
    return integrations || [];
  }