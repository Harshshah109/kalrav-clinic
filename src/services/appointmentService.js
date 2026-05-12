import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

import { db } from './firebase'

const appointmentRef =
  collection(db, 'appointments')

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
      (docItem) => ({

        id: docItem.id,

        ...docItem.data()
      })
    )
  }

/* UPDATE */
export const updateAppointment =
  async (id, data) => {

    const appointmentDoc =
      doc(
        db,
        'appointments',
        id
      )

    await updateDoc(
      appointmentDoc,
      data
    )
  }

/* DELETE SINGLE */
export const deleteAppointment =
  async (id) => {

    const appointmentDoc =
      doc(
        db,
        'appointments',
        id
      )

    await deleteDoc(
      appointmentDoc
    )
  }

/* DELETE ALL BY PATIENT */
export const deleteAppointmentsByPatient =
  async (patientName) => {

    try {

      const snapshot =
        await getDocs(
          appointmentRef
        )

      const patientAppointments =
        snapshot.docs.filter(
          (docItem) =>

            docItem.data().patient ===
            patientName
        )

      for (const appointment of patientAppointments) {

        const appointmentDoc =
          doc(
            db,
            'appointments',
            appointment.id
          )

        await deleteDoc(
          appointmentDoc
        )
      }

    } catch (err) {

      console.log(err)
    }
  }