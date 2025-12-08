import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom"; 
import ProgressBar from "./ProgressBar";
import { updateLeadStatus } from "../services/leadsService"; 

export default function CustomerTable({ customers = [], onContactSaved }) {
  const [selected, setSelected] = useState(null);
  const [subscribedChoice, setSubscribedChoice] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. STATE FILTER (Fitur Tambahan) ---
  const [statusFilter, setStatusFilter] = useState("all"); 

  // --- 2. LOGIC FILTERING ---
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "not_contacted") return !c.lastContacted;
      if (statusFilter === "contacted") return c.lastContacted;
      if (statusFilter === "closing") return c.subscribed === true;
      if (statusFilter === "failed") return c.subscribed === false;
      if (statusFilter === "unknown") return c.lastContacted && (c.subscribed === null || c.subscribed === undefined);
      return true;
    });
  }, [customers, statusFilter]);

  const openContactModal = (c) => {
    setSelected(c);
    setSubscribedChoice(c.subscribed); 
    setNotes(c.notes || "");
  };

  const doContact = async () => {
    if (!selected) return;
    
    setIsSaving(true);
    try {
      let statusDB = 'new'; 
      if (subscribedChoice === true) statusDB = 'closing';
      if (subscribedChoice === false) statusDB = 'failed';

      await updateLeadStatus(selected.id, { 
        status: statusDB, 
        notes: notes 
      });

      if (onContactSaved) onContactSaved();
      
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Gagal update ke Database: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. HELPER BADGE STATUS ---
  // Menggunakan Tailwind sederhana yang aman
  const renderStatusBadge = (c) => {
    if (!c.lastContacted) {
      return <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">📞 Belum Dihubungi</span>;
    }
    if (c.subscribed === true) {
      return <span className="badge-yes">Closing</span>; // Menggunakan class CSS Anda
    }
    if (c.subscribed === false) {
      return <span className="badge-no">Menolak</span>; // Menggunakan class CSS Anda
    }
    return <span className="badge-unk">Follow Up</span>; // Menggunakan class CSS Anda
  };

  return (
    <>
      {/* --- UI FILTER (Menggunakan class 'input-field' agar warna ikut tema) --- */}
      <div className="flex items-center justify-between mb-4 px-1 gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-muted uppercase">Filter:</label>
          <select 
            className="input-field py-1 px-3 w-auto text-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">📂 Semua Data</option>
            <option value="not_contacted">📞 Belum Dihubungi</option>
            <option value="contacted">✅ Sudah Dihubungi</option>
            <option value="closing">💰 Berlangganan</option>
            <option value="failed">⛔ Menolak</option>
            <option value="unknown">⏳ Belum Jelas</option>
          </select>
        </div>
        
        <span className="text-xs text-muted">
          Total: <b>{filteredCustomers.length}</b> Data
        </span>
      </div>

      <div className="table-scroll">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Umur</th>
              <th>Pekerjaan</th>
              <th>Score</th>
              <th>Probabilitas</th>
              <th>Last Contact</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 && (
              <tr><td colSpan={9} className="py-8 text-center text-muted italic">Tidak ada data sesuai filter</td></tr>
            )}
            
            {/* Menggunakan filteredCustomers untuk looping */}
            {filteredCustomers.map((c) => (
              <tr key={c.id}>
                <td className="text-xs text-muted">#{c.id}</td>
                
                <td>
                  <Link 
                    to={`/sales/customer/${c.id}`} 
                    className="font-bold text-main hover:text-indigo-600 hover:underline transition-colors"
                    title="Lihat Detail Profil"
                  >
                    {c.name}
                  </Link>
                </td>
                
                <td>{c.age ?? "-"}</td>
                <td>{c.job ?? "-"}</td>
                
                <td className="font-bold text-main">{Math.round((c.score ?? 0) * 100)}%</td>
                
                <td style={{ width: 180 }}>
                  <div className="flex items-center gap-3">
                    <div className="flex-1"><ProgressBar value={c.score ?? 0} /></div>
                  </div>
                </td>
                
                <td>
                  {c.lastContacted ? (
                    <div className="flex flex-col">
                        <span className="text-xs text-main font-bold">
                          {new Date(c.lastContacted).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-[10px] text-muted">
                          {new Date(c.lastContacted).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                  ) : <span className="text-muted opacity-50">-</span>}
                </td>
                
                <td>
                  {renderStatusBadge(c)}
                </td>
                
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openContactModal(c)} className="btn btn-ghost btn-small">Hubungi</button>
                    <button onClick={() => { navigator.clipboard?.writeText(c.raw?.phone || ""); alert("Nomor disalin"); }} className="btn btn-primary btn-small">
                       Salin
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (STRUKTUR ASLI, TIDAK AKAN RUSAK DI DARK MODE) --- */}
      {selected && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="modal-header">
              <div>
                <h2 className="text-xl font-bold text-main">Catatan Panggilan</h2>
                <div className="text-sm text-muted mt-1">{selected.name} · {selected.job} · {selected.raw?.phone || "No Phone"}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl font-bold text-muted hover:text-main transition-colors">✕</button>
            </div>

            <div className="p-6"> 
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-3">Hasil Konfirmasi Langganan</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSubscribedChoice(true)} className={`contact-choice ${subscribedChoice === true ? "contact-choice-yes" : "border"}`}>Ya, Berlangganan</button>
                    <button type="button" onClick={() => setSubscribedChoice(false)} className={`contact-choice ${subscribedChoice === false ? "contact-choice-no" : "border"}`}>Menolak</button>
                    <button type="button" onClick={() => setSubscribedChoice(null)} className={`contact-choice ${subscribedChoice === null ? "contact-choice-unk" : "border"}`}>Belum Jelas</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Catatan Sales</label>
                  <textarea 
                      className="input-field min-h-[120px]" 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="Tulis hasil pembicaraan, alasan penolakan, atau jadwal follow-up..." 
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-theme">
                <button onClick={() => setSelected(null)} className="btn btn-ghost" disabled={isSaving}>Batal</button>
                <button onClick={doContact} className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? "Menyimpan..." : "Simpan Progress"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}