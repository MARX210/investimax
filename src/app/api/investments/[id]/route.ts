import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Investment } from '@/lib/types';

// UPDATE an investment
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;

  try {
    const body: Omit<Investment, 'id'> = await req.json();
    const { type, amount, yieldRate, startDate } = body;

     if (!type || !amount || !yieldRate || !startDate) {
        return new NextResponse('Missing required fields', { status: 400 });
    }
    
    const { rows: updatedInvestment } = await db.query(
      'UPDATE investments SET type = $1, amount = $2, yield_rate = $3, start_date = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [type, amount, yieldRate, startDate, id, user.id]
    );

    if (updatedInvestment.length === 0) {
      return new NextResponse('Investment not found or user not authorized', { status: 404 });
    }

    return NextResponse.json(updatedInvestment[0]);
  } catch (error) {
    console.error('[INVESTMENT_PUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE an investment
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;

  try {
    const result = await db.query(
      'DELETE FROM investments WHERE id = $1 AND user_id = $2',
      [id, user.id]
    );

    if (result.rowCount === 0) {
      return new NextResponse('Investment not found or user not authorized', { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('[INVESTMENT_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
