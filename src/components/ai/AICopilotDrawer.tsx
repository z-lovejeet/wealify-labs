"use client";

import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    Send,
    Loader2,
    Copy,
    Check,
    RotateCcw,
    Zap,
    Cpu
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

interface AICopilotDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    chapterTitle?: string;
    moduleTitle?: string;
    courseTitle?: string;
}

export function AICopilotDrawer({
    isOpen,
    onOpenChange,
    chapterTitle = "Current Chapter",
    moduleTitle = "General Curriculum",
    courseTitle = "The Modern Side Hustle Blueprint"
}: AICopilotDrawerProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            content: `👋 **Welcome to your AI Curriculum Mentor!**\n\nI am analyzing **"${chapterTitle}"** (${moduleTitle}). Ask me anything about how to implement this framework, or choose a quick action below.`
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Update greeting when chapter changes
    useEffect(() => {
        if (chapterTitle) {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: `📌 Switched context to **"${chapterTitle}"**. What would you like to execute in this lesson?`
                }
            ]);
        }
    }, [chapterTitle]);

    const handleSend = async (customPrompt?: string) => {
        const query = (customPrompt || input).trim();
        if (!query || isLoading) return;

        setInput("");
        const newMessages: ChatMessage[] = [...messages, { role: "user", content: query }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai/mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "mentor",
                    messages: newMessages,
                    context: {
                        chapterTitle,
                        moduleTitle,
                        courseTitle
                    }
                })
            });

            const data = await res.json();
            if (data.reply) {
                setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                throw new Error(data.error || "Failed to receive response.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to connect to AI mentor.");
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "⚠️ I encountered a temporary connection issue. Please try again shortly or check your network."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const quickActions = [
        "Summarize this chapter into 3 action steps",
        "How do I price my product according to this lesson?",
        "What are common rookie mistakes in this step?",
        "Draft a high-converting offer for this concept"
    ];

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="p-0 w-full sm:max-w-md bg-[#050914] border-l border-white/[0.08] text-slate-100 flex flex-col z-50 shadow-2xl"
            >
                <SheetTitle className="sr-only">AI Curriculum Mentor</SheetTitle>
                <SheetDescription className="sr-only">Interactive AI Copilot for Course Chapters</SheetDescription>

                {/* Header */}
                <div className="p-5 border-b border-white/[0.08] bg-[#070c18] shrink-0 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                                    <span>Wealify Copilot</span>
                                    <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.2 rounded-full">
                                        Claude 5.5
                                    </span>
                                </h3>
                                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Cpu className="w-3 h-3 text-emerald-400" />
                                    <span>Active Context: {chapterTitle}</span>
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMessages([{
                                role: "assistant",
                                content: `Session reset. Ready for questions on **"${chapterTitle}"**.`
                            }])}
                            className="w-8 h-8 text-muted-foreground hover:text-white rounded-lg hover:bg-white/[0.06]"
                            title="Reset Conversation"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    {/* Active Context Chip */}
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground truncate">{moduleTitle}</span>
                        <span className="text-amber-400 font-mono text-[10px] shrink-0 font-bold ml-2">24/7 AI Tutor</span>
                    </div>
                </div>

                {/* Chat Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex flex-col gap-1 max-w-[92%]",
                                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap break-words shadow-sm relative group",
                                    msg.role === "user"
                                        ? "bg-amber-500 text-slate-950 font-medium rounded-tr-sm"
                                        : "bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-tl-sm"
                                )}
                            >
                                {msg.content}

                                {msg.role === "assistant" && (
                                    <button
                                        onClick={() => handleCopy(msg.content, i)}
                                        className="absolute bottom-2 right-2 p-1 rounded bg-black/40 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Copy message"
                                    >
                                        {copiedIndex === i ? (
                                            <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-3 h-3" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="mr-auto flex items-center gap-2 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            <span>Claude is analyzing chapter framework...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Strip */}
                <div className="px-4 py-2 border-t border-white/[0.06] bg-[#060a14] shrink-0">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                        <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                        {quickActions.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(prompt)}
                                disabled={isLoading}
                                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-muted-foreground hover:text-slate-200 transition-colors shrink-0 disabled:opacity-50"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/[0.08] bg-[#070c18] shrink-0">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex items-center gap-2"
                    >
                        <input
                            type="text"
                            placeholder={`Ask about ${chapterTitle}...`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-amber-400/50 transition-colors"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 transition-transform active:scale-95 disabled:opacity-40"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </form>
                    <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
                        Powered by Claude 5.5 Sonnet & Groq LPUs for rapid curriculum feedback.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
