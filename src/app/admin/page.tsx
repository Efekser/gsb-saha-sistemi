"use client";

import { useState, useMemo, useEffect } from "react";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"aktif" | "gecmis">("aktif");
  const [slotlarAcik, setSlotlarAcik] = useState(true);
  const [duyuru, setDuyuru] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allAppointments, setAllAppointments] = useState([]);

  const isSystemOpenForAdmin = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); 
    const hours = now.getHours();
    if (day === 6 && hours >= 9) return true;
    if (day === 0 || day < 6) return true; 
    return false;
  }, []);

  const updateStatus = (id: number, newStatus: string) => {
    setAllAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const changeDate = (id: number, newDate: string) => {
    setAllAppointments(prev => prev.map(app => app.id === id ? { ...app, date: newDate } : app));
  };

  const filteredData = useMemo(() => {
    return allAppointments
      .filter(app => (tab === "aktif" ? !app.isPast : app.isPast))
      .filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        app.phone.includes(searchTerm)
      );
  }, [allAppointments, tab, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#002B67] font-sans pb-10 text-left">
      <div className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 shadow-sm backdrop-blur-md px-4 md:px-6 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="text-left font-black tracking-tighter uppercase text-base md:text-lg lg:text-xl">
            RANDEVU YÖNETİM PANELİ
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <div className="relative group flex-1">
              <input 
                type="text" 
                placeholder="Randevu Ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold outline-none transition-all focus:border-[#002B67] focus:bg-white focus:ring-4 focus:ring-[#002B67]/5"
              />
              <span className="absolute left-3.5 top-2.5 md:top-3 text-slate-400">🔍</span>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner overflow-hidden">
              <button 
                onClick={() => setTab("aktif")} 
                className={`flex-1 sm:flex-none px-4 md:px-8 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${tab === "aktif" ? "bg-white text-[#002B67] shadow-md" : "text-slate-400 hover:text-[#002B67]"}`}
              >
                GÜNCEL
              </button>
              <button 
                onClick={() => setTab("gecmis")} 
                className={`flex-1 sm:flex-none px-4 md:px-8 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${tab === "gecmis" ? "bg-white text-[#002B67] shadow-md" : "text-slate-400 hover:text-[#002B67]"}`}
              >
                ARŞİV
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-[12px] font-black text-[#002B67] mb-6 md:mb-8 uppercase tracking-[0.3em] border-b border-slate-100 pb-4 md:pb-5">
              SİSTEM KONTROL
            </h3>
            
            <div className="flex items-center justify-between p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-6 md:mb-8 transition-all hover:border-[#002B67]/20">
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest opacity-80">RANDEVU ALIMI</span>
              <button 
                onClick={() => setSlotlarAcik(!slotlarAcik)} 
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg ${slotlarAcik ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"}`}
              >
                {slotlarAcik ? "AÇIK" : "KAPALI"}
              </button>
            </div>

            <div className="space-y-4 md:y-5 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">KULLANICI BİLGİLENDİRME YAZISI</label>
              <textarea 
                value={duyuru} 
                onChange={(e) => setDuyuru(e.target.value)} 
                placeholder="Örn: Saha bakımı nedeniyle slotlar kapalıdır."
                className="w-full h-36 md:h-44 rounded-2xl bg-slate-50 border-2 border-slate-100 p-4 md:p-6 text-sm font-bold text-[#002B67] outline-none resize-none transition-all focus:border-[#002B67] focus:bg-white" 
              />
              <button className="w-full py-3 md:py-4 bg-[#002B67] hover:bg-[#1a365d] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#002B67]/20 transition-all active:scale-95">
                DUYURUYU GÜNCELLE
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 md:p-6 rounded-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 text-blue-800">Sistem Bilgisi</h4>
            <p className="text-xs font-semibold text-blue-700 leading-relaxed">
              Sistem her hafta sonu kendini yeniler. Yeni hafta randevuları Cumartesi 09:00'da admin için, 10:00'da tüm kullanıcılar için açılır.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 md:px-10 py-5 md:py-7 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-black uppercase tracking-tighter text-[#002B67] text-base md:text-lg leading-none">
              {tab === "aktif" ? "AKTİF RANDEVULAR" : "ARŞİV KAYITLARI"}
            </h3>
            <span className="bg-[#002B67] text-white text-[9px] md:text-[10px] font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full uppercase tracking-widest">
              {filteredData.length} KAYIT
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                  <th className="px-6 md:px-10 py-5 md:py-6">KULLANICI / İLETİŞİM</th>
                  <th className="px-6 md:px-10 py-5 md:py-6 text-center">TÜRLER / TARİH</th>
                  <th className="px-6 md:px-10 py-5 md:py-6 text-center">DURUM</th>
                  <th className="px-6 md:px-10 py-5 md:py-6 text-right">İŞLEMLER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length > 0 ? filteredData.map((app) => (
                  <tr key={app.id} className="hover:bg-[#002B67]/[0.02] transition-colors">
                    <td className="px-6 md:px-10 py-6 md:py-8">
                      <p className="text-sm md:text-base font-black uppercase tracking-tight text-[#002B67] leading-none">{app.name}</p>
                      <p className="text-[10px] md:text-[11px] font-black text-[#E30A17] mt-2 md:mt-3 tabular-nums">{app.phone}</p>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-center">
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">{app.area}</p>
                      <input 
                        type="date" 
                        value={app.date.split('.').reverse().join('-')}
                        onChange={(e) => changeDate(app.id, e.target.value.split('-').reverse().join('.'))}
                        className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded outline-none focus:ring-1 focus:ring-[#002B67]"
                      />
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-center">
                      <span className={`text-[9px] font-black uppercase px-3 md:px-4 py-1.5 md:py-2 rounded-lg border-2 ${
                        app.status === 'ONAYLANDI' || app.status === 'TAMAMLANDI' 
                        ? 'border-green-100 text-green-600 bg-green-50' 
                        : 'border-yellow-100 text-yellow-600 bg-yellow-50'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                      {tab === "aktif" ? (
                        <div className="flex justify-end gap-2 md:gap-3">
                          <button 
                            onClick={() => updateStatus(app.id, 'ONAYLANDI')} 
                            className="p-2 md:px-4 md:py-2 bg-[#002B67] text-white rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase shadow-md transition-all active:scale-95"
                          >
                            <span className="hidden sm:inline">ONAYLA</span>
                            <span className="sm:hidden">✓</span>
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'İPTAL EDİLDİ')} 
                            className="p-2 md:px-4 md:py-2 bg-red-600 text-white rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase shadow-md transition-all active:scale-95"
                          >
                            <span className="hidden sm:inline">İPTAL</span>
                            <span className="sm:hidden">✕</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest opacity-40">ARŞİV</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center text-slate-400 font-bold uppercase tracking-widest opacity-30 text-xs">
                      Veri bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}