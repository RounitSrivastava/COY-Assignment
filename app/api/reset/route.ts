import { NextResponse } from 'next/server';
import { resetDemo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    resetDemo();
    return NextResponse.json({
      success: true,
      message: 'Demo state reset successfully. Feed refreshed with all 32 profiles.',
    });
  } catch (error) {
    console.error('Error resetting demo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset demo state' },
      { status: 500 }
    );
  }
}
