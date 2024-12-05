/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseConfig } from './config/firebaseConfig'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


export let firebaseApp: FirebaseApp | undefined;
export const initializeFirebase = () => {
  firebaseApp = initializeApp({
    apiKey: FirebaseConfig.config.apiKey,
    authDomain: FirebaseConfig.config.authDomain,
    databaseURL: FirebaseConfig.config.databaseURL,
    projectId: FirebaseConfig.config.projectId,
    storageBucket: FirebaseConfig.config.storageBucket,
  });
  const auth = getAuth(firebaseApp);

  signInWithEmailAndPassword(auth, FirebaseConfig.auth.mail, FirebaseConfig.auth.password).catch((error) => {
    console.log(error)
  })
}
