import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { code, language, apiKey } = await req.json();

  if (!apiKey || apiKey.trim().length === 0) {
    return NextResponse.json({ error: "MiMo API key is required" }, { status: 401 });
  }

  if (!code || code.trim().length === 0) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const client = new OpenAI({
    apiKey: apiKey.trim(),
    baseURL: "https://api.xiaomimimo.com/v1",
  });

  try {
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

    let review;
    try {
      review = JSON.parse(content);
    } catch {
      review = { summary: content, score: null, bugs: [], improvements: [], security: [], positives: [] };
    }

    return NextResponse.json({ review });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to review code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
