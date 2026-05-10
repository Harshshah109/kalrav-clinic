import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

import { db } from './firebase'

const patientRef = collection(db, 'patients')

export const addPatient = async (data) => {
  await addDoc(patientRef, data)
}

export const getPatients = async () => {

  const snapshot = await getDocs(patientRef)

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }))
}

export const updatePatient = async (
  id,
  data
) => {

  const patientDoc = doc(
    db,
    'patients',
    id
  )

  await updateDoc(patientDoc, data)
}

export const deletePatient = async (
  id
) => {

  const patientDoc = doc(
    db,
    'patients',
    id
  )

  await deleteDoc(patientDoc)
}