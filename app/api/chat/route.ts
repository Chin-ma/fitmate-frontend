import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a chat session
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    // Add fitness context to the prompt
    const contextualizedMessage = `As a fitness AI coach, help the user with their fitness journey. Consider workout plans, nutrition advice, and general fitness guidance. User's question: ${message}`;

    // Generate response
    const result = await chat.sendMessage(contextualizedMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 