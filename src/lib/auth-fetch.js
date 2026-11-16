import { auth } from './firebase';
export async function authFetch(url, options={}) {
 if(auth) await auth.authStateReady();
 const headers=new Headers(options.headers);
 if(auth?.currentUser)headers.set('Authorization',`Bearer ${await auth.currentUser.getIdToken()}`);
 return fetch(url,{...options,headers});
}
