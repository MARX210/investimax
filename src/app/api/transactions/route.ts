import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Transaction } from '@/lib/types';

// GET all transactions for the logged-in user
export async function GET() {
  const user = await getSession();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { rows } = await db.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [user.id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[TRANSACTIONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new transaction for the logged-in user
export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body: Omit<Transaction, 'id'> = await req.json();
    const { type, description, category, date, paymentMethod, isRecurring } = body;
    const amount = parseFloat(body.amount as any);
    
    if (!type || !amount || !description || !category || !date) {
        return new NextResponse('Missing required fields', { status: 400 });
    }

    const id = crypto.randomUUID();

    const { rows: newTransaction } = await db.query(
      'INSERT INTO transactions (id, user_id, type, amount, description, category, date, payment_method, is_recurring) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [id, user.id, type, amount, description, category, date, paymentMethod, isRecurring || false]
    );

    return NextResponse.json(newTransaction[0], { status: 201 });
  } catch (error) {
    console.error('[TRANSACTIONS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
