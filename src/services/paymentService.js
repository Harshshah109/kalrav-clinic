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

export const addPayment =
  async (data) => {

    await addDoc(
      paymentRef,
      data
    )
  }

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

export const deletePayment =
  async (id) => {

    const paymentDoc =
      doc(
        db,
        'payments',
        id
      )

    await deleteDoc(
      paymentDoc
    )
  }