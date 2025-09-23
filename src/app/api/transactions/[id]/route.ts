import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Transaction } from '@/lib/types';

// UPDATE a transaction
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;

  try {
    const body: Omit<Transaction, 'id'> = await req.json();
    const { type, amount, description, category, date, paymentMethod, isRecurring } = body;

     if (!type || !amount || !description || !category || !date) {
        return new NextResponse('Missing required fields', { status: 400 });
    }
    
    const { rows: updatedTransaction } = await db.query(
      'UPDATE transactions SET type = $1, amount = $2, description = $3, category = $4, date = $5, payment_method = $6, is_recurring = $7 WHERE id = $8 AND user_id = $9 RETURNING *',
      [type, amount, description, category, date, paymentMethod, isRecurring || false, id, user.id]
    );

    if (updatedTransaction.length === 0) {
      return new NextResponse('Transaction not found or user not authorized', { status: 404 });
    }

    return NextResponse.json(updatedTransaction[0]);
  } catch (error) {
    console.error('[TRANSACTION_PUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE a transaction
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;

  try {
    const result = await db.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [id, user.id]
    );

    if (result.rowCount === 0) {
      return new NextResponse('Transaction not found or user not authorized', { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('[TRANSACTION_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
