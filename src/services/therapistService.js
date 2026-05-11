import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  setDoc
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth'

import {
  db
} from './firebase'

const therapistRef =
  collection(
    db,
    'therapists'
  )

export const addTherapist =
  async (data) => {

    const auth =
      getAuth()

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

    const user =
      userCredential.user

    await setDoc(
      doc(db, 'users', user.uid),
      {
        role:
          data.systemRole || 'therapist',

        email:
          data.email
      }
    )

    const therapistData = {
      ...data,
      uid: user.uid
    }

    delete therapistData.password
    delete therapistData.systemRole

    await addDoc(
      therapistRef,
      therapistData
    )
  }

export const getTherapists =
  async () => {

    const snapshot =
      await getDocs(
        therapistRef
      )

    return snapshot.docs.map(
      (docItem) => ({
        id: docItem.id,
        ...docItem.data()
      })
    )
  }

export const updateTherapist =
  async (id, data) => {

    const therapistDoc =
      doc(
        db,
        'therapists',
        id
      )

    await updateDoc(
      therapistDoc,
      data
    )
  }