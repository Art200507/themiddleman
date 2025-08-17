import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import deepseekAI from '@/lib/deepseek';

export async function POST(request) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Fetch transaction data
    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("transactionId", "==", transactionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transactionData = querySnapshot.docs[0].data();

    // Perform AI fraud detection
    const fraudAnalysis = await deepseekAI.detectFraud(transactionData);

    // Update transaction with fraud analysis
    const transactionRef = doc(db, "transactions", querySnapshot.docs[0].id);
    await updateDoc(transactionRef, {
      fraudAnalysis: fraudAnalysis,
      fraudCheckedAt: serverTimestamp()
    });

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