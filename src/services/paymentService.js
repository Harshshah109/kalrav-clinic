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

/* GET PAYMENT DATE FOR SORTING */
const getPaymentDate =
  (payment) => {

    if (payment.createdAt?.seconds) {

      return new Date(
        payment.createdAt.seconds * 1000
      )
    }

    if (payment.createdAt) {

      return new Date(
        payment.createdAt
      )
    }

    if (payment.date?.seconds) {

      return new Date(
        payment.date.seconds * 1000
      )
    }

    if (payment.date) {

      return new Date(
        payment.date
      )
    }

    return new Date(0)
  }

/* RECALCULATE PATIENT BALANCE FROM ALL PAYMENTS */
const recalculatePatientPayments =
  async (patientName) => {

    try {

      const patientSnapshot =
        await getDocs(
          collection(db, 'patients')
        )

      const patientDocSnap =
        patientSnapshot.docs.find(
          (docItem) =>

            docItem.data().name ===
            patientName
        )

      if (!patientDocSnap)
        return

      const paymentsSnapshot =
        await getDocs(
          paymentRef
        )

      const patientPayments =
        paymentsSnapshot.docs

          .map((docItem) => ({

            id: docItem.id,

            ...docItem.data()
          }))

          .filter((payment) =>

            payment.patient ===
            patientName
          )

          .sort((a, b) =>

            getPaymentDate(a) -
            getPaymentDate(b)
          )

      let walletBalance =
        0

      let pendingDue =
        0

      let totalPaid =
        0

      for (const payment of patientPayments) {

        const amount =
          Number(
            payment.amount || 0
          )

        const paymentType =
          payment.paymentType ||
          payment.type ||
          ''

        const method =
          payment.method || ''

        /*
          PENDING PAYMENT:
          - Only adds pending due
          - Does not add total paid
          - Does not affect wallet
        */
        if (
          paymentType ===
          'Pending Payment' ||
          payment.status === 'Pending'
        ) {

          pendingDue =
            pendingDue + amount

          continue
        }

        /*
          FROM WALLET:
          - Deduct from wallet
          - Clear pending due if available
          - Does not increase totalPaid
        */
        if (
          method ===
          'From Wallet'
        ) {

          walletBalance =
            walletBalance - amount

          if (walletBalance < 0) {

            walletBalance =
              0
          }

          const dueClearedAmount =
            Math.min(
              pendingDue,
              amount
            )

          pendingDue =
            pendingDue -
            dueClearedAmount

          if (pendingDue < 0) {

            pendingDue =
              0
          }

          continue
        }

        /*
          SESSION PAYMENT:
          - Always increases totalPaid
          - If pending due is 0, wallet does not increase
          - If pending due exists, first clear due
          - If extra remains after clearing due, extra goes to wallet
        */
        if (
          paymentType ===
          'Session Payment'
        ) {

          totalPaid =
            totalPaid + amount

          if (pendingDue > 0) {

            const dueClearedAmount =
              Math.min(
                pendingDue,
                amount
              )

            pendingDue =
              pendingDue -
              dueClearedAmount

            const extraAmount =
              amount -
              dueClearedAmount

            if (extraAmount > 0) {

              walletBalance =
                walletBalance +
                extraAmount
            }
          }

          continue
        }

        /*
          ALL OTHER REAL PAYMENTS:
          - Increase totalPaid
          - First clear pending due
          - Extra goes to wallet
          - If no pending due, full amount goes to wallet
        */
        totalPaid =
          totalPaid + amount

        if (pendingDue > 0) {

          const dueClearedAmount =
            Math.min(
              pendingDue,
              amount
            )

          pendingDue =
            pendingDue -
            dueClearedAmount

          const extraAmount =
            amount -
            dueClearedAmount

          if (extraAmount > 0) {

            walletBalance =
              walletBalance +
              extraAmount
          }
        }

        else {

          walletBalance =
            walletBalance + amount
        }
      }

      const patientDocRef =
        doc(
          db,
          'patients',
          patientDocSnap.id
        )

      await updateDoc(
        patientDocRef,
        {

          walletBalance:
            walletBalance < 0
              ? 0
              : walletBalance,

          pendingDue:
            pendingDue < 0
              ? 0
              : pendingDue,

          totalPaid:
            totalPaid < 0
              ? 0
              : totalPaid
        }
      )

    } catch (err) {

      console.log(err)
    }
  }

/* DELETE PAYMENT WITH FULL RECALCULATION */
export const deletePayment =
  async (payment) => {

    try {

      const patientName =
        payment.patient

      /* DELETE PAYMENT FIRST */
      const paymentDoc =
        doc(
          db,
          'payments',
          payment.id
        )

      await deleteDoc(
        paymentDoc
      )

      /*
        IMPORTANT:
        After deleting, recalculate the full patient balance
        from all remaining payments.
        This fixes deletion from middle/old payments.
      */
      await recalculatePatientPayments(
        patientName
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

      await recalculatePatientPayments(
        patientName
      )

    } catch (err) {

      console.log(err)
    }
  }