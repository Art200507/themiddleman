import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/server-auth';
import { query,execute } from '@/lib/mysql';
import { testStripe } from '@/lib/server-stripe';
import { verifiedPayment } from '@/lib/payment-validation';
export async function POST(request) {
 try {
  const user=await authenticate(request);
  const {transactionId,paymentIntentId}=await request.json();
  if(typeof transactionId!=='string'||typeof paymentIntentId!=='string')return NextResponse.json({error:'Transaction and payment IDs required'},{status:400});
  const rows=await query('SELECT * FROM transactions WHERE transaction_id = ? LIMIT 1',[transactionId]);
  const transaction=rows[0];
  if(!transaction)return NextResponse.json({error:'Transaction not found'},{status:404});
  const intent=await testStripe().paymentIntents.retrieve(paymentIntentId);
  if(!verifiedPayment(intent,transaction,user.uid))return NextResponse.json({error:'Payment could not be verified'},{status:400});
  if(transaction.status==='paid'&&transaction.payment_intent_id===intent.id&&transaction.buyer_id===user.uid)return NextResponse.json({success:true});
  const result=await execute(`UPDATE transactions SET status='paid',buyer_id=?,buyer_name=?,buyer_email=?,paid_at=NOW(),payment_intent_id=?,escrow_release_time=DATE_ADD(NOW(),INTERVAL 24 HOUR) WHERE transaction_id=? AND status='pending'`,[user.uid,user.name,user.email,intent.id,transactionId]);
  if(result.affectedRows!==1)return NextResponse.json({error:'Transaction state changed. Contact support.'},{status:409});
  return NextResponse.json({success:true,message:'Test payment verified'});
 } catch(error) {return NextResponse.json({error:'Unable to verify payment'},{status:error.status||500});}
}
