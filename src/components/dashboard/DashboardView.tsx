
import React from 'react';
import { ReportStatistics } from '../../types';
import { UI_TEXT } from '../../constants';
import { BarChart3, AlertCircle, FileText, BookOpen, Users } from 'lucide-react';
import { DoughnutChart } from './DoughnutChart'; 

interface DashboardViewProps {
  stats: ReportStatistics;
}

interface LegendItemProps {
  color: string;
  label: string;
  count: number;
  percentage: number;
  icon: React.ReactNode;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label, count, percentage, icon }) => (
  <div className="flex items-center justify-between p-3 bg-slate-850 rounded-md border border-slate-700/60">
    <div className="flex items-center">
      <span className={`w-5 h-5 rounded-full mr-3`} style={{ backgroundColor: color }}></span>
      <span className="mr-2 opacity-80">{icon}</span>
      <span className="text-sm text-slate-300">{label}</span>
    </div>
    <div className="text-right">
      <span className="text-sm font-semibold text-slate-100">{count}</span>
      <span className="block text-xs text-slate-400">({percentage.toFixed(1)}%)</span>
    </div>
  </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ stats }) => {
  const totalReports = stats.sijin + stats.datt + stats.inpec;

  if (totalReports === 0) {
    return (
      <div className="text-center py-10">
        <BarChart3 size={48} className="mx-auto text-slate-500 mb-4" />
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-300 mb-2">{UI_TEXT.dashboard.title}</h2>
        <p className="text-slate-400 flex items-center justify-center">
          <AlertCircle size={20} className="mr-2 text-yellow-400" /> {UI_TEXT.dashboard.noData}
        </p>
      </div>
    );
  }

  const chartData = [
    { label: UI_TEXT.dashboard.sijinReports, value: stats.sijin, color: '#3B82F6', icon: <FileText size={16} className="text-blue-400" /> }, 
    { label: UI_TEXT.dashboard.dattReports, value: stats.datt, color: '#22C55E', icon: <BookOpen size={16} className="text-green-400" /> }, 
    { label: UI_TEXT.dashboard.inpecReports, value: stats.inpec, color: '#EAB308', icon: <Users size={16} className="text-yellow-400" /> }, 
  ].filter(item => item.value > 0);


  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <BarChart3 size={32} className="mr-3 text-indigo-400" />
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          {UI_TEXT.dashboard.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
        <div className="lg:col-span-3 flex justify-center items-center p-4 min-h-[300px] sm:min-h-[350px]">
          <DoughnutChart data={chartData} total={totalReports} />
        </div>
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-semibold text-slate-200 mb-2 pl-1">Desglose de Informes:</h3>
          {chartData.map(item => (
            <LegendItem
              key={item.label}
              color={item.color}
              label={item.label}
              count={item.value}
              percentage={(item.value / totalReports) * 100}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};