import { initializeApp } from 'firebase/app'

import { getFirestore } from 'firebase/firestore'

import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDxMLKqK7jIyCWWom16cP4iWDGKhEV1X9A",
  authDomain: "kalrav-clinic.firebaseapp.com",
  projectId: "kalrav-clinic",
  storageBucket: "kalrav-clinic.firebasestorage.app",
  messagingSenderId: "532419788646",
  appId: "1:532419788646:web:52a3db654fad10f7d892a7"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)