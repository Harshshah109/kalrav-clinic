import {
  IndianRupee,
  Plus,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

import {
  useEffect,
  useMemo,
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

  const [filter, setFilter] =
    useState('monthly')

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

  const filteredPayments = useMemo(() => {

    const now = new Date()

    return payments.filter((item) => {

      if (!item.date)
        return false

      const paymentDate =
        item.date?.seconds
          ? new Date(item.date.seconds * 1000)
          : new Date(item.date)

      if (filter === 'weekly') {

        const diff =
          (now - paymentDate) /
          (1000 * 60 * 60 * 24)

        return diff <= 7
      }

      if (filter === 'monthly') {

        return (
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear()
        )
      }

      if (filter === 'yearly') {

        return (
          paymentDate.getFullYear() === now.getFullYear()
        )
      }

      return true
    })

  }, [payments, filter])

  const totalRevenue =
    filteredPayments
      .filter((item) => item.status === 'Paid')
      .reduce(
        (acc, item) =>
          acc + Number(item.amount || 0),
        0
      )

  const pendingRevenue =
    filteredPayments
      .filter((item) => item.status === 'Pending')
      .reduce(
        (acc, item) =>
          acc + Number(item.amount || 0),
        0
      )

  const paidCount =
    filteredPayments.filter(
      (item) => item.status === 'Paid'
    ).length

  const pendingCount =
    filteredPayments.filter(
      (item) => item.status === 'Pending'
    ).length

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            Payments
          </h1>

          <p className="text-zinc-400">
            Manage patient billing and clinic revenue
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">

          {/* Filters */}
          <div className="flex bg-[#171717] border border-[#2f2f2f] rounded-2xl p-1">

            {['weekly', 'monthly', 'yearly'].map((item) => (

              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 h-11 rounded-xl text-sm font-semibold transition-all ${
                  filter === item
                    ? 'bg-[#dffff2] text-black'
                    : 'text-zinc-400'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {/* Add Payment */}
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center mb-5">
            <IndianRupee size={22} />
          </div>

          <h3 className="text-zinc-400 mb-2">
            Total Revenue
          </h3>

          <h2 className="text-4xl font-bold">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center mb-5">
            <AlertCircle size={22} />
          </div>

          <h3 className="text-zinc-400 mb-2">
            Pending Amount
          </h3>

          <h2 className="text-4xl font-bold text-yellow-400">
            ₹{pendingRevenue}
          </h2>
        </div>

        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center mb-5">
            <CheckCircle2 size={22} />
          </div>

          <h3 className="text-zinc-400 mb-2">
            Paid Transactions
          </h3>

          <h2 className="text-4xl font-bold text-emerald-400">
            {paidCount}
          </h2>
        </div>

        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center mb-5">
            <TrendingUp size={22} />
          </div>

          <h3 className="text-zinc-400 mb-2">
            Pending Transactions
          </h3>

          <h2 className="text-4xl font-bold text-yellow-400">
            {pendingCount}
          </h2>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">

        {filteredPayments.map((item) => (

          <div
            key={item.id}
            className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-5 flex flex-col xl:flex-row xl:items-center gap-5"
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
            <div>

              <h2 className="text-3xl font-bold">
                ₹{item.amount}
              </h2>
            </div>

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
                  className="px-5 h-11 rounded-2xl bg-yellow-100 text-yellow-700 font-semibold hover:opacity-90"
                >
                  Mark Paid
                </button>

              ) : (

                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
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

                if (!confirmDelete)
                  return

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
