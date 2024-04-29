"use server";
import { createClient } from "@/utils/supabase/server";

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

export async function getAllIntegrations(): Promise<Integration[]> {
  const supabase = createClient();

  const { data: integrations, error } = await supabase.from("integrations").select("*");

  if (error) {
    console.error(`Failed to fetch integrations: ${error.message}`);
    throw new Error(`Failed to fetch integrations: ${error.message}`);
  }

  return integrations as Integration[];
}

export async function getUserIntegrations(): Promise<UserIntegration[]> {
  const supabase = createClient();
  const authUser = await supabase.auth.getUser();

  if (!authUser.data.user) {
    throw new Error("User not authenticated.");
  }

  const userId = authUser.data.user.id;

  const { data: userIntegrations, error } = await supabase
    .from("user_integrations")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(`Failed to fetch user integrations: ${error.message}`);
    throw new Error(`Failed to fetch user integrations: ${error.message}`);
  }

  return userIntegrations as UserIntegration[];
}

export async function updateUserIntegration(integrationId: number, active: boolean): Promise<void> {
    const supabase = createClient();
    const authUser = await supabase.auth.getUser();
  
    if (!authUser.data.user) {
      throw new Error("User not authenticated.");
    }
  
    const userId = authUser.data.user.id;
  
    const { error } = await supabase
      .from("user_integrations")
      .upsert(
        { user_id: userId, integration_id: integrationId, active },
        { onConflict: "user_id, integration_id" }
      );
  
    if (error) {
      console.error(`Failed to update user integration: ${error.message}`);
      throw new Error(`Failed to update user integration: ${error.message}`);
    }
}