import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

import { db } from './firebase'

const sessionRef =
  collection(db, 'sessionHistory')

/* ADD */
export const addSession =
  async (data) => {

    await addDoc(
      sessionRef,
      data
    )
  }

/* GET */
export const getPatientSessions =
  async (patientName) => {

    const q = query(
      sessionRef,
      where(
        'patient',
        '==',
        patientName
      )
    )

    const snapshot =
      await getDocs(q)

    return snapshot.docs.map(
      (docItem) => ({
        id: docItem.id,
        ...docItem.data()
      })
    )
  }

/* UPDATE */
export const updateSession =
  async (id, data) => {

    const sessionDoc =
      doc(
        db,
        'sessionHistory',
        id
      )

    await updateDoc(
      sessionDoc,
      data
    )
  }

/* DELETE */
export const deleteSession =
  async (id) => {

    const sessionDoc =
      doc(
        db,
        'sessionHistory',
        id
      )

    await deleteDoc(
      sessionDoc
    )
  }