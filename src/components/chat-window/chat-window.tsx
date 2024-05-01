"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MessageCircleMore, Send } from "lucide-react";
import { ChatSessions } from "./chat-sessions/chat-sessions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  processMessage,
  getUserAPIKey,
  getUserIntegrations,
  getUserChatSessions,
  getUserChatSessionMessages,
  addUserChatSession,
  addUserChatMessage,
  deleteChatSession,
} from "./chat_actions";

interface Message {
  content: string;
  sender: "user" | "assistant";
}

interface ChatSession {
  id: string;
  session_name: string;
  start_time: string;
}

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);
  const [hasActiveIntegration, setHasActiveIntegration] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error } = await supabase
        .from("users")
        .select("email, open_ai_api_key")
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUserEmail(userData.email);
        setHasOpenAIKey(userData.open_ai_api_key !== null);
      }

      const { data: integrationData, error: integrationError } = await supabase
        .from("user_integrations")
        .select("active")
        .eq("user_id", userData.id);

      if (integrationError) {
        console.error("Error fetching user integrations:", integrationError);
      } else {
        setHasActiveIntegration(
          integrationData.some((integration) => integration.active)
        );
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        const sessions = await getUserChatSessions();
        setChatSessions(sessions);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      }
    };

    fetchChatSessions();
  }, []);

  const toggleSheet = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      const openAIKey = await getUserAPIKey();
      if (!openAIKey) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>OpenAI API Key Required</CardTitle>
                  <CardDescription>
                    You need to set up your OpenAI API key to use the chat.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/api-keys">
                    <Button>Set up API key</Button>
                  </Link>
                </CardFooter>
              </Card>
            ),
            sender: "assistant",
          },
        ]);
        return;
      }

      const integrationData = await getUserIntegrations();
      if (integrationData.length === 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Integration Required</CardTitle>
                  <CardDescription>
                    You need to set up and activate an integration to use the
                    chat.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/integrations">
                    <Button>Set up integrations</Button>
                  </Link>
                </CardFooter>
              </Card>
            ),
            sender: "assistant",
          },
        ]);
        return;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { content: inputValue, sender: "user" },
      ]);
      setInputValue("");

      console.log("Calling processMessage with input:", inputValue);

      try {
        // Process the user's message and generate a response
        const response = await processMessage(inputValue);
        console.log("Response from processMessage:", response);

        setMessages((prevMessages) => [
          ...prevMessages,
          { content: response, sender: "assistant" },
        ]);

        // Save the user's message and the assistant's response to the current session
        if (currentSessionId) {
          await addUserChatMessage(currentSessionId, "user", inputValue);
          await addUserChatMessage(currentSessionId, "assistant", response);
        } else {
          // Create a new session if no current session exists
          const newSession = await addUserChatSession(userEmail, "New Session");
          setCurrentSessionId(newSession.id);
          setChatSessions((prevSessions) => [newSession, ...prevSessions]);
          await addUserChatMessage(newSession.id, "user", inputValue);
          await addUserChatMessage(newSession.id, "assistant", response);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const fetchChatMessages = async (sessionId: string) => {
    try {
      const messages = await getUserChatSessionMessages(sessionId);
      setMessages(
        messages.map((message) => ({
          content: message.message_content,
          sender: message.message_type as "user" | "assistant",
        }))
      );
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const createNewSession = async () => {
    try {
      const session = await addUserChatSession(userEmail, "New Session");
      setChatSessions((prevSessions) => [session, ...prevSessions]);
      fetchChatMessages(session.id);
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId);
      setChatSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== sessionId)
      );
      if (currentSessionId === sessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error("Error deleting chat session:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {!isMobile && chatSessions.length > 0 && (
        <div className="w-1/4 p-4 bg-muted">
          <ChatSessions
            sessions={chatSessions}
            onSessionClick={fetchChatMessages}
            currentSessionId={currentSessionId}
            onNewSessionClick={createNewSession}
            onDeleteSessionClick={deleteSession}
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {messages.length === 0 && !isFocused && (
              <div className="fixed inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-2 text-foreground">
                    Endlessa
                  </h1>
                  <p className="text-muted-foreground">Search your own data</p>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {typeof message.content === "string" ? (
                    <>
                      <p className="text-xs">
                        {message.sender === "user"
                          ? `${userEmail}:`
                          : "Endlessa:"}
                      </p>
                      <p className="text-sm">{message.content}</p>
                    </>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background">
          <form
            onSubmit={handleSubmit}
            className="flex items-center max-w-6xl mx-auto"
          >
            <div className="w-full relative">
              <Input
                id="search"
                placeholder="Search your own data..."
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="transition-all duration-500 ease-in-out"
              />
              <Button
                type="submit"
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
      {isMobile && chatSessions.length > 0 && (
        <>
          <button
            onClick={toggleSheet}
            className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-4"
          >
            <MessageCircleMore className="w-6 h-6" />
          </button>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent>
              <ChatSessions
                sessions={chatSessions}
                onSessionClick={fetchChatMessages}
                currentSessionId={currentSessionId}
                onNewSessionClick={createNewSession}
                onDeleteSessionClick={deleteSession}
              />
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
};
