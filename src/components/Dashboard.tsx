'use client';

import { TestCase } from '@/types/test';

interface DashboardProps {
  testCases: TestCase[];
}

export default function Dashboard({ testCases }: DashboardProps) {
  const total = testCases.length;
  const passed = testCases.filter(t => t.ok).length;
  const failed = testCases.filter(t => t.ko).length;
  const pending = testCases.filter(t => t.status === 'Pending').length;
  const inProgress = testCases.filter(t => t.status === 'In Progress').length;
  const done = testCases.filter(t => t.status === 'DONE').length;
  const blocked = testCases.filter(t => t.status === 'BLOCKED').length;

  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

  const stats = [
    { label: 'Total', value: total, color: 'bg-blue-500' },
    { label: 'Passed', value: passed, color: 'bg-green-500' },
    { label: 'Failed', value: failed, color: 'bg-red-500' },
    { label: 'Pending', value: pending, color: 'bg-gray-400' },
    { label: 'In Progress', value: inProgress, color: 'bg-yellow-500' },
    { label: 'Done', value: done, color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* Pass Rate */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Pass Rate</span>
          <span className="text-2xl font-bold text-green-600">{passRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${passRate}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-2`}></div>
            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Priority Breakdown */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">By Priority</h3>
        <div className="space-y-3">
          {(['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as const).map((priority) => {
            const count = testCases.filter(t => t.priority === priority).length;
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            const color = {
              URGENT: 'bg-red-500',
              HIGH: 'bg-orange-500',
              MEDIUM: 'bg-yellow-500',
              LOW: 'bg-green-500'
            }[priority];

            return (
              <div key={priority}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{priority}</span>
                  <span className="text-gray-600">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}