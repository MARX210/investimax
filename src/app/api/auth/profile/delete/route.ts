import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function DELETE() {
  try {
    const user = await getSession();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete user's data first (assuming no foreign key cascades for simplicity, 
    // though Cascade is better in production)
    await db.query('DELETE FROM transactions WHERE user_id = $1', [user.id]);
    await db.query('DELETE FROM investments WHERE user_id = $1', [user.id]);
    await db.query('DELETE FROM users WHERE id = $1', [user.id]);

    const cookieStore = await cookies();
    cookieStore.delete('session');

    return NextResponse.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('[PROFILE_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
