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

  const [selectedDate,
    setSelectedDate] =
      useState('')

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

      .filter((item) => {

        return (
          item.status === 'Paid' &&
          item.method !== 'From Wallet'
        )
      })

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

  const formatDate =
    (dateObj) => {

      return `${dateObj.getFullYear()}-${
        String(
          dateObj.getMonth() + 1
        ).padStart(2, '0')
      }-${
        String(
          dateObj.getDate()
        ).padStart(2, '0')
      }`
    }

  const today =
    formatDate(new Date())

  const getPaymentDate =
    (item) => {

      if (!item.date)
        return ''

      const paymentDate =
        item.date?.seconds
          ? new Date(
              item.date.seconds * 1000
            )
          : new Date(item.date)

      return formatDate(paymentDate)
    }

  const sortedPayments =
    [...filteredPayments]

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

  const todayPayments =
    sortedPayments.filter(
      (item) =>
        getPaymentDate(item) === today
    )

  const previousPayments =
    sortedPayments.filter(
      (item) =>
        getPaymentDate(item) !== today
    )

  const selectedDatePayments =
    selectedDate
      ? sortedPayments.filter(
          (item) =>
            getPaymentDate(item) ===
            selectedDate
        )
      : []

  const PaymentCard =
    ({ item }) => (

      <div
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

                    const patient =
                      patients.find(
                        (p) =>
                          p.name === item.patient
                      )

                    if (patient) {

                      const updatedDue =
                        Math.max(
                          Number(
                            patient.pendingDue || 0
                          ) -
                          Number(
                            item.amount || 0
                          ),
                          0
                        )

                      await updatePayment(
                        item.id,
                        {
                          status: 'Paid',
                          paymentType:
                            'Due Clearance'
                        }
                      )

                      const {
                        updatePatient
                      } = await import(
                        '../services/patientService'
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
                              item.amount || 0
                            )
                        }
                      )
                    }

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

            <Wallet size={22} />
          </div>

          <h3 className="text-zinc-400 mb-2">
            Wallet Balance
          </h3>

          <h2 className="text-4xl font-bold text-cyan-400">
            ₹{totalWalletBalance}
          </h2>
        </div>

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

      {/* DATE FILTER */}
      <div className="mb-6">

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(
              e.target.value
            )
          }
          className="bg-[#171717] border border-[#2f2f2f] rounded-2xl px-5 h-14 outline-none text-white"
          style={{
            colorScheme: 'dark'
          }}
        />
      </div>

      {/* PAYMENTS */}
      <div className="space-y-8">

        {selectedDate ? (

          <div>

            <div className="mb-5">

              <h2 className="text-3xl font-bold">
                {new Date(selectedDate)
                  .toLocaleDateString(
                    'en-IN',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }
                  )}
              </h2>

              <p className="text-zinc-400 mt-1">
                {selectedDatePayments.length} payments
              </p>
            </div>

            <div className="space-y-4 max-h-[850px] overflow-y-auto pr-2">

              {selectedDatePayments.length === 0 && (

                <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-10 text-center text-zinc-500">
                  No payments found
                </div>
              )}

              {selectedDatePayments.map((item) => (

                <PaymentCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>

        ) : (

          <>
            {/* TODAY */}
            <div>

              <div className="mb-5">

                <h2 className="text-3xl font-bold">
                  Today's Payments
                </h2>

                <p className="text-zinc-400 mt-1">
                  {todayPayments.length} payments
                </p>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">

                {todayPayments.length === 0 && (

                  <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-10 text-center text-zinc-500">
                    No payments today
                  </div>
                )}

                {todayPayments.map((item) => (

                  <PaymentCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>

            {/* PREVIOUS */}
            <div>

              <div className="mb-5">

                <h2 className="text-3xl font-bold">
                  Previous Payments
                </h2>

                <p className="text-zinc-400 mt-1">
                  {previousPayments.length} payments
                </p>
              </div>

              <div className="space-y-4 max-h-[900px] overflow-y-auto pr-2">

                {previousPayments.map((item) => (

                  <PaymentCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
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