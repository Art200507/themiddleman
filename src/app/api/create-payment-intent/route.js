import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/server-auth';
import { query } from '@/lib/mysql';
import { testStripe } from '@/lib/server-stripe';
export async function POST(request) {
 try {
  const user=await authenticate(request);
  const {transactionId}=await request.json();
  if(typeof transactionId!=='string')return NextResponse.json({error:'Transaction ID required'},{status:400});
  const rows=await query('SELECT * FROM transactions WHERE transaction_id = ? LIMIT 1',[transactionId]);
  const transaction=rows[0];
  if(!transaction)return NextResponse.json({error:'Transaction not found'},{status:404});
  if(transaction.seller_id===user.uid || transaction.status!=='pending')return NextResponse.json({error:'Transaction cannot be purchased'},{status:409});
  const amount=Math.round(Number(transaction.price)*100);
  if(!Number.isSafeInteger(amount)||amount<50||amount>1000000)return NextResponse.json({error:'Invalid transaction price'},{status:400});
  const intent=await testStripe().paymentIntents.create({amount,currency:'usd',automatic_payment_methods:{enabled:true},metadata:{transactionId,buyerId:user.uid}},{idempotencyKey:`purchase:${transactionId}:${user.uid}`});
  return NextResponse.json({clientSecret:intent.client_secret,paymentIntentId:intent.id});
 } catch(error) {return NextResponse.json({error:'Unable to start test payment'},{status:error.status||500});}
}
