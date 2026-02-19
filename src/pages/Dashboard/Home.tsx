import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  FileUp,
  GraduationCap,
  Search,
  Loader2,
  Calendar,
} from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  isLoading,
}: any) => (
  <div className="bg-white dark:bg-white/[0.03] p-5 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-4 transition-all duration-200 hover:shadow-sm">
    <div className={`p-3 rounded-full ${iconBg} shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      {isLoading ? (
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1" />
      ) : (
        <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
          {Number(value).toLocaleString()}
        </h3>
      )}
    </div>
  </div>
);

const Home = () => {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUploads: 0,
    totalStudents: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  const handleFetchResponse = useCallback(async (response: Response) => {
    if (response.status === 401) {
      window.location.href = "/signin";
      throw new Error("Unauthorized");
    }
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }, []);

  // --- GROUPING LOGIC: 10 YEAR INTERVALS ---
  const yearGroups = useMemo(() => {
    if (academicYears.length === 0) return [];

    // Sort years descending
    const sorted = [...academicYears].sort((a, b) => b.localeCompare(a));
    const groups: { label: string; latest: string }[] = [];

    for (let i = 0; i < sorted.length; i += 10) {
      const chunk = sorted.slice(i, i + 10);
      if (chunk.length > 0) {
        const latest = chunk[0];
        const oldest = chunk[chunk.length - 1];
        groups.push({
          label: `${oldest.split("-")[0]} - ${latest.split("-")[1]}`,
          latest: latest, // Use the most recent year of this decade for the API
        });
      }
    }
    return groups;
  }, [academicYears]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/academic-years/`, {
          credentials: "include",
        });
        const result = await handleFetchResponse(response);
        const yearsArray = Array.isArray(result) ? result : result.data;

        if (yearsArray && Array.isArray(yearsArray)) {
          const years = yearsArray.map((item: any) =>
            typeof item === "string" ? item : item.academic_year,
          );
          setAcademicYears(years);
          if (years.length > 0) setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    fetchYears();
  }, [handleFetchResponse]);

  const fetchDashboardData = useCallback(
    async (ay: string) => {
      if (!ay) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/stats/dashboard?academicYear=${ay}`,
          { credentials: "include" },
        );
        const result = await handleFetchResponse(response);

        if (result.success) {
          setStats({
            totalUsers: result.counters.totalUsers,
            totalUploads: result.counters.totalUploads,
            totalStudents: result.counters.totalStudents,
          });

          const [endYearPart] = ay.split("-").map(Number);
          const fullRange = Array.from({ length: 10 }, (_, i) => {
            const start = endYearPart - 9 + i;
            const yearLabel = `${start}-${start + 1}`;
            const existing = result.graph.find(
              (g: any) => g.ayLabel === yearLabel,
            );
            return existing || { ayLabel: yearLabel, count: 0 };
          });
          setChartData(fullRange);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [handleFetchResponse],
  );

  useEffect(() => {
    fetchDashboardData(selectedYear);
  }, [selectedYear, fetchDashboardData]);

  return (
    <>
      <PageMeta
        title="Dashboard"
        description="Overview of student record statistics."
      />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          iconBg="bg-blue-600"
          isLoading={isLoading}
        />
        <DashboardCard
          title="Total Uploads"
          value={stats.totalUploads}
          icon={FileUp}
          iconBg="bg-indigo-600"
          isLoading={isLoading}
        />
        <DashboardCard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          iconBg="bg-emerald-500"
          isLoading={isLoading}
        />
      </div>

      <div className="relative">
        {/* YEAR SELECTION DROPDOWN */}
        <div className="absolute top-7 right-6 z-10" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 px-4 py-2 rounded-lg shadow-sm hover:border-blue-400 transition-all"
          >
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-gray-200">
              Decade:{" "}
              {yearGroups.find((g) => g.latest === selectedYear)?.label ||
                "Select Range"}
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-2 right-0 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
              <div className="p-2 text-[10px] uppercase font-bold text-gray-400 bg-gray-50 dark:bg-gray-900/50">
                Select Timeframe
              </div>
              {yearGroups.map((group) => (
                <button
                  key={group.label}
                  className={`w-full text-left px-4 py-3 text-[12px] font-medium border-b dark:border-white/5 last:border-none transition-colors ${
                    selectedYear === group.latest
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                  onClick={() => {
                    setSelectedYear(group.latest);
                    setIsOpen(false);
                  }}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <ComponentCard
          title="Document Statistics"
          desc={
            isLoading
              ? "Loading range..."
              : `Viewing 10-year trend for ${yearGroups.find((g) => g.latest === selectedYear)?.label}`
          }
        >
          <div className="h-[380px] w-full pt-2 relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 dark:bg-gray-900/40 backdrop-blur-[1px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  strokeOpacity={0.15}
                />
                <XAxis
                  dataKey="ayLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: "#1e293b",
                    color: "#f8fafc",
                  }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#chartFill)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default Home;
