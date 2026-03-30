import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Investment } from '@/lib/types';

// GET all investments for the logged-in user
export async function GET() {
  const user = await getSession();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { rows } = await db.query(
      'SELECT * FROM investments WHERE user_id = $1 ORDER BY start_date DESC',
      [user.id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[INVESTMENTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new investment for the logged-in user
export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body: Omit<Investment, 'id'> = await req.json();
    const { type, startDate, yieldPeriod, maturityDate } = body;
    const amount = parseFloat(body.amount as any);
    const yieldRate = parseFloat(body.yieldRate as any);
    
    if (!type || isNaN(amount) || isNaN(yieldRate) || !startDate || !yieldPeriod) {
        return new NextResponse('Missing required fields or invalid data', { status: 400 });
    }

    const id = crypto.randomUUID();

    const { rows: newInvestment } = await db.query(
      'INSERT INTO investments (id, user_id, type, amount, yield_rate, yield_period, start_date, maturity_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, user.id, type, amount, yieldRate, yieldPeriod, startDate, maturityDate || null]
    );

    return NextResponse.json(newInvestment[0], { status: 201 });
  } catch (error) {
    console.error('[INVESTMENTS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
