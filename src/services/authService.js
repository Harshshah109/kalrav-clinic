import {
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import {
  auth,
  db
} from './firebase'

export const loginUser = async (
  email,
  password
) => {

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

  const user =
    userCredential.user

  const userDoc =
    await getDoc(
      doc(db, 'users', user.uid)
    )

  const role =
    userDoc.exists()
      ? userDoc.data().role
      : 'therapist'

  return {
    ...user,
    role
  }
}

export const logoutUser =
  async () => {

    await signOut(auth)
  }