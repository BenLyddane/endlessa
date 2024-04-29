// components/chat-window.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";

interface Message {
  content: string;
  sender: "user" | "assistant";
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export default function ChatWindow({
  messages,
  onSendMessage,
}: ChatWindowProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    onSendMessage(message);
    e.currentTarget.reset();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="message"
            placeholder="Type your message..."
            className="w-full"
          />
          <Button type="submit" className="mt-2">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
