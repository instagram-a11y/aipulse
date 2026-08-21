import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { text } = await generateText({
      model: google('gemini-flash-latest'),
      prompt: 'Reply only with: AI Pulse Gemini connection successful'
    });

    return Response.json({
      success: true,
      provider: 'gemini',
      response: text.trim()
    });
  } catch (error: unknown) {
    console.error('Gemini Health Check Error:', error);
    return Response.json({
      success: false,
      provider: 'gemini',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
