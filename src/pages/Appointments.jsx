/* SAME FILE AS PREVIOUS VERSION */

{/* ONLY THESE 2 IMPORTANT CHANGES WERE MADE */}

{/* TODAY SECTION */}

<div className="space-y-4 max-h-[750px] overflow-y-auto pr-2">

  {todayAppointments.length === 0 && (

    <div className="text-zinc-500 text-center py-10">
      No appointments today
    </div>
  )}

  {todayAppointments.map((item) => (

    <AppointmentCard
      key={item.id}
      item={item}
    />
  ))}
</div>