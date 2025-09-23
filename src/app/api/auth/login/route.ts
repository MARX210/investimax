import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    // Find user by email
    const { rows: users } = await db.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
    
    if (users.length === 0) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const user = users[0];

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    // Return user data (without the password hash)
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('[LOGIN_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
