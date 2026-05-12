import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

import { db } from './firebase'

const patientRef =
  collection(db, 'patients')

/* ADD PATIENT */
export const addPatient =
  async (data) => {

    await addDoc(
      patientRef,

      {
        ...data,

        /* PAYMENT SYSTEM */
        walletBalance: 0,

        pendingDue: 0,

        totalPaid: 0,

        sessionFee:
          data.sessionFee || 500
      }
    )
  }

/* GET PATIENTS */
export const getPatients =
  async () => {

    const snapshot =
      await getDocs(
        patientRef
      )

    return snapshot.docs.map(
      (docItem) => {

        const patientData =
          docItem.data()

        return {

          id: docItem.id,

          ...patientData,

          /* SAFE FALLBACKS */
          walletBalance:
            Number(
              patientData.walletBalance || 0
            ),

          pendingDue:
            Number(
              patientData.pendingDue || 0
            ),

          totalPaid:
            Number(
              patientData.totalPaid || 0
            ),

          sessionFee:
            Number(
              patientData.sessionFee || 500
            )
        }
      }
    )
  }

/* UPDATE PATIENT */
export const updatePatient =
  async (
    id,
    data
  ) => {

    const patientDoc =
      doc(
        db,
        'patients',
        id
      )

    await updateDoc(
      patientDoc,
      data
    )
  }

/* DELETE PATIENT */
export const deletePatient =
  async (id) => {

    const patientDoc =
      doc(
        db,
        'patients',
        id
      )

    await deleteDoc(
      patientDoc
    )
  }