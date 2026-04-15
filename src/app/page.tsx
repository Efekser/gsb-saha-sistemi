"use client";

import { useState } from "react";

export default function Home() {
  const [adim, setAdim] = useState(1);
  const [seciliGun, setSeciliGun] = useState<number | null>(null);
  const [seciliSaha, setSeciliSaha] = useState<string | null>(null);
  const [seciliSaat, setSeciliSaat] = useState<string | null>(null);
  const [onayKodu, setOnayKodu] = useState("");
  
  const [formData, setFormData] = useState({
    ad_soyad: "",
    telefon: "",
    eposta: ""
  });

  const simdi = new Date();
  const buGunHangiGun = simdi.getDate();
  const buSaatKac = simdi.getHours();
  const ayIsmi = simdi.toLocaleString('tr-TR', { month: 'long' });
  const yil = simdi.getFullYear();
  const ayinGunSayisi = new Date(yil, simdi.getMonth() + 1, 0).getDate();
  const gunler = Array.from({ length: ayinGunSayisi }, (_, i) => i + 1);
  const tumSaatler = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  const adimlar = [
    { n: 1, baslik: "Tarih" },
    { n: 2, baslik: "Saha & Saat" },
    { n: 3, baslik: "Kayıt" },
    { n: 4, baslik: "Doğrulama" },
    { n: 5, baslik: "Onay" }
  ];

  const formatTelefon = (value: string) => {
    const sadeceSayi = value.replace(/\D/g, "");
    if (sadeceSayi.length > 11) return formData.telefon;
    let res = sadeceSayi;
    if (sadeceSayi.length > 4) res = `${sadeceSayi.slice(0, 4)} ${sadeceSayi.slice(4)}`;
    if (sadeceSayi.length > 7) res = `${res.slice(0, 8)} ${sadeceSayi.slice(7)}`;
    if (sadeceSayi.length > 9) res = `${res.slice(0, 11)} ${sadeceSayi.slice(9)}`;
    return res;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "telefon") {
      setFormData(prev => ({ ...prev, telefon: formatTelefon(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const formGecerli = 
    formData.ad_soyad.trim().length > 3 && 
    formData.telefon.length === 14 && 
    formData.eposta.includes("@") &&
    formData.eposta.split("@")[0].length > 0;

  const sahalar = [
    { id: "Voleybol Sahası", emoji: "🏐" },
    { id: "Basketbol Sahası", emoji: "🏀" }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between mb-16 relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full" />
        {adimlar.map((item) => (
          <div key={item.n} className="flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${adim >= item.n ? "bg-[#002B67] text-white scale-110 shadow-lg" : "bg-white text-slate-400 border-2 border-slate-200"}`}>
              {item.n}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${adim >= item.n ? "text-[#002B67]" : "text-slate-400"}`}>
              {item.baslik}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 p-8 md:p-12 transition-all">
        
        {adim === 1 && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#002B67] shadow-inner border border-blue-100 font-bold text-3xl flex items-center justify-center">🗓️</div>
            <h2 className="text-3xl font-black text-[#002B67] tracking-tight mb-2 uppercase tracking-tighter">Tarih Seçin</h2>
            <p className="text-[#E30A17] font-bold mb-10 text-xs tracking-[0.2em] uppercase underline decoration-[#E30A17] underline-offset-8 decoration-2">
              {seciliGun ? `${seciliGun} ${ayIsmi.toUpperCase()} ${yil}` : "GEÇMİŞ TARİHLERE RANDEVU ALINAMAZ"}
            </p>
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 mb-10 shadow-inner">
              <div className="mb-6"><span className="font-black text-[#002B67] uppercase tracking-[0.3em] text-lg">{ayIsmi} {yil}</span></div>
              <div className="grid grid-cols-7 gap-3 max-w-xs mx-auto">
                {gunler.map((g) => {
                  const gecmisGun = g < buGunHangiGun;
                  return (
                    <button key={g} disabled={gecmisGun} onClick={() => setSeciliGun(g)} className={`aspect-square flex items-center justify-center text-sm font-black rounded-2xl transition-all border-2 ${gecmisGun ? "bg-slate-100 text-slate-300 border-transparent cursor-not-allowed opacity-50" : seciliGun === g ? "bg-[#E30A17] text-white border-[#E30A17] scale-110 shadow-xl" : "bg-white text-slate-700 border-transparent hover:border-[#002B67] hover:text-[#002B67] shadow-sm"}`}>{g}</button>
                  );
                })}
              </div>
            </div>
            <button disabled={!seciliGun} onClick={() => setAdim(2)} className="w-full max-w-sm py-5 rounded-[1.5rem] font-black text-lg shadow-2xl transition-all active:scale-95 uppercase tracking-widest bg-[#002B67] text-white hover:bg-[#001940] disabled:bg-slate-300 disabled:text-slate-500">Devam Et</button>
          </div>
        )}

        {adim === 2 && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center font-black text-[#002B67] uppercase tracking-tighter">
              <h2 className="text-3xl leading-none">Saha ve Saat Seçimi</h2>
              <div className="mt-3 inline-block px-4 py-1.5 bg-blue-50 text-[#002B67] rounded-full text-[10px] tracking-widest border border-blue-100 uppercase">{seciliGun} {ayIsmi} {yil}</div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {sahalar.map((saha) => (
                <button key={saha.id} onClick={() => setSeciliSaha(saha.id)} className={`p-8 rounded-[2rem] border-4 font-black transition-all text-left group ${seciliSaha === saha.id ? "border-[#002B67] bg-white text-[#002B67] shadow-xl" : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"}`}>
                  <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center text-3xl transition-transform ${seciliSaha === saha.id ? "bg-blue-50 scale-110" : "bg-white"}`}>{saha.emoji}</div>
                  {saha.id.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {tumSaatler.map((saat) => {
                const saatParcasi = parseInt(saat.split(":")[0]);
                const saatGecmis = seciliGun === buGunHangiGun && saatParcasi <= buSaatKac;
                return (
                  <button key={saat} disabled={saatGecmis} onClick={() => setSeciliSaat(saat)} className={`p-4 rounded-2xl border-2 font-black text-sm transition-all ${saatGecmis ? "bg-slate-100 text-slate-300 border-transparent cursor-not-allowed opacity-50" : seciliSaat === saat ? "bg-[#002B67] text-white border-[#002B67] shadow-lg scale-105" : "bg-white border-slate-100 text-slate-600 hover:border-[#002B67]"}`}>{saat}</button>
                );
              })}
            </div>
            <div className="flex gap-4 pt-4 border-t border-slate-50">
              <button onClick={() => setAdim(1)} className="flex-1 py-5 font-black text-slate-400 bg-slate-50 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-colors">Geri</button>
              <button disabled={!seciliSaha || !seciliSaat} onClick={() => setAdim(3)} className="flex-[2] py-5 rounded-2xl font-black transition-all uppercase tracking-widest bg-[#002B67] text-white disabled:bg-slate-300 shadow-xl shadow-blue-900/20">Kayıt Ekranı</button>
            </div>
          </div>
        )}

        {adim === 3 && (
          <div className="space-y-10 max-w-md mx-auto animate-in fade-in duration-500">
            <div className="text-center font-black">
              <h2 className="text-3xl text-[#002B67] uppercase tracking-tighter leading-none">Kayıt Bilgileri</h2>
              <p className="text-[#E30A17] text-[10px] font-black uppercase mt-2 tracking-[0.25em]">{seciliSaha} / {seciliSaat}</p>
            </div>
            <div className="space-y-5">
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Ad Soyad</label><input name="ad_soyad" type="text" placeholder="ÖR: AHMET YILMAZ" value={formData.ad_soyad} onChange={handleInputChange} className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-[#002B67] outline-none font-bold uppercase placeholder:text-slate-200 shadow-sm" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Telefon</label><input name="telefon" type="tel" placeholder="05XX XXX XX XX" value={formData.telefon} onChange={handleInputChange} className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-[#002B67] outline-none font-bold tracking-[0.2em] placeholder:text-slate-200 shadow-sm" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">E-Posta</label><input name="eposta" type="text" placeholder="Ornek@mail.com" value={formData.eposta} onChange={handleInputChange} className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-[#002B67] outline-none font-bold placeholder:text-slate-200 shadow-sm" /></div>
            </div>
            <div className="flex gap-4 pt-4 border-t border-slate-50">
              <button onClick={() => setAdim(2)} className="flex-1 py-5 font-black text-slate-400 bg-slate-50 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-colors">Geri</button>
              <button disabled={!formGecerli} onClick={() => setAdim(4)} className="flex-[2] py-5 rounded-2xl font-black bg-[#002B67] text-white uppercase tracking-widest disabled:bg-slate-300 shadow-xl shadow-blue-900/20">Onay Kodu Gönder</button>
            </div>
          </div>
        )}

        {adim === 4 && (
          <div className="space-y-10 max-w-md mx-auto animate-in zoom-in duration-500">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-50 text-[#002B67] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">✉️</div>
              <h2 className="text-3xl font-black text-[#002B67] uppercase tracking-tighter leading-none">Doğrulama</h2>
              <p className="text-slate-400 text-[10px] font-black mt-2 leading-relaxed uppercase tracking-widest">
                <span className="text-[#002B67] normal-case">{formData.eposta}</span> ADRESİNE GÖNDERİLEN 6 HANELİ KODU GİRİNİZ.
              </p>
            </div>
            <input 
              type="text" 
              maxLength={6} 
              placeholder="000000"
              value={onayKodu}
              onChange={(e) => setOnayKodu(e.target.value.replace(/\D/g, ""))}
              className="w-full p-6 text-center text-4xl font-black tracking-[0.5em] border-2 border-slate-100 rounded-3xl focus:border-[#002B67] outline-none text-[#002B67] bg-slate-50 focus:bg-white transition-all shadow-inner" 
            />
            <div className="flex gap-4 pt-4 border-t border-slate-50">
              <button onClick={() => setAdim(3)} className="flex-1 py-5 font-black text-slate-400 bg-slate-50 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-colors">Geri</button>
              <button 
                disabled={onayKodu.length !== 6} 
                onClick={() => setAdim(5)} 
                className="flex-[2] py-5 rounded-2xl font-black bg-[#002B67] text-white disabled:bg-slate-300 uppercase tracking-widest shadow-xl shadow-blue-900/10"
              >
                Onayla ve Bitir
              </button>
            </div>
          </div>
        )}

        {adim === 5 && (
          <div className="text-center py-6 space-y-10 animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-blue-50 text-[#002B67] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-blue-100 transition-transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-4xl font-black text-[#002B67] uppercase tracking-tighter leading-none leading-[0.85]">Randevunuz<br/>Oluşturuldu</h2>
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-[11px] font-black text-slate-400 space-y-4 uppercase tracking-widest shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-[#002B67]" />
              <div className="flex justify-between border-b border-slate-200 pb-3"><span>KİŞİ</span><span className="text-[#002B67] font-black">{formData.ad_soyad}</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-3"><span>SAHA</span><span className="text-[#002B67] font-black">{seciliSaha}</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-3"><span>TARİH</span><span className="text-[#002B67] font-black">{seciliGun} {ayIsmi.toUpperCase()} {yil}</span></div>
              <div className="flex justify-between"><span>SAAT</span><span className="text-[#002B67] font-black">{seciliSaat}</span></div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] max-w-sm mx-auto italic leading-relaxed">Onay kodu <span className="normal-case text-[#002B67] font-black bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">{formData.eposta}</span> adresine iletildi.</p>
            <div className="w-16 h-1 bg-[#002B67] mx-auto rounded-full mt-4 mb-2 shadow-sm opacity-80"></div>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic leading-none">Randevu Detayları e-postanıza gönderilmiştir.</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-10 py-4 bg-[#002B67] text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-blue-900/20 hover:bg-[#E30A17] transition-all duration-300 active:scale-95">Yeni Randevu Oluştur</button>
          </div>
        )}
      </div>
    </div>
  );
}