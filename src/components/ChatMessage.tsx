import { Bot, User } from "lucide-react";
import { Message } from "@/lib/chat";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 px-4 py-5 ${isUser ? "bg-chat-user" : "bg-chat-ai"}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isUser ? "bg-secondary" : "bg-primary/20"}`}>
        {isUser ? (
          <User className="h-4 w-4 text-secondary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          {isUser ? "You" : "Gemini AI"}
        </p>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {message.content}
        </div>
      </div>
    </div>
  );
}
