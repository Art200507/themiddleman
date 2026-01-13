import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/mysql';

export async function POST(request) {
  try {
    const { transactionId, paymentIntentId, buyerId, buyerName, buyerEmail } = await request.json();

    // Validate the request
    if (!transactionId || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Transaction ID and Payment Intent ID are required' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT id FROM transactions WHERE transaction_id = ? LIMIT 1',
      [transactionId]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    await execute(
      `UPDATE transactions
       SET status = 'paid',
           buyer_id = ?,
           buyer_name = ?,
           buyer_email = ?,
           paid_at = NOW(),
           payment_intent_id = ?,
           escrow_release_time = DATE_ADD(NOW(), INTERVAL 24 HOUR)
       WHERE transaction_id = ?`,
      [buyerId, buyerName, buyerEmail, paymentIntentId, transactionId]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully'
    });

  } catch (error) {
    console.error('Error processing payment success:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 
