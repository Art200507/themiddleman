export async function authenticate(request) {
 const token=request.headers.get('authorization')?.match(/^Bearer ([^ ]+)$/)?.[1];
 if(!token)throw Object.assign(new Error('Sign in required'),{status:401});
 const key=process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
 if(!key)throw Object.assign(new Error('Authentication is not configured'),{status:503});
 let response;
 try { response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(key)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:token}),signal:AbortSignal.timeout(10000),cache:'no-store'}); }
 catch {throw Object.assign(new Error('Authentication is unavailable'),{status:503});}
 if(!response.ok)throw Object.assign(new Error('Invalid or expired session'),{status:401});
 const data=await response.json();const user=data.users?.[0];
 if(!user?.localId)throw Object.assign(new Error('Invalid session'),{status:401});
 return {uid:user.localId,name:user.displayName||'',email:user.email||''};
}
