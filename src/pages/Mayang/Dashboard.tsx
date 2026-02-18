import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileUp, GraduationCap, Search } from 'lucide-react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

const START_LIMIT = 1960;
const currentYear = new Date().getFullYear();

const academicYears = Array.from({ length: currentYear - START_LIMIT + 1 }, (_, i) => {
  const start = currentYear - i;
  return `${start}-${start + 1}`;
});

const generateData = (selectedAY: string) => {
  const [startYear] = selectedAY.split('-').map(Number);
  const chartStartYear = Math.max(START_LIMIT, startYear - 9);
  
  const dataPoints = Array.from({ length: 10 }, (_, i) => {
    const yearOffset = chartStartYear + i;
    return {
      ayLabel: `${yearOffset}-${yearOffset + 1}`,
      count: Math.floor(Math.random() * (1200 - 400 + 1) + 400)
    };
  });

  return {
    dataPoints,
    rangeStart: dataPoints[0].ayLabel,
    rangeEnd: dataPoints[9].ayLabel
  };
};

const DashboardCard = ({ title, value, icon: Icon, iconBg }: any) => (
  <div className="bg-white dark:bg-white/[0.03] p-5 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-4 transition-all duration-200 hover:shadow-sm">
    <div className={`p-3 rounded-full ${iconBg} shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(academicYears[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredYears = academicYears.filter(y => y.includes(searchTerm));
  const { dataPoints, rangeStart, rangeEnd } = useMemo(() => generateData(selectedYear), [selectedYear]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900 p-6 pt-2 font-sans text-slate-900 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        <PageMeta title="Dashboard | UEP Student Archives" description="Admin Dashboard" />
        <PageBreadcrumb pageTitle="Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <DashboardCard 
            title="Total Users" 
            value="12,840" 
            icon={Users} 
            iconBg="bg-blue-600" 
          />
          <DashboardCard 
            title="Total Uploads" 
            value="85,291" 
            icon={FileUp} 
            iconBg="bg-indigo-600" 
          />
          <DashboardCard 
            title="Total Students" 
            value="12,800" 
            icon={GraduationCap} 
            iconBg="bg-emerald-500" 
          />
        </div>

        <div className="relative">
          <div className="absolute top-7 right-6 z-10" ref={dropdownRef}>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg focus-within:ring-1 focus-within:ring-blue-400 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all w-56 shadow-sm">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search A.Y..."
                className="w-full bg-transparent outline-none text-[13px] font-medium text-slate-700 dark:text-gray-200 placeholder:text-gray-400"
                value={searchTerm}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded shrink-0 whitespace-nowrap">
                {selectedYear}
              </span>
            </div>

            {isOpen && (
              <div className="absolute z-50 mt-1 right-0 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto transition-all [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent] dark:[scrollbar-color:#4b5563_transparent]">
      
                {filteredYears.length > 0 ? (
                filteredYears.map((year) => (
                  <button
                    key={year}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-[12px] hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-gray-300 font-medium border-b border-gray-50 dark:border-white/5 last:border-none transition-colors"
                    onClick={() => {
                    setSelectedYear(year);
                    setSearchTerm('');
                    setIsOpen(false);
                }}
              >
              {year}
                </button>
              ))
              ) : (
                  <div className="px-4 py-3 text-[12px] text-gray-400 italic text-center">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <ComponentCard 
            title="Document Statistics" 
            desc={`Displays the total number of Form 137 uploads from A.Y. ${rangeStart} to A.Y. ${rangeEnd}`}
          >
            <div className="h-[380px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataPoints} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
                  
                  <XAxis 
                    dataKey="ayLabel" 
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#94a3b8', fontSize: 10}}
                    dy={10}
                  />
                  
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11}} 
                  />
                  
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', 
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#3b82f6' }}
                    formatter={(value: any) => [`${value} Uploads`, "Total"]}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#chartFill)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;