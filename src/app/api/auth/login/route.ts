import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import type { User } from '@/lib/types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-fallback-super-secret-key-that-is-at-least-32-chars-long');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const { rows: users } = await db.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
    
    if (users.length === 0) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const user = users[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }
    
    const { password_hash, ...userWithoutPassword } = user;

    // Create JWT
    const token = await new jose.SignJWT({ email: user.email, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuedAt()
      .setIssuer('urn:investimax:issuer')
      .setAudience('urn:investimax:audience')
      .setExpirationTime('2h')
      .sign(secret);
      
    cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
    });


    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('[LOGIN_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
