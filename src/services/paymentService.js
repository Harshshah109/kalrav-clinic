import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

import { db } from './firebase'

const paymentRef =
  collection(db, 'payments')

/* ADD PAYMENT */
export const addPayment =
  async (data) => {

    await addDoc(
      paymentRef,
      data
    )
  }

/* GET PAYMENTS */
export const getPayments =
  async () => {

    const snapshot =
      await getDocs(
        paymentRef
      )

    return snapshot.docs.map(
      (docItem) => ({

        id: docItem.id,

        ...docItem.data()
      })
    )
  }

/* UPDATE PAYMENT */
export const updatePayment =
  async (id, data) => {

    const paymentDoc =
      doc(
        db,
        'payments',
        id
      )

    await updateDoc(
      paymentDoc,
      data
    )
  }

/* DELETE PAYMENT WITH ROLLBACK */
export const deletePayment =
  async (payment) => {

    try {

      const patientSnapshot =
        await getDocs(
          collection(db, 'patients')
        )

      const patient =
        patientSnapshot.docs.find(
          (docItem) =>

            docItem.data().name ===
            payment.patient
        )

      /* ROLLBACK */
      if (patient) {

        const patientData =
          patient.data()

        const currentWallet =
          Number(
            patientData.walletBalance || 0
          )

        const currentDue =
          Number(
            patientData.pendingDue || 0
          )

        const currentPaid =
          Number(
            patientData.totalPaid || 0
          )

        let updatedWallet =
          currentWallet

        let updatedDue =
          currentDue

        let updatedPaid =
          currentPaid

        const amount =
          Number(
            payment.amount || 0
          )

        const paymentType =
          payment.paymentType ||
          payment.type ||
          ''

        /*
          Pending Payment:
          - It only increased pending due
          - It did not increase totalPaid
          - It did not increase wallet
        */
        if (
          paymentType ===
          'Pending Payment'
        ) {

          updatedDue =
            currentDue - amount
        }

        /*
          Advance Payment:
          - It increased wallet
          - It increased totalPaid
        */
        else if (
          paymentType ===
          'Advance Payment'
        ) {

          updatedWallet =
            currentWallet - amount

          updatedPaid =
            currentPaid - amount
        }

        /*
          Normal / Session / Due Clearance payments:
          - Restore previous wallet/due if available
          - Reduce totalPaid by amount
        */
        else {

          if (
            payment.previousWallet !==
            undefined
          ) {

            updatedWallet =
              Number(
                payment.previousWallet || 0
              )
          }

          if (
            payment.previousDue !==
            undefined
          ) {

            updatedDue =
              Number(
                payment.previousDue || 0
              )
          }

          updatedPaid =
            currentPaid - amount
        }

        const patientDoc =
          doc(
            db,
            'patients',
            patient.id
          )

        await updateDoc(
          patientDoc,
          {

            walletBalance:
              updatedWallet < 0
                ? 0
                : updatedWallet,

            pendingDue:
              updatedDue < 0
                ? 0
                : updatedDue,

            totalPaid:
              updatedPaid < 0
                ? 0
                : updatedPaid
          }
        )
      }

      /* DELETE PAYMENT */
      const paymentDoc =
        doc(
          db,
          'payments',
          payment.id
        )

      await deleteDoc(
        paymentDoc
      )

    } catch (err) {

      console.log(err)
    }
  }

/* DELETE ALL PAYMENTS OF PATIENT */
export const deletePaymentsByPatient =
  async (patientName) => {

    try {

      const snapshot =
        await getDocs(
          paymentRef
        )

      const patientPayments =
        snapshot.docs.filter(
          (docItem) =>

            docItem.data().patient ===
            patientName
        )

      for (const payment of patientPayments) {

        const paymentDoc =
          doc(
            db,
            'payments',
            payment.id
          )

        await deleteDoc(
          paymentDoc
        )
      }

    } catch (err) {

      console.log(err)
    }
  }