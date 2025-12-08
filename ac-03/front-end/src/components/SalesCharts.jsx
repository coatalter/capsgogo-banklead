import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function SalesCharts({ data = [] }) {
  // ----------------- HITUNG STATUS -----------------
  const statusCounts = useMemo(() => {
    let newCount = 0,
      inProgress = 0,
      success = 0,
      failed = 0,
      unknown = 0;

    data.forEach((c) => {
      let status = c.status;

      // Fallback dari subscribed (v1)
      if (!status) {
        if (c.subscribed === true) status = "success";
        else if (c.subscribed === false) status = "failed";
        else status = "unknown";
      }

      if (status === "new") newCount++;
      else if (status === "in_progress") inProgress++;
      else if (status === "success") success++;
      else if (status === "failed") failed++;
      else unknown++;
    });

    return { newCount, inProgress, success, failed, unknown };
  }, [data]);

  const { newCount, inProgress, success, failed, unknown } = statusCounts;

  // ----------------- DATA BAR: STATUS (SUDAH DIHUBUNGI) -----------------
  const statusBarData = useMemo(
    () => [
      { name: "Prospek Baru", value: newCount },
      { name: "Follow Up", value: inProgress },
      { name: "Berhasil", value: success },
      { name: "Gagal", value: failed },
    ],
    [newCount, inProgress, success, failed]
  );

  // ----------------- DATA PIE: UNKNOWN vs SUDAH DIHUBUNGI -----------------
  const contactedVsUnknownPieData = useMemo(() => {
    const contacted = newCount + inProgress + success + failed;

    return [
      { name: "Belum Dihubungi", value: unknown, color: "#6b7280" }, // gray
      { name: "Sudah Dihubungi", value: contacted, color: "#3b82f6" }, // blue
    ];
  }, [newCount, inProgress, success, failed, unknown]);

  // ----------------- DATA BAR: TOP 5 PEKERJAAN (SAMA SEPERTI V1) -----------------
  const jobBarData = useMemo(() => {
    const counts = {};
    data.forEach((c) => {
      const job = c.job || "Unknown";
      counts[job] = (counts[job] || 0) + 1;
    });
    return Object.keys(counts)
      .map((key) => ({ name: key, count: counts[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  // ----------------- CUSTOM TOOLTIP -----------------
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 shadow-xl rounded-lg border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
            color: "var(--text-main)",
          }}
        >
          <p className="text-sm font-bold mb-1">
            {label || payload[0].name}
          </p>
          <p className="text-sm font-medium" style={{ color: "#4f46e5" }}>
            Total: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* === CARD 1: STATUS KONVERSI (BAR + PIE UNKNOWN) === */}
      <div className="card flex flex-col">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-6">
          Status Konversi
        </h3>

        <div className="flex flex-col lg:flex-row gap-4 w-full h-72">
          {/* BAR CHART STATUS */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusBarData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  strokeOpacity={0.1}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  width={100}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="value"
                  fill="#4f46e5"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART UNKNOWN vs CONTACTED */}
          <div className="w-full lg:w-44 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contactedVsUnknownPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {contactedVsUnknownPieData.map((entry, idx) => (
                    <Cell
                      key={`pie-cell-${idx}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-main text-xs font-medium ml-1">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* === CARD 2: TOP 5 PEKERJAAN PROSPEK (BAR CHART) === */}
      <div className="card flex flex-col">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-6">
          Top 5 Pekerjaan Prospek
        </h3>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={jobBarData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                strokeOpacity={0.1}
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="count"
                fill="#4f46e5"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}