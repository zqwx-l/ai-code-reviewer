import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY || "",
  baseURL: "https://api.xiaomimimo.com/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || code.trim().length === 0) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const prompt = `You are an expert code reviewer. Review the following ${language || "code"} and provide structured feedback.

Return your review in this exact JSON format:
{
  "score": <number 1-10>,
  "summary": "<one sentence overall assessment>",
  "bugs": [{"severity": "high|medium|low", "line": "<line or range>", "issue": "<description>", "fix": "<suggested fix>"}],
  "improvements": [{"category": "performance|readability|maintainability|best-practice", "suggestion": "<description>"}],
  "security": [{"severity": "critical|high|medium|low", "issue": "<description>", "fix": "<suggested fix>"}],
  "positives": ["<what the code does well>"]
}

Code to review:
\`\`\`${language || ""}
${code}
\`\`\`

Return only valid JSON, no markdown, no extra text.`;

    const response = await client.chat.completions.create({
      model: "MiMo-V2.5-Pro",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "{}";

    // Parse JSON response
    let review;
    try {
      review = JSON.parse(content);
    } catch {
      // If not valid JSON, return raw
      review = { summary: content, score: null, bugs: [], improvements: [], security: [], positives: [] };
    }

    return NextResponse.json({ review });
  } catch (error: unknown) {
    console.error("Review error:", error);
    const message = error instanceof Error ? error.message : "Failed to review code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
