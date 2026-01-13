import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/mysql';
import { serializeTransaction } from '@/lib/transactions';

const generateTransactionId = () =>
  `escrow_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export async function POST(request) {
  try {
    const {
      transactionId,
      title,
      description,
      price,
      fileURL,
      fileName,
      sellerId,
      sellerName,
      sellerEmail
    } = await request.json();

    if (!title || !description || !price || !fileURL || !fileName || !sellerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const finalTransactionId = transactionId || generateTransactionId();

    await execute(
      `INSERT INTO transactions
        (transaction_id, title, description, price, file_url, file_name, seller_id, seller_name, seller_email, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        finalTransactionId,
        title,
        description,
        price,
        fileURL,
        fileName,
        sellerId,
        sellerName,
        sellerEmail
      ]
    );

    return NextResponse.json({
      success: true,
      transactionId: finalTransactionId
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const sellerId = searchParams.get('sellerId');
    const buyerId = searchParams.get('buyerId');

    if (transactionId) {
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

      return NextResponse.json({
        transaction: serializeTransaction(rows[0])
      });
    }

    if (sellerId) {
      const rows = await query(
        'SELECT * FROM transactions WHERE seller_id = ? ORDER BY created_at DESC',
        [sellerId]
      );

      return NextResponse.json({
        transactions: rows.map(serializeTransaction)
      });
    }

    if (buyerId) {
      const rows = await query(
        'SELECT * FROM transactions WHERE buyer_id = ? ORDER BY paid_at DESC',
        [buyerId]
      );

      return NextResponse.json({
        transactions: rows.map(serializeTransaction)
      });
    }

    return NextResponse.json(
      { error: 'Missing query parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
