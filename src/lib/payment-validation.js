export function verifiedPayment(intent, transaction, uid) {
 const cents=Math.round(Number(transaction.price)*100);
 return intent?.status==='succeeded' && intent.livemode===false && Number.isSafeInteger(cents) && cents>0 &&
  intent.amount===cents && intent.amount_received===cents && intent.currency==='usd' &&
  intent.metadata?.transactionId===transaction.transaction_id && intent.metadata?.buyerId===uid;
}
