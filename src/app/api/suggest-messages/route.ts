// import { streamText } from "ai";
// import { openai } from "@ai-sdk/openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@/types/env";
import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//  try {
//      const prompt =   "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//      const result = streamText({
//        model: openai('gpt-3.5-turbo-instruct'),
//        prompt,
//      });

//      return result.toDataStreamResponse();
//  } catch (error) {
//         console.error('An unexpected error occurred:', error);
//         throw error;
//  }
// }

export async function POST(req: Request) {
 try {
   const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
   const prompt =
     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
 
   const result = await model.generateContent(prompt);

   return NextResponse.json({ success: true, result: result.response.text()}, { status: 200 });
 
   console.log(result.response.text());
 } catch (error) {
    console.error('An unexpected error occurred:', error);
    throw error;
 }
}
