import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/mysql';
import deepseekAI from '@/lib/deepseek';
import { serializeTransaction } from '@/lib/transactions';

export async function POST(request) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
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

    const transactionData = serializeTransaction(rows[0]);

    // Perform AI fraud detection
    const fraudAnalysis = await deepseekAI.detectFraud(transactionData);

    // Update transaction with fraud analysis
    await execute(
      `UPDATE transactions
       SET fraud_analysis = ?,
           fraud_checked_at = NOW()
       WHERE transaction_id = ?`,
      [JSON.stringify(fraudAnalysis), transactionId]
    );

    return NextResponse.json({
      success: true,
      fraudAnalysis: fraudAnalysis
    });

  } catch (error) {
    console.error('Fraud detection error:', error);
    return NextResponse.json(
      { error: 'Failed to perform fraud detection' },
      { status: 500 }
    );
  }
} 
