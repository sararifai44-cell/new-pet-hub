import React from "react";
import { ClipboardList, Clock3, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

export default function AdoptionApplicationsStats({ stats }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem
            icon={<ClipboardList className="w-4 h-4 text-violet-600" />}
            label="Total"
            value={stats.total}
            ring="violet"
          />
          <StatItem
            icon={<Clock3 className="w-4 h-4 text-amber-600" />}
            label="Pending"
            value={stats.pending}
            ring="amber"
          />
          <StatItem
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            label="Approved"
            value={stats.approved}
            ring="emerald"
          />
          <StatItem
            icon={<XCircle className="w-4 h-4 text-red-600" />}
            label="Rejected"
            value={stats.rejected}
            ring="red"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ icon, label, value, ring }) {
  const ringMap = {
    violet: "border-violet-200 bg-violet-50",
    amber: "border-amber-200 bg-amber-50",
    emerald: "border-emerald-200 bg-emerald-50",
    red: "border-red-200 bg-red-50",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-full border flex items-center justify-center ${
          ringMap[ring] || ringMap.violet
        }`}
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
