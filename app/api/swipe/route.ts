import { NextRequest, NextResponse } from 'next/server';
import { recordSwipe } from '@/lib/db';
import { SwipeAction } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.profileId || !body.action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: profileId and action ("like" or "pass")',
        },
        { status: 400 }
      );
    }

    const { profileId, action } = body as { profileId: string; action: SwipeAction };

    if (action !== 'like' && action !== 'pass') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Must be "like" or "pass"',
        },
        { status: 400 }
      );
    }

    const { isMatch, match } = recordSwipe(profileId, action);

    return NextResponse.json({
      success: true,
      action,
      isMatch,
      match: match || null,
      message: isMatch
        ? `It's a match! You and ${match?.profile.name} liked each other.`
        : `Swipe recorded as ${action}.`,
    });
  } catch (error: any) {
    console.error('Error processing swipe:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process swipe',
      },
      { status: 500 }
    );
  }
}
