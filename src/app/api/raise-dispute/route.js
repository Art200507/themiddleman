import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/mysql';

export async function POST(request) {
  try {
    const { transactionId, reason, description, buyerId, buyerName } = await request.json();

    // Validate the request
    if (!transactionId || !reason || !description || !buyerId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT * FROM transactions WHERE transaction_id = ? LIMIT 1',
      [transactionId]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transactionData = rows[0];

    // Check if transaction is in paid status
    if (transactionData.status !== 'paid') {
      return NextResponse.json(
        { error: 'Can only dispute paid transactions' },
        { status: 400 }
      );
    }

    // Check if buyer is the one raising the dispute
    if (transactionData.buyer_id !== buyerId) {
      return NextResponse.json(
        { error: 'Only the buyer can raise a dispute' },
        { status: 403 }
      );
    }

    // Check if dispute is within 24 hours
    const paidAt = transactionData.paid_at ? new Date(transactionData.paid_at) : null;
    const now = new Date();
    const hoursSincePayment = paidAt ? (now - paidAt) / (1000 * 60 * 60) : Infinity;

    if (hoursSincePayment > 24) {
      return NextResponse.json(
        { error: 'Disputes can only be raised within 24 hours of payment' },
        { status: 400 }
      );
    }

    // Check if dispute already exists
    if (transactionData.dispute_raised_at) {
      return NextResponse.json(
        { error: 'Dispute already raised for this transaction' },
        { status: 400 }
      );
    }

    // Update transaction with dispute information
    await execute(
      `UPDATE transactions
       SET status = 'disputed',
           dispute_raised_at = NOW(),
           dispute_reason = ?,
           dispute_description = ?,
           dispute_raised_by = ?,
           dispute_raised_by_name = ?
       WHERE transaction_id = ?`,
      [reason, description, buyerId, buyerName, transactionId]
    );

    return NextResponse.json({
      success: true,
      message: 'Dispute raised successfully'
    });

  } catch (error) {
    console.error('Error raising dispute:', error);
    return NextResponse.json(
      { error: 'Failed to raise dispute' },
      { status: 500 }
    );
  }
} 
