import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore'

import { db } from './firebase'

const therapistRef =
  collection(
    db,
    'therapists'
  )

export const addTherapist =
  async (data) => {

    await addDoc(
      therapistRef,
      data
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