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

/* ADD THERAPIST */
export const addTherapist =
  async (data) => {

    let uid = null

    if (
      data.email &&
      data.password
    ) {

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

      uid = user.uid

      await setDoc(
        doc(db, 'users', user.uid),
        {
          role:
            data.systemRole || 'therapist',

          email:
            data.email
        }
      )
    }

    const therapistData = {
      ...data,
      uid
    }

    delete therapistData.password
    delete therapistData.systemRole

    await addDoc(
      therapistRef,
      therapistData
    )
  }

/* GET THERAPISTS */
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

/* UPDATE THERAPIST */
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