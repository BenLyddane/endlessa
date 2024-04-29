// api_key_actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateApiKeys(
  prevState: { message: string },
  formData: FormData
) {
  const supabase = createClient();
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    throw new Error("User not authenticated.");
  }

  const userId = authUser.user.id;
  const updateData: any = {};

  if (formData.has("open_ai_api_key"))
    updateData.open_ai_api_key = formData.get("open_ai_api_key") as string;
  if (formData.has("anthropic_api_key"))
    updateData.anthropic_api_key = formData.get("anthropic_api_key") as string;

  try {
    const { data: userData, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update API keys: ${error.message}`);
    }

    return { message: "API keys updated successfully" };
  } catch (error: any) {
    return {
      message: `An error occurred while updating API keys: ${error.message}`,
    };
  }
}

export async function getApiKeys() {
  const supabase = createClient();
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error("Error authenticating user.");
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("open_ai_api_key, anthropic_api_key")
    .eq("id", authUser.user.id)
    .single();

  if (userError) {
    throw new Error(`Failed to fetch API keys: ${userError.message}`);
  }

  return userData;
}