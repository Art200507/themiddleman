import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

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

    // Find the transaction document by transactionId
    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("transactionId", "==", transactionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transactionDoc = querySnapshot.docs[0];
    const transactionRef = doc(db, "transactions", transactionDoc.id);

    // Update transaction status to paid
    await updateDoc(transactionRef, {
      status: 'paid',
      buyerId,
      buyerName,
      buyerEmail,
      paidAt: serverTimestamp(),
      paymentIntentId,
      escrowReleaseTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    });

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