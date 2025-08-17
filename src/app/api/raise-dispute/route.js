import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

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

    // Find the transaction
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
    const transactionData = transactionDoc.data();

    // Check if transaction is in paid status
    if (transactionData.status !== 'paid') {
      return NextResponse.json(
        { error: 'Can only dispute paid transactions' },
        { status: 400 }
      );
    }

    // Check if buyer is the one raising the dispute
    if (transactionData.buyerId !== buyerId) {
      return NextResponse.json(
        { error: 'Only the buyer can raise a dispute' },
        { status: 403 }
      );
    }

    // Check if dispute is within 24 hours
    const paidAt = transactionData.paidAt?.toDate();
    const now = new Date();
    const hoursSincePayment = (now - paidAt) / (1000 * 60 * 60);

    if (hoursSincePayment > 24) {
      return NextResponse.json(
        { error: 'Disputes can only be raised within 24 hours of payment' },
        { status: 400 }
      );
    }

    // Check if dispute already exists
    if (transactionData.disputeRaisedAt) {
      return NextResponse.json(
        { error: 'Dispute already raised for this transaction' },
        { status: 400 }
      );
    }

    // Update transaction with dispute information
    const transactionRef = doc(db, "transactions", transactionDoc.id);
    await updateDoc(transactionRef, {
      status: 'disputed',
      disputeRaisedAt: serverTimestamp(),
      disputeReason: reason,
      disputeDescription: description,
      disputeRaisedBy: buyerId,
      disputeRaisedByName: buyerName
    });

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