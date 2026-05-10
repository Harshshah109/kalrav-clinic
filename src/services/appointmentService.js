import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore'

import { db } from './firebase'

const appointmentRef =
  collection(db, 'sessions')

export const addAppointment =
  async (data) => {

    await addDoc(
      appointmentRef,
      data
    )
  }

export const getAppointments =
  async () => {

    const snapshot =
      await getDocs(
        appointmentRef
      )

    return snapshot.docs.map(
      (docItem) => ({
        id: docItem.id,
        ...docItem.data()
      })
    )
  }

export const updateAppointment =
  async (id, data) => {

    const appointmentDoc =
      doc(
        db,
        'sessions',
        id
      )

    await updateDoc(
      appointmentDoc,
      data
    )
  }

export const deleteAppointment =
  async (id) => {

    const appointmentDoc =
      doc(
        db,
        'sessions',
        id
      )

    await deleteDoc(
      appointmentDoc
    )
  }

export const deleteAppointmentsByPatient =
  async (patientName) => {

    const q = query(
      appointmentRef,
      where(
        'patient',
        '==',
        patientName
      )
    )

    const snapshot =
      await getDocs(q)

    const deletePromises =
      snapshot.docs.map(
        (docItem) =>
          deleteDoc(docItem.ref)
      )

    await Promise.all(
      deletePromises
    )
  }