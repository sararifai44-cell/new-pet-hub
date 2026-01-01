import React from 'react'
import { IoBagHandle, IoPaw, IoMedical, IoStorefront } from 'react-icons/io5'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Jan', Adoptions: 40, Appointments: 24, Boarding: 15 },
  { name: 'Feb', Adoptions: 30, Appointments: 13, Boarding: 20 },
  { name: 'Mar', Adoptions: 20, Appointments: 98, Boarding: 25 },
  { name: 'Apr', Adoptions: 27, Appointments: 39, Boarding: 18 },
  { name: 'May', Adoptions: 18, Appointments: 48, Boarding: 22 },
  { name: 'Jun', Adoptions: 23, Appointments: 38, Boarding: 30 },
  { name: 'Jul', Adoptions: 34, Appointments: 43, Boarding: 28 },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <DashboardStatsGrid />

      <div className="flex flex-col xl:flex-row gap-3 w-full">
        <TransactionChart />
        <RecentActivities />
      </div>
    </div>
  )
}

function DashboardStatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <BoxWrapper>
        <div className="rounded-full h-10 w-10 flex items-center justify-center bg-green-500">
          <IoPaw className="text-xl text-white" />
        </div>
        <div className="pl-3">
          <span className="text-xs text-gray-500 font-light">Total Pets</span>
          <div className="flex items-center">
            <strong className="text-lg text-gray-700 font-semibold">156</strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
        <div className="rounded-full h-10 w-10 flex items-center justify-center bg-sky-500">
          <IoBagHandle className="text-xl text-white" />
        </div>
        <div className="pl-3">
          <span className="text-xs text-gray-500 font-light">Pending Adoptions</span>
          <div className="flex items-center">
            <strong className="text-lg text-gray-700 font-semibold">12</strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
        <div className="rounded-full h-10 w-10 flex items-center justify-center bg-orange-500">
          <IoMedical className="text-xl text-white" />
        </div>
        <div className="pl-3">
          <span className="text-xs text-gray-500 font-light">Today's Appointments</span>
          <div className="flex items-center">
            <strong className="text-lg text-gray-700 font-semibold">8</strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
        <div className="rounded-full h-10 w-10 flex items-center justify-center bg-purple-500">
          <IoStorefront className="text-xl text-white" />
        </div>
        <div className="pl-3">
          <span className="text-xs text-gray-500 font-light">Active Boardings</span>
          <div className="flex items-center">
            <strong className="text-lg text-gray-700 font-semibold">14</strong>
          </div>
        </div>
      </BoxWrapper>
    </div>
  )
}

function BoxWrapper({ children }) {
  return (
    <div className="bg-white rounded-lg p-3 flex-1 border border-gray-200 flex items-center">
      {children}
    </div>
  )
}

function TransactionChart() {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col flex-1 min-h-[320px]">
      <strong className="text-gray-700 font-medium text-sm">Monthly Activity Overview</strong>

      <div className="mt-2 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Adoptions" fill="#0ea5e9" />
            <Bar dataKey="Appointments" fill="#ea580c" />
            <Bar dataKey="Boarding" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function RecentActivities() {
  const activitiesData = [
    { id: '1', type: 'ADOPTION', name: 'Lucy', date: '17 May 2024', status: 'PENDING_REVIEW' },
    { id: '2', type: 'APPOINTMENT', name: 'Max - Checkup', date: '16 May 2024', status: 'CONFIRMED' },
    { id: '3', type: 'BOARDING', name: 'Buddy', date: '16 May 2024', status: 'ACTIVE' },
    { id: '4', type: 'ORDER', name: 'Food Supplies', date: '15 May 2024', status: 'PROCESSING' },
    { id: '5', type: 'MEDICAL', name: 'Bella - Vaccination', date: '15 May 2024', status: 'COMPLETED' },
  ]

  const getStatusColor = (status) => {
    const colors = {
      PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      ACTIVE: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-orange-100 text-orange-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white px-3 pt-2.5 pb-3 rounded-lg border border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium text-sm">Recent Activities</strong>

      <div className="border border-gray-200 rounded-lg mt-2 overflow-hidden">
        <table className="w-full text-gray-700 text-xs">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Details</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {activitiesData.map((activity) => (
              <tr key={activity.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="p-2">
                  <span className="font-medium">{activity.type}</span>
                </td>
                <td className="p-2">{activity.name}</td>
                <td className="p-2">{activity.date}</td>
                <td className="p-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
