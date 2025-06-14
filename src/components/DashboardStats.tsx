
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalTasks,
  completedTasks,
  overdueTasks,
}) => {
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className={`p-4 ${stat.bgColor} ${stat.borderColor} border shadow-md hover:shadow-lg transition-all duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-full bg-white/50`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
      
      {/* Completion Rate */}
      {totalTasks > 0 && (
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 border shadow-md hover:shadow-lg transition-all duration-200 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">{completionRate}%</p>
            </div>
            <div className="w-full max-w-xs ml-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
