import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

import { db } from './firebase'

/* CORRECT COLLECTION */
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

          /* BACKWARD COMPATIBILITY */
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

/* DELETE SINGLE */
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
          (docItem) => {

            const data =
              docItem.data()

            return (
              data.patient === patientName ||
              data.patientName === patientName
            )
          }
        )

      for (const appointment of patientAppointments) {

        const appointmentDoc =
          doc(
            db,
            'sessions',
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