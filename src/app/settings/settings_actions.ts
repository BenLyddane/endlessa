// settings_actions.ts "use server";
'use server'
import { createClient } from "@/utils/supabase/server";

export async function updateUser(
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
  if (formData.has("avatar_url"))
    updateData.avatar_url = formData.get("avatar_url") as string;
  if (formData.has("first_name"))
    updateData.first_name = formData.get("first_name") as string;
  if (formData.has("last_name"))
    updateData.last_name = formData.get("last_name") as string;
  if (formData.has("username"))
    updateData.username = formData.get("username") as string;
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
      throw new Error(`Failed to update user settings: ${error.message}`);
    }
    return { message: "User settings updated successfully" };
  } catch (error: any) { // <-- Add type annotation for error
    return { message: `An error occurred while updating user settings: ${error.message}` };
  }
}

export async function getUserData() {
  const supabase = createClient();
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError) {
    throw new Error("Error authenticating user.");
  }
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.user.id)
    .single();
  if (userError) {
    throw new Error(`Failed to fetch user data: ${userError.message}`);
  }
  return userData;
}