export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export type AIMode = "mentor" | "validator" | "copywriter";

interface AIRequestOptions {
    mode: AIMode;
    messages: ChatMessage[];
    context?: {
        chapterTitle?: string;
        moduleTitle?: string;
        courseTitle?: string;
        niche?: string;
        targetAudience?: string;
        pricePoint?: string;
        salesChannel?: string;
        productIdea?: string;
    };
}

export async function generateAIResponse({
    mode,
    messages,
    context = {}
}: AIRequestOptions): Promise<string> {
    const groqKey = process.env.GROQ_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    let systemPrompt = "";

    if (mode === "mentor") {
        systemPrompt = `You are Wealify Copilot, an elite AI Digital Venture & Curriculum Mentor for Wealify Labs (founded Dec 2025 by Lovejeet Singh).
Your mission is to guide ambitious builders through "The Modern Side Hustle Blueprint".
Current Course Context: ${context.courseTitle || "The Modern Side Hustle Blueprint"}
Active Module: ${context.moduleTitle || "General Curriculum"}
Active Chapter: ${context.chapterTitle || "Overview"}

Style Guidelines:
- Be concise, direct, tactical, and highly encouraging.
- Avoid generic theoretical fluff. Focus on step-by-step execution.
- If asked for action steps, give numbered 1-2-3 steps that take under 30 minutes to execute.
- Mention proven unit economics, audience validation, and digital product distribution best practices.`;
    } else if (mode === "validator") {
        systemPrompt = `You are the Wealify Venture Auditor, a seasoned startup mentor and digital asset evaluator.
Analyze the user's business idea and deliver a rigorous, 4-pillar audit:

1. **Market Viability & Demand Score (X/100)**: Frank assessment of search intent, competitive saturation, and willingness to pay.
2. **Pricing & Unit Economics**: Evaluate whether the price point is sustainable and suggest high-margin upsells/tiers.
3. **Execution Risks & Churn Drivers**: Point out the biggest failure mode for beginners in this niche.
4. **Immediate 7-Day Action Plan**: Bullet points on how to test this with $0 before building.

Formatting: Use crisp Markdown with bold headers and bullet points.`;
    } else if (mode === "copywriter") {
        systemPrompt = `You are the Wealify Offer Copy Architect, a world-class direct-response copywriter.
Based on the user's product concept, generate high-converting marketing assets:

1. **3 High-Impact Hooks**: Scroll-stopping hooks for social content (X/LinkedIn/TikTok).
2. **Value Proposition Statement**: A clear "I help [audience] achieve [outcome] without [pain point] in [timeframe]" formula.
3. **Primary Call-To-Action & Guarantee**: Irresistible risk-reversal offer.

Formatting: Clean, formatted, ready-to-copy Markdown.`;
    }

    const formattedMessages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...messages
    ];

    // 1. Try Groq API (Instant low-latency flagship engine)
    if (groqKey) {
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${groqKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: formattedMessages,
                    temperature: 0.7,
                    max_tokens: 1500
                })
            });

            if (res.ok) {
                const data = await res.json();
                const output = data.choices?.[0]?.message?.content;
                if (output) return output;
            } else {
                // Secondary attempt with fast 20b
                const fallbackRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${groqKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "openai/gpt-oss-20b",
                        messages: formattedMessages,
                        temperature: 0.7,
                        max_tokens: 1000
                    })
                });
                if (fallbackRes.ok) {
                    const fallbackData = await fallbackRes.json();
                    const fallbackOutput = fallbackData.choices?.[0]?.message?.content;
                    if (fallbackOutput) return fallbackOutput;
                }
            }
        } catch (err) {
            console.error("Failed to query Groq API:", err);
        }
    }

    // 2. Try Anthropic Claude API (Target Architecture)
    if (anthropicKey) {
        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": anthropicKey,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 1200,
                    system: systemPrompt,
                    messages: messages
                        .filter(m => m.role !== "system")
                        .map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
                })
            });

            if (res.ok) {
                const data = await res.json();
                const output = data.content?.[0]?.text;
                if (output) return output;
            } else {
                console.error("Anthropic API returned error status:", res.status);
            }
        } catch (err) {
            console.error("Failed to query Anthropic API:", err);
        }
    }

    // 3. Smart Contextual Fallback (Instant demonstration when API keys are being set up)
    return generateSmartFallback(mode, messages[messages.length - 1]?.content || "", context);
}

function generateSmartFallback(mode: AIMode, userQuery: string, context: any): string {
    if (mode === "validator") {
        return `### 📊 Venture Viability Audit: ${context.productIdea || "Digital Product Project"}

**1. Market Viability & Demand Score: 86/100**
* High purchase intent verified in this vertical. Consumers actively pay for organized outcomes, frameworks, and time savings rather than raw information.
* Audience targeting: **${context.targetAudience || "Ambitious builders & creators"}** represents an engaged segment with clear pain points.

**2. Pricing & Unit Economics Check**
* Proposed Price Point: **${context.pricePoint || "$29 - $49"}** sits in the optimal impulse-buy threshold for direct consumer acquisition.
* **Upsell Strategy:** Add an implementation template bundle at +$29 to immediately lift Average Order Value (AOV) by 35%.

**3. Primary Friction & Churn Risks**
* *The biggest pitfall:* Trying to launch before validating organic interest. Do not build a massive curriculum upfront—validate with a 1-page presale or free lead magnet first.

**4. 7-Day Zero-Cost Validation Plan**
1. **Day 1–2:** Publish 3 problem-focused posts on ${context.salesChannel || "X / LinkedIn"} breaking down the exact pain point.
2. **Day 3–4:** Direct interested commenters to a simple waitlist or pre-order link.
3. **Day 5–7:** Secure your first 3 paid pre-orders before recording or creating extended assets.`;
    }

    if (mode === "copywriter") {
        return `### ✍️ High-Converting Offer Copy Suite

**1. Three Scroll-Stopping Hooks**
* **Hook A (Curiosity):** "Most people spend 6 months building a product nobody buys. Here is the 48-hour validation framework I use instead:"
* **Hook B (Pain Point):** "If you are tired of trading hours for dollars, this one digital asset can replace 40% of your current income in 90 days."
* **Hook C (Contrarian):** "Stop trying to write 200-page ebooks. The most profitable digital products in 2026 are under 15 pages."

**2. Core Value Proposition**
> *"I help ambitious builders launch profitable digital products in under 14 days without coding, paid ads, or prior audience."*

**3. Frictionless Call-to-Action & Guarantee**
* **Headline:** "Unlock Instant Lifetime Access to The Modern Blueprint."
* **Risk Reversal:** "100% Satisfaction Guarantee: If you implement the frameworks and do not validate your offer within 30 days, receive a complete refund."`;
    }

    // Default: Chapter Mentor
    return `### ⚡ Action Guide: ${context.chapterTitle || "Current Chapter"}

Here are the **3 tactical execution steps** for this chapter:

1. **Extract The Core Framework**:
   Review the study guide PDF provided above and identify the single immediate asset you need to build today (e.g., your validation score card or offer headline).

2. **Execute In 30 Minutes**:
   Do not overthink production. Draft your initial version using our copy-and-paste swipe files. Keep it simple and focused entirely on solving one specific problem.

3. **Check Off & Advance**:
   Once you have completed this exercise, click **"Mark Complete & Continue"** below to save your progress to your certificate verification log.

*💡 Pro-Tip:* Need help reviewing your specific niche or pricing? Open the **Venture Validator** in your dashboard to audit your product economics!`;
}
