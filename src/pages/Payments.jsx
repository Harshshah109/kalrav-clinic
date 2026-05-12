import {
  IndianRupee,
  Plus,
  Trash2,
  AlertCircle,
  Wallet
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

import {
  getPatients
} from '../services/patientService'

import AddPaymentModal
  from '../components/modals/AddPaymentModal'

export default function Payments() {

  const [payments, setPayments] =
    useState([])

  const [patients, setPatients] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [filter, setFilter] =
    useState('monthly')

  useEffect(() => {

    loadData()

  }, [])

  const loadData =
    async () => {

      try {

        const paymentData =
          await getPayments()

        const patientData =
          await getPatients()

        setPayments(
          paymentData || []
        )

        setPatients(
          patientData || []
        )

      } catch (err) {

        console.log(err)
      }
    }

  const filteredPayments =
    useMemo(() => {

      const now =
        new Date()

      return payments.filter((item) => {

        if (!item.date)
          return false

        const paymentDate =
          item.date?.seconds
            ? new Date(
                item.date.seconds * 1000
              )
            : new Date(item.date)

        if (filter === 'weekly') {

          const diff =
            (now - paymentDate) /
            (1000 * 60 * 60 * 24)

          return diff <= 7
        }

        if (filter === 'monthly') {

          return (
            paymentDate.getMonth() ===
              now.getMonth() &&
            paymentDate.getFullYear() ===
              now.getFullYear()
          )
        }

        if (filter === 'yearly') {

          return (
            paymentDate.getFullYear() ===
            now.getFullYear()
          )
        }

        return true
      })

    }, [payments, filter])

  const totalRevenue =
    filteredPayments
      .filter(
        (item) =>
          item.status === 'Paid'
      )
      .reduce(
        (acc, item) =>
          acc + Number(item.amount || 0),
        0
      )

  const totalWalletBalance =
    patients.reduce(
      (acc, patient) =>
        acc + Number(
          patient.walletBalance || 0
        ),
      0
    )

  const pendingRevenue =
    patients.reduce(
      (acc, patient) =>
        acc + Number(
          patient.pendingDue || 0
        ),
      0
    )

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            Payments
          </h1>

          <p className="text-zinc-400">
            Advanced clinic billing and settlements
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">

          {/* Filters */}
          <div className="flex bg-[#171717] border border-[#2f2f2f] rounded-2xl p-1">

            {[
              'weekly',
              'monthly',
              'yearly'
            ].map((item) => (

              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                className={`px-4 h-11 rounded-xl text-sm font-semibold transition-all ${
                  filter === item
                    ? 'bg-[#dffff2] text-black'
                    : 'text-zinc-400'
                }`}
              >
                {
                  item.charAt(0)
                    .toUpperCase() +
                  item.slice(1)
                }
              </button>
            ))}
          </div>

          {/* Add */}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Revenue */}
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

        {/* Wallet */}
        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center mb-5">

            <Wallet size={22} />
          </div>

          <h3 className="text-zinc-400 mb-2">
            Wallet Balance
          </h3>

          <h2 className="text-4xl font-bold text-cyan-400">
            ₹{totalWalletBalance}
          </h2>
        </div>

        {/* Due */}
        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center mb-5">

            <AlertCircle size={22} />
          </div>

          <h3 className="text-zinc-400 mb-2">
            Pending Due
          </h3>

          <h2 className="text-4xl font-bold text-yellow-400">
            ₹{pendingRevenue}
          </h2>
        </div>
      </div>

      {/* Payments */}
      <div className="space-y-4">

        {filteredPayments

          .sort((a, b) => {

            const dateA =
              a.createdAt?.seconds
                ? new Date(
                    a.createdAt.seconds * 1000
                  )
                : new Date(a.createdAt)

            const dateB =
              b.createdAt?.seconds
                ? new Date(
                    b.createdAt.seconds * 1000
                  )
                : new Date(b.createdAt)

            return dateB - dateA
          })

          .map((item) => (

            <div
              key={item.id}
              className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-5 flex flex-col gap-5"
            >

              <div className="flex flex-col xl:flex-row xl:items-center gap-5">

                <div className="w-14 h-14 rounded-2xl bg-[#dffff2] text-black flex items-center justify-center">

                  <IndianRupee size={24} />
                </div>

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-3 mb-2">

                    <h2 className="text-2xl font-bold">
                      {item.patient}
                    </h2>

                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#222] text-cyan-400">
                      {
                        item.paymentType ||
                        'Payment'
                      }
                    </span>
                  </div>

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

                <div>

                  <h2 className="text-3xl font-bold">
                    ₹{item.amount}
                  </h2>
                </div>

                <div>

                  {item.status === 'Pending'
                    ? (

                      <button
                        onClick={async () => {

                          await updatePayment(
                            item.id,
                            {
                              status: 'Paid'
                            }
                          )

                          loadData()
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

                {/* DELETE */}
                <button
                  onClick={async () => {

                    const confirmDelete =
                      window.confirm(
                        'Delete payment and rollback balances?'
                      )

                    if (!confirmDelete)
                      return

                    await deletePayment(
                      item
                    )

                    loadData()
                  }}
                  className="w-12 h-12 rounded-2xl border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all"
                >

                  <Trash2 size={18} />
                </button>
              </div>

              {/* Wallet + Due */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="bg-[#1f1f1f] rounded-2xl p-4 border border-[#2d2d2d]">

                  <p className="text-zinc-500 text-sm mb-2">
                    Remaining Wallet
                  </p>

                  <h3 className="text-2xl font-bold text-cyan-400">
                    ₹{
                      item.remainingWallet || 0
                    }
                  </h3>
                </div>

                <div className="bg-[#1f1f1f] rounded-2xl p-4 border border-[#2d2d2d]">

                  <p className="text-zinc-500 text-sm mb-2">
                    Remaining Due
                  </p>

                  <h3 className={`text-2xl font-bold ${
                    item.remainingDue > 0
                      ? 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}>

                    {
                      item.remainingDue > 0
                        ? `₹${item.remainingDue}`
                        : 'No Due'
                    }
                  </h3>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {openModal && (
        <AddPaymentModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadData}
        />
      )}
    </div>
  )
}