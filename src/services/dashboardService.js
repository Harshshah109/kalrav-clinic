import {
  collection,
  getDocs
} from 'firebase/firestore'

import { db } from './firebase'

export const getDashboardStats = async () => {

  // Collections
  const patientSnapshot = await getDocs(
    collection(db, 'patients')
  )

  const appointmentSnapshot = await getDocs(
    collection(db, 'appointments')
  )

  const therapistSnapshot = await getDocs(
    collection(db, 'therapists')
  )

  // Counts
  const totalPatients = patientSnapshot.size

  const totalAppointments =
    appointmentSnapshot.size

  const totalTherapists =
    therapistSnapshot.size

  // Appointments Data
  const appointments = appointmentSnapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data()
    })
  )

  return {
    totalPatients,
    totalAppointments,
    totalTherapists,
    appointments
  }
}