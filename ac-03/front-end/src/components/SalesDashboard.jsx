import React, { useState, useMemo, useEffect, useCallback } from "react";
import Layout from "./Layout";
import KPI from "./KPI";
import CustomerTable from "./CustomerTable";
import Pagination from "./Pagination";
import SalesCharts from "./SalesCharts"; 
import Leaderboard from "./Leaderboard";       
import RecentActivity from "./RecentActivity"; 
import LoadingScreen from "./LoadingScreen";

// IMPORT SERVICE DATABASE
import { fetchLeads, fetchLeadsStats } from "../services/leadsService";

export default function SalesDashboard() {
  const [query, setQuery] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [jobFilter, setJobFilter] = useState("All");

  // State Filter Status
  const [statusFilter, setStatusFilter] = useState("new"); 
  
  const [customers, setCustomers] = useState([]); 
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState(null);

  // Pagination state
  const pageSizeOptions = [5, 10, 25, 50, 100];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- 1. LOAD DATA (Fetch All) ---
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsResponse, statsData] = await Promise.all([
        fetchLeads({ 
          limit: 50000, 
          sort: "probability_desc" 
        }), 
        fetchLeadsStats(),
      ]);

      const rawItems = leadsResponse.items || leadsResponse || [];
      const safeLeads = Array.isArray(rawItems) ? rawItems : [];

      // MAPPING Data
      const mapped = safeLeads.map((row, index) => {
        
        // --- PERBAIKAN LOGIKA STATUS ---
        // Kita ambil status asli, ubah ke huruf kecil
        let rawStatus = row.status ? row.status.toLowerCase() : "new";
        
        // Normalisasi: Jika database mengirim "follow_up" atau "follow-up",
        // kita ubah paksa menjadi "follow up" (pakai spasi) agar cocok dengan filter button.
        if (rawStatus === "follow_up" || rawStatus === "follow-up" || rawStatus === "followup") {
            rawStatus = "follow up";
        }

        return {
          id: row.nasabah_id, 
          name: row.name || `Prospek #${index + 1}`,
          age: row.age,
          job: row.job,
          marital: row.marital,
          education: row.education,
          phone: row.phone,
          loanStatus: row.loan === 'yes' ? 'Punya pinjaman' : 'Tidak punya pinjaman',
          
          // Gunakan status yang sudah dinormalisasi di atas
          status: rawStatus, 

          score: Number(row.probability || 0), 
          probability: Number(row.probability || 0),
          lastContacted: row.updated_at || null,
          notes: row.notes || "",
          raw: row, 
        };
      });

      setCustomers(mapped);
      setStats(statsData); 

    } catch (err) {
      console.error("Gagal load data:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);


  // --- 2. FILTERING LOGIC ---
  const jobs = useMemo(() => {
    const list = Array.isArray(customers) ? customers : [];
    const set = new Set(list.map((c) => c.job).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [customers]);

  const filtered = useMemo(() => {
    return customers
      // 1. Filter Status
      .filter((c) => {
        if (statusFilter === "all") return true; 
        // Sekarang aman membandingkan karena 'c.status' sudah pasti formatnya benar
        return c.status === statusFilter;
      })
      // 2. Filter Score
      .filter((c) => c.score >= minScore)
      // 3. Filter Job
      .filter((c) => (jobFilter === "All" ? true : c.job === jobFilter))
      // 4. Search
      .filter((c) =>
        (c.name + (c.job || "")).toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.score - a.score);
  }, [customers, query, minScore, jobFilter, statusFilter]);

  // Reset page ke 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [query, minScore, jobFilter, statusFilter, pageSize]);

  // --- 3. PAGINATION LOGIC ---
  const totalRow = filtered.length; 
  
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // KPI
  const topLeads = customers.filter((c) => c.score >= 0.7).length;
  const convRate = customers.length > 0 ? `${Math.round((topLeads / customers.length) * 100)}%` : "0%";

  if (loading && customers.length === 0) {
    return <LoadingScreen />;
  }

  // Helper styling tombol status
  const getStatusBtnClass = (s) => 
    `px-4 py-2 text-sm font-bold rounded-full transition-all whitespace-nowrap ${
      statusFilter === s 
      ? "bg-indigo-600 text-white shadow-lg transform scale-105" 
      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-indigo-300"
    }`;

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">Dashboard Prospek</h1>
          <p className="text-muted text-sm mt-1">Kelola dan hubungi prospek prioritas tinggi.</p>
        </div>
        <div className="w-full sm:w-72">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Cari nama atau pekerjaan..."
            className="input-field"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <KPI title="Total Prospek" value={customers.length} />
        <KPI title="Prospek Hot (>=70%)" value={topLeads} />
        <KPI title="Potensi Konversi" value={convRate} />
      </div>

      <SalesCharts data={filtered.length > 0 ? filtered : customers} />

      {/* FILTER BUTTONS ROW */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
         <button onClick={() => setStatusFilter("all")} className={getStatusBtnClass("all")}>All</button>
         <button onClick={() => setStatusFilter("new")} className={getStatusBtnClass("new")}>New</button>
         {/* <button onClick={() => setStatusFilter("contacted")} className={getStatusBtnClass("contacted")}>Contacted</button> */}
         {/* Tombol Follow Up: value state adalah "follow up" */}
         <button onClick={() => setStatusFilter("in_progress")} className={getStatusBtnClass("follow up")}>Follow Up</button>
         <button onClick={() => setStatusFilter("failed")} className={getStatusBtnClass("failed")}>Failed</button>
         <button onClick={() => setStatusFilter("success")} className={getStatusBtnClass("success")}>Success</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        
        {/* TABLE SECTION */}
        <div className="lg:col-span-3 card h-fit">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-theme">
            <h3 className="font-bold text-main flex items-center gap-2">
              Daftar Prospek 
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded capitalize">
                {statusFilter}
              </span>
            </h3>
            <span className="text-xs text-muted font-medium bg-opacity-10 px-3 py-1 rounded-full border border-theme">
               Total: {totalRow} Data
            </span>
          </div>

          <CustomerTable 
            customers={paginated} 
            onContactSaved={loadData} 
          />

          <Pagination
            total={totalRow} 
            page={page}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            pageSizeOptions={pageSizeOptions}
          />
        </div>

        {/* SIDEBAR FILTER */}
        <aside className="card h-fit lg:sticky lg:top-6">
          <h3 className="font-bold text-main mb-6">Filter Data</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wide">Min Probability</label>
                <span className="text-xs font-bold text-indigo-600">{Math.round(minScore * 100)}%</span>
              </div>
              <input
                type="range" min={0} max={1} step={0.01}
                value={minScore}
                onChange={(e) => setMinScore(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-2">Pekerjaan</label>
              <select
                className="input-field cursor-pointer font-medium"
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
              >
                {jobs.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
            
            <div className="pt-6 border-t border-theme">
                <button 
                  onClick={() => {
                    setMinScore(0); 
                    setJobFilter("All"); 
                    setQuery("");
                    setStatusFilter("all"); 
                  }} 
                  className="w-full btn btn-ghost btn-small text-xs uppercase tracking-wider font-bold"
                >
                    Reset Filter
                </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Leaderboard />
        <RecentActivity />
      </div>

    </Layout>
  );
}