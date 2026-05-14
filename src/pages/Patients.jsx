// REPLACE ONLY THIS BLOCK INSIDE PAYMENT HISTORY

{payment.status === 'Pending'
  ? (

    <button
      onClick={async () => {

        const confirmPayment =
          window.confirm(
            'Mark this pending payment as paid?'
          )

        if (!confirmPayment)
          return

        const updatedDue =
          Math.max(
            Number(
              patient.pendingDue || 0
            ) -
            Number(
              payment.amount || 0
            ),
            0
          )

        const {
          updatePayment
        } = await import(
          '../services/paymentService'
        )

        const {
          updatePatient
        } = await import(
          '../services/patientService'
        )

        await updatePayment(
          payment.id,
          {
            status: 'Paid',
            paymentType:
              'Due Clearance'
          }
        )

        await updatePatient(
          patient.id,
          {
            pendingDue:
              updatedDue,

            totalPaid:
              Number(
                patient.totalPaid || 0
              ) +
              Number(
                payment.amount || 0
              )
          }
        )

        loadPatients()
      }}
      className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 hover:opacity-90"
    >
      Mark Paid
    </button>

  )
  : (

    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      Paid
    </span>
  )}