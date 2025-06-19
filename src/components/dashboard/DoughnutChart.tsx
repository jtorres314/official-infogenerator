
import React from 'react';

interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

interface DoughnutChartProps {
  data: ChartDataItem[];
  total: number;
  size?: number;
  strokeWidth?: number;
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  return d;
};

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  total,
  size = 280, 
  strokeWidth = 45, 
}) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  let cumulativePercent = 0;

  if (total === 0) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center">
        <p className="text-slate-500">No hay datos</p>
      </div>
    );
  }
  
  const activeData = data.filter(item => item.value > 0);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke="#374151" 
        strokeWidth={strokeWidth}
      />
      {activeData.map((item) => {
        const percent = (item.value / total) * 100;
        const startAngle = (cumulativePercent / 100) * 360;
        const endAngle = ((cumulativePercent + percent) / 100) * 360;
        
        const pathData = describeArc(center, center, radius, startAngle, endAngle);
        cumulativePercent += percent;

        return (
          <path
            key={item.label}
            d={pathData}
            fill="transparent"
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round" 
          >
            <title>{`${item.label}: ${item.value} (${((item.value/total) * 100).toFixed(1)}%)`}</title>
          </path>
        );
      })}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="fill-current text-slate-100 font-bold text-4xl" 
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center center', fill: '#f1f5f9'}}
      >
        {total}
      </text>
       <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="1.8em" 
        className="fill-current text-slate-400 font-medium text-sm"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center center', fill: '#94a3b8'}} 
      >
        Total
      </text>
    </svg>
  );
};