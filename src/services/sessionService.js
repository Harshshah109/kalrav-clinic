import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore'

import { db } from './firebase'

const sessionRef =
  collection(db, 'sessionHistory')

export const addSession =
  async (data) => {

    await addDoc(
      sessionRef,
      data
    )
  }

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