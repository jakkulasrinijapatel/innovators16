import { useState, useRef, useEffect } from "react";
import { Bot, Plus, Sparkles } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Message, streamChat } from "@/lib/chat";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      upsertAssistant("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
       <header className="flex items-center gap-3 border-b border-border px-6 py-4">
         <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
           <Sparkles className="h-5 w-5 text-primary" />
         </div>
         <div className="flex-1">
           <h1 className="text-lg font-semibold text-foreground">Gemini AI Dashboard</h1>
           <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
         </div>
         {messages.length > 0 && (
           <button
             onClick={() => { setMessages([]); setIsLoading(false); }}
             className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
           >
             <Plus className="h-4 w-4" />
             New Chat
           </button>
         )}
       </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">How can I help you?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask me anything — I'm powered by Google Gemini AI.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl divide-y divide-border">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 bg-chat-ai px-4 py-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default Index;
