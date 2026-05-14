import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

import { db } from './firebase'

/* USING SESSIONS COLLECTION */
const appointmentRef =
  collection(db, 'sessions')

/* ADD */
export const addAppointment =
  async (data) => {

    await addDoc(
      appointmentRef,
      data
    )
  }

/* GET */
export const getAppointments =
  async () => {

    const snapshot =
      await getDocs(
        appointmentRef
      )

    return snapshot.docs.map(
      (docItem) => {

        const data =
          docItem.data()

        return {

          id: docItem.id,

          ...data,

          patient:
            data.patient ||
            data.patientName ||
            '',

          therapist:
            data.therapist ||
            data.therapistName ||
            ''
        }
      }
    )
  }

/* UPDATE */
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

/* DELETE */
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