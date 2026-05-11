export const addTherapist =
  async (data) => {

    let uid = null

    if (
      data.email &&
      data.password
    ) {

      const auth =
        getAuth()

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        )

      const user =
        userCredential.user

      uid = user.uid

      await setDoc(
        doc(db, 'users', user.uid),
        {
          role:
            data.systemRole || 'therapist',

          email:
            data.email
        }
      )
    }

    const therapistData = {
      ...data,
      uid
    }

    delete therapistData.password
    delete therapistData.systemRole

    await addDoc(
      therapistRef,
      therapistData
    )
  }