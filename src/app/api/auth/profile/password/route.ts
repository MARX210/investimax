import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const { rows } = await db.query('SELECT password_hash FROM users WHERE id = $1', [user.id]);
    if (rows.length === 0) {
      return new NextResponse('User not found', { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!isPasswordCorrect) {
      return new NextResponse('Senha atual incorreta', { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedNewPassword, user.id]);

    return NextResponse.json({ message: 'Password updated' });
  } catch (error) {
    console.error('[PROFILE_PASSWORD_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
