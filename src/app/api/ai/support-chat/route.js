import { NextResponse } from 'next/server';
import deepseekAI from '@/lib/deepseek';

export async function POST(request) {
  try {
    const { message, context = {} } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get AI support response
    const response = await deepseekAI.getSupportResponse(message, context);

    return NextResponse.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Support chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get support response' },
      { status: 500 }
    );
  }
} 