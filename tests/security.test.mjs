import test from 'node:test';
import assert from 'node:assert/strict';
import {authenticate} from '../src/lib/server-auth.js';
import {verifiedPayment} from '../src/lib/payment-validation.js';
import {publicTransaction} from '../src/lib/transactions.js';
test('server auth rejects missing and forged tokens, derives real identity', async()=>{
 const request=token=>new Request('https://example.com',{headers:token?{Authorization:`Bearer ${token}`}:{}});
 await assert.rejects(authenticate(request()),e=>e.status===401);
 process.env.NEXT_PUBLIC_FIREBASE_API_KEY='test-config'; const original=global.fetch;
 try {
  global.fetch=async()=>({ok:false});await assert.rejects(authenticate(request('fake')),e=>e.status===401);
  global.fetch=async(url,init)=>{assert.equal(JSON.parse(init.body).idToken,'verified-token');return {ok:true,json:async()=>({users:[{localId:'real-uid',email:'owner@example.com'}]})};};
  assert.equal((await authenticate(request('verified-token'))).uid,'real-uid');
 }finally{global.fetch=original;delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;}
});
test('payment requires matching verified success, amount, currency, buyer and transaction',()=>{
 const transaction={transaction_id:'order',price:10};
 const intent={status:'succeeded',livemode:false,amount:1000,amount_received:1000,currency:'usd',metadata:{transactionId:'order',buyerId:'buyer'}};
 assert.equal(verifiedPayment(intent,transaction,'buyer'),true);
 for(const patch of [{status:'processing'},{amount:1},{amount_received:1},{currency:'eur'},{livemode:true},{metadata:{transactionId:'other',buyerId:'buyer'}},{metadata:{transactionId:'order',buyerId:'other'}}])assert.equal(verifiedPayment({...intent,...patch},transaction,'buyer'),false);
});
test('public transaction does not expose protected download or personal information',()=>{
 const row={transaction_id:'order',seller_id:'seller',buyer_id:'buyer',file_url:'private',seller_email:'private',payment_intent_id:'private'};
 const publicData=publicTransaction(row,'stranger');
 for(const key of ['fileURL','sellerEmail','buyerEmail','paymentIntentId'])assert.equal(key in publicData,false);
 assert.equal(publicTransaction(row,'seller').fileURL,'private');
});
