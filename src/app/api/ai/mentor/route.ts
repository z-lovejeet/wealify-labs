import { NextResponse } from "next/server";
import { generateAIResponse, AIMode, ChatMessage } from "@/lib/ai/provider";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { mode = "mentor", messages = [], context = {} } = body;

        // Verify session (optional gate for authenticated students)
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Messages array is required." },
                { status: 400 }
            );
        }

        const validModes: AIMode[] = ["mentor", "validator", "copywriter"];
        const selectedMode: AIMode = validModes.includes(mode) ? mode : "mentor";

        const reply = await generateAIResponse({
            mode: selectedMode,
            messages: messages as ChatMessage[],
            context: {
                ...context,
                userId: user?.id,
                userEmail: user?.email
            }
        });

        return NextResponse.json({
            success: true,
            reply,
            mode: selectedMode,
            model: process.env.GROQ_API_KEY
                ? "groq-llama-3.3-70b"
                : process.env.ANTHROPIC_API_KEY
                ? "claude-5-5-sonnet"
                : "wealify-intelligence-engine"
        });
    } catch (error: any) {
        console.error("AI Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process AI request." },
            { status: 500 }
        );
    }
}
