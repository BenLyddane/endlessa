"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface ChatSession {
  id: string;
  session_name: string;
  start_time: string;
}

interface ChatSessionsProps {
  sessions: ChatSession[];
  onSessionClick: (sessionId: string) => void;
  currentSessionId: string | null;
  onNewSessionClick: () => void;
  onDeleteSessionClick: (sessionId: string) => void;
}

export const ChatSessions: React.FC<ChatSessionsProps> = ({
  sessions,
  onSessionClick,
  currentSessionId,
  onNewSessionClick,
  onDeleteSessionClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredChatSessions = sessions.filter((session) =>
    session.session_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Chat Sessions
        </h2>
        <Button onClick={onNewSessionClick}>New Session</Button>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search sessions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>
      <div className="overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChatSessions.map((session) => (
              <TableRow
                key={session.id}
                onClick={() => onSessionClick(session.id)}
                className={`cursor-pointer hover:bg-muted ${
                  currentSessionId === session.id ? "bg-muted" : ""
                }`}
              >
                <TableCell>{session.session_name}</TableCell>
                <TableCell>
                  {new Date(session.start_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSessionClick(session.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
