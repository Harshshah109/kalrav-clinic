import {
  IndianRupee,
  Plus,
  Trash2
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import {
  getPayments,
deletePayment,
updatePayment
} from '../services/paymentService'

import AddPaymentModal
  from '../components/modals/AddPaymentModal'

export default function Payments() {

  const [payments, setPayments] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {

    try {

      const data =
        await getPayments()

      setPayments(data)

    } catch (err) {

      console.log(err)
    }
  }

  const totalRevenue =
    payments
      .filter(
        (item) =>
          item.status === 'Paid'
      )
      .reduce(
        (acc, item) =>
          acc + Number(item.amount || 0),
        0
      )

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            Payments
          </h1>

          <p className="text-zinc-400">
            Track clinic payments and revenue
          </p>
        </div>

        <button
          onClick={() =>
            setOpenModal(true)
          }
          className="flex items-center justify-center gap-2 border border-[#3a3a3a] rounded-2xl px-6 py-4 hover:bg-[#1c1c1c] transition-all"
        >
          <Plus size={20} />

          <span className="font-semibold">
            Add Payment
          </span>
        </button>
      </div>

      {/* Revenue Card */}
      <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6 mb-6">

        <h3 className="text-zinc-400 mb-2">
          Total Revenue
        </h3>

        <h2 className="text-5xl font-bold">
          ₹{totalRevenue}
        </h2>
      </div>

      {/* Empty State */}
      {payments.length === 0 && (
        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-12 text-center">

          <div className="w-20 h-20 rounded-3xl bg-[#222] flex items-center justify-center mx-auto mb-5">
            <IndianRupee size={36} />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            No Payments Yet
          </h2>

          <p className="text-zinc-400 mb-6">
            Start adding clinic payments
          </p>

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="px-6 h-12 rounded-2xl bg-[#dffff2] text-black font-semibold"
          >
            Add First Payment
          </button>
        </div>
      )}

      {/* Payments List */}
      <div className="space-y-4">

        {payments.map((item) => (

          <div
            key={item.id}
            className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center gap-5"
          >

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#dffff2] text-black flex items-center justify-center">
              <IndianRupee size={24} />
            </div>

            {/* Info */}
            <div className="flex-1">

              <h2 className="text-2xl font-bold mb-1">
                {item.patient}
              </h2>

              <p className="text-zinc-400">
  {item.method} • {

    item.date?.seconds
      ? new Date(
          item.date.seconds * 1000
        ).toLocaleDateString()

      : item.date
  }
</p>
            </div>

            {/* Amount */}
            <div className="text-3xl font-bold">
              ₹{item.amount}
            </div>

            {/* Status */}
            {/* Status */}
<div>

  {item.status === 'Pending' ? (

    <button
      onClick={async () => {

        await updatePayment(
          item.id,
          {
            status: 'Paid'
          }
        )

        loadPayments()
      }}
      className="px-5 h-11 rounded-2xl bg-emerald-100 text-emerald-700 font-semibold hover:opacity-90"
    >
      Mark Paid
    </button>

  ) : (

    <span
      className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700"
    >
      Paid
    </span>

  )}
</div>

            {/* Delete */}
            <button
              onClick={async () => {

                const confirmDelete =
                  window.confirm(
                    'Delete payment?'
                  )

                if (!confirmDelete) return

                await deletePayment(
                  item.id
                )

                loadPayments()
              }}
              className="w-12 h-12 rounded-2xl border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {openModal && (
        <AddPaymentModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadPayments}
        />
      )}
    </div>
  )
}