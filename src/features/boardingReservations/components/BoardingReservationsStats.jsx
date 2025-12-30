import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import {
  CalendarClock,
  Hourglass,
  CheckCircle2,
  XCircle,
  Ban,
} from "lucide-react";

function Stat({ icon, border, bg, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-full border ${border} ${bg} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function BoardingReservationsStats({ stats }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Stat
            icon={<CalendarClock className="w-4 h-4 text-violet-600" />}
            border="border-violet-200"
            bg="bg-violet-50"
            label="Total"
            value={stats.total}
          />
          <Stat
            icon={<Hourglass className="w-4 h-4 text-amber-600" />}
            border="border-amber-200"
            bg="bg-amber-50"
            label="Pending"
            value={stats.pending}
          />
          <Stat
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            border="border-emerald-200"
            bg="bg-emerald-50"
            label="Confirmed"
            value={stats.confirmed}
          />
          <Stat
            icon={<XCircle className="w-4 h-4 text-rose-600" />}
            border="border-rose-200"
            bg="bg-rose-50"
            label="Rejected"
            value={stats.rejected}
          />
          <Stat
            icon={<Ban className="w-4 h-4 text-neutral-600" />}
            border="border-neutral-200"
            bg="bg-neutral-50"
            label="Cancelled"
            value={stats.cancelled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
