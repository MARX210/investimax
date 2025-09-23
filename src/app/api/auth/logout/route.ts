import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    cookies().delete('session');
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('[LOGOUT_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
