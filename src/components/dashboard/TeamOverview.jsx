export default function TeamOverview({
  therapists = []
}) {

  return (
    <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold">
          Team Overview
        </h2>
      </div>

      <div className="space-y-4">

        {therapists.length === 0 && (

          <div className="text-zinc-500 text-sm">
            No therapists found
          </div>
        )}

        {therapists.map((item) => (

          <div
            key={item.id}
            className="flex items-center justify-between"
          >

            {/* Left */}
            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-[#dffff2] text-black flex items-center justify-center font-bold uppercase">

                {(item.name || 'TH')
                  .slice(0, 2)}
              </div>

              {/* Info */}
              <div>

                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>

                <p className="text-zinc-500 text-sm">
                  {item.role ||
                    'Speech Therapist'}
                </p>
              </div>
            </div>

            {/* Status */}
            <div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  item.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.status === 'On Leave'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >

                {item.status || 'Active'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}