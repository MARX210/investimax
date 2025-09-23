'use server';

import { cookies } from 'next/headers';
import * as jose from 'jose';
import type { User } from './types';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-fallback-super-secret-key-that-is-at-least-32-chars-long'
);
const issuer = 'urn:investimax:issuer';
const audience = 'urn:investimax:audience';

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jose.jwtVerify(cookie, secret, {
      issuer,
      audience,
    });

    const user: User = {
      id: payload.sub!,
      email: payload.email as string,
      name: payload.name as string,
    };

    return user;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}
