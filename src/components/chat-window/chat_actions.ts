// chat_actions.ts
"use server";
import { createClient } from "@/utils/supabase/server";

export const getUserAPIKey = async () => {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.from("users").select("open_ai_api_key").single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return null;
  }

  return userData.open_ai_api_key;
};

export const getUserIntegrations = async () => {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.from("users").select("id").single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return [];
  }

  const { data: integrationData, error: integrationError } = await supabase
    .from("user_integrations")
    .select("integration_id, active")
    .eq("user_id", userData.id)
    .eq("active", true);

  if (integrationError) {
    console.error("Error fetching user integrations:", integrationError);
    return [];
  }

  return integrationData;
};

export const processMessage = async (message: string): Promise<string> => {
  const openAIKey = await getUserAPIKey();
  if (!openAIKey) {
    return "You don't have an OpenAI API key set up. Please set up your API key to use the chat.";
  }

  const integrationData = await getUserIntegrations();
  if (integrationData.length === 0) {
    return "You don't have any active integrations. Please set up and activate an integration to use the chat.";
  }

  let response = "";
  for (const integration of integrationData) {
    // Make API call to OpenAI with the user's message and integration data
    // Append the response from OpenAI to the overall response
    response += `Response for integration ${integration.integration_id}: ...`;
  }

  return response;
};

export async function getUserChatSessions() {
    const supabase = createClient();
  
    const { data: sessions, error } = await supabase
      .from("user_chat_sessions")
      .select("id, session_name, start_time")
      .order("start_time", { ascending: false });
  
    if (error) {
      console.error("Error fetching chat sessions:", error);
      throw error;
    }
  
    return sessions;
  }
  
  export async function getUserChatSessionMessages(sessionId: string) {
    const supabase = createClient();
  
    const { data: messages, error } = await supabase
      .from("user_chat_messages")
      .select("message_type, message_content, timestamp")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true });
  
    if (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
  
    return messages;
  }
  

  export async function deleteChatSession(sessionId: string) {
    const supabase = createClient();
  
    const { error } = await supabase
      .from("user_chat_sessions")
      .delete()
      .eq("id", sessionId);
  
    if (error) {
      console.error("Error deleting chat session:", error);
      throw error;
    }
  }

  export async function getUserIdByEmail(email: string) {
    const supabase = createClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
  
    if (error) {
      console.error("Error fetching user ID:", error);
      throw error;
    }
  
    return user.id;
  }
  
  export async function addUserChatSession(userEmail: string, sessionName: string) {
    const supabase = createClient();
    const userId = await getUserIdByEmail(userEmail);
  
    const { data: session, error } = await supabase
      .from("user_chat_sessions")
      .insert({ user_id: userId, session_name: sessionName })
      .single();
  
    if (error) {
      console.error("Error adding chat session:", error);
      throw error;
    }
  
    return session;
  }
  
  export async function addUserChatMessage(
    sessionId: string,
    messageType: string,
    messageContent: string
  ) {
    const supabase = createClient();
  
    const { data: message, error } = await supabase
      .from("user_chat_messages")
      .insert({
        session_id: sessionId,
        message_type: messageType,
        message_content: messageContent,
      })
      .single();
  
    if (error) {
      console.error("Error adding chat message:", error);
      throw error;
    }
  
    return message;
  }