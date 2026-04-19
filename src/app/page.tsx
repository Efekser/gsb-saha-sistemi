"use client";

import { useState, useMemo, useEffect, useRef } from "react";

export default function Home() {
  const [islemTuru, setIslemTuru] = useState<"al" | "sorgula" | null>(null);
  const [adim, setAdim] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [seciliGun, setSeciliGun] = useState<number | null>(null);
  const [seciliSaha, setSeciliSaha] = useState<string | null>(null);
  const [seciliSaat, setSeciliSaat] = useState<string | null>(null);
  const [onayKodu, setOnayKodu] = useState("");
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [kvkkModal, setKvkkModal] = useState(false);

  const [formData, setFormData] = useState({
    ad: "",
    soy_ad: "",
    telefon: "",
    eposta: "",
  });

  const katilimciSayisi = seciliSaha === "Basketbol Sahası" ? 9 : 11;
  const [katilimcilar, setKatilimcilar] = useState<string[]>(
    Array(11).fill(""),
  );

  const firstInputRef = useRef<HTMLInputElement>(null);

  const simdi = useMemo(() => new Date(), []);
  const ayIsmi = simdi.toLocaleString("tr-TR", { month: "long" });
  const yil = simdi.getFullYear();
  const ayIndex = simdi.getMonth();
  const buGun = simdi.getDate();
  const buSaat = simdi.getHours();

  const takvimVerileri = useMemo(() => {
    const ilkGun = new Date(yil, ayIndex, 1).getDay();
    const ayinGunSayisi = new Date(yil, ayIndex + 1, 0).getDate();
    const gunBosluklari = ilkGun === 0 ? 6 : ilkGun - 1;
    const gunler = [];
    for (let i = 0; i < gunBosluklari; i++) gunler.push(null);
    for (let i = 1; i <= ayinGunSayisi; i++) gunler.push(i);
    return gunler;
  }, [yil, ayIndex]);

  const haftaninGunleri = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const tumSaatler = useMemo(() => {
    const hours = [];
    for (let i = 9; i <= 23; i++) {
      hours.push(`${i < 10 ? "0" + i : i}:00`);
    }
    return hours;
  }, []);

  const adimlar = [
    { n: 1, b: "TARİH" },
    { n: 2, b: "SAHA" },
    { n: 3, b: "KAYIT" },
    { n: 4, b: "KOD" },
    { n: 5, b: "TAKIM" },
    { n: 6, b: "ONAY" },
  ];

  const [sorguEposta, setSorguEposta] = useState("");
  const [bulunanRandevu, setBulunanRandevu] = useState<any>(null);

  const anasayfayaDon = () => {
    setIslemTuru(null);
    setAdim(1);
    setSeciliGun(null);
    setSeciliSaha(null);
    setSeciliSaat(null);
    setOnayKodu("");
    setKvkkOnay(false);
    setFormData({ ad: "", soy_ad: "", telefon: "", eposta: "" });
    setKatilimcilar(Array(11).fill(""));
    setSorguEposta("");
    setBulunanRandevu(null);
    window.history.pushState(null, "", window.location.pathname);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    if (adim >= 3 || islemTuru === "sorgula") {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 300);
    }
  }, [adim, islemTuru]);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (!hash) {
        setIslemTuru(null);
        setAdim(1);
      } else {
        const currentStep = parseInt(hash.replace("#step", ""));
        if (currentStep) setAdim(currentStep);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const sonrakiAdim = (n: number) => {
    setAdim(n);
    window.history.pushState({ step: n }, "", `#step${n}`);
  };

  const islemBaslat = (tur: "al" | "sorgula") => {
    setIslemTuru(tur);
    setAdim(1);
    window.history.pushState({ tur, step: 1 }, "", "#step1");
  };

  const formatPhoneNumber = (value: string) => {
    const s = value.replace(/\D/g, "");
    let r = "";
    if (s.length > 0) r = s.substring(0, 4);
    if (s.length > 4) r += " " + s.substring(4, 7);
    if (s.length > 7) r += " " + s.substring(7, 9);
    if (s.length > 9) r += " " + s.substring(9, 11);
    return r;
  };

  const handleInputChange = (field: string, value: string) => {
    let v = value;
    if (field === "ad" || field === "soy_ad") v = value.toUpperCase();
    if (field === "telefon") v = formatPhoneNumber(value);
    setFormData((prev) => ({ ...prev, [field]: v }));
  };

  const epostaRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const formGecerli =
    formData.ad.length > 1 &&
    formData.soy_ad.length > 1 &&
    formData.telefon.length === 14 &&
    epostaRegex.test(formData.eposta) &&
    kvkkOnay;

  const takimGecerli = useMemo(() => {
    const aktifListe = katilimcilar.slice(0, katilimciSayisi);
    return aktifListe.every((k) => k.trim().length > 3);
  }, [katilimcilar, katilimciSayisi]);

  const iptalButonuAktif = (randevuGunu: number) => {
    const randevuTarihi = new Date(yil, ayIndex, randevuGunu);
    const fark = randevuTarihi.getTime() - simdi.getTime();
    return fark / (1000 * 60 * 60) > 24;
  };

  const handleSorgula = () => {
    if (epostaRegex.test(sorguEposta)) {
      setBulunanRandevu({
        ad: "AHMET YILMAZ",
        saha: "Voleybol Sahası",
        tarih: buGun + 2,
        saat: "14:00",
        durum: "Beklemede",
      });
    }
  };

  return (
    <div
      className={`w-full transition-colors duration-300 ${isDarkMode ? "bg-[#0f172a] text-white" : "bg-white text-slate-900"} font-roboto antialiased overflow-x-hidden touch-manipulation min-h-screen flex flex-col`}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap");
        body {
          font-family: "Roboto", sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        input,
        select,
        textarea {
          font-size: 16px !important;
        }
        .ios-scroll {
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "#334155" : "#cbd5e1"};
          border-radius: 10px;
        }
      `}</style>

      {kvkkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setKvkkModal(false)}
          />
          <div
            className={`relative w-full max-w-lg max-h-[70vh] overflow-y-auto rounded-[2.5rem] p-8 shadow-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-100 text-slate-600"} ios-scroll scrollbar-thin`}
          >
            <h3
              className={`text-xl font-black mb-6 uppercase tracking-tighter ${isDarkMode ? "text-white" : "text-[#002B67]"}`}
            >
              KVKK Aydınlatma Metni
            </h3>
            <div className="text-xs leading-relaxed space-y-4 font-medium">
              <p>
                T.C. Gençlik ve Spor Bakanlığı Manavgat İlçe Müdürlüğü olarak,
                randevu sistemimiz üzerinden paylaştığınız kişisel verilerinizi
                (Ad, Soyad, Telefon, E-posta) 6698 sayılı Kişisel Verilerin
                Korunması Kanunu'na uygun olarak işlemekteyiz.
              </p>
              <p>
                Bu veriler, sadece randevu kaydınızın oluşturulması, doğrulama
                kodunun iletilmesi ve gerektiğinde sizinle iletişime geçilmesi
                amacıyla kullanılmaktadır. Verileriniz üçüncü şahıslarla asla
                paylaşılmamaktadır.
              </p>
              <p>
                Sistemimizi kullanarak bu şartları kabul etmiş sayılırsınız.
              </p>
            </div>
            <button
              onClick={() => setKvkkModal(false)}
              className="w-full mt-8 py-4 bg-[#002B67] text-white rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center p-6 md:px-12 h-20">
        <div className="opacity-0 pointer-events-none">GSB</div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-2xl shadow-lg transition-all ${isDarkMode ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-[#002B67]"} active:scale-90`}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {!islemTuru ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700 px-4">
          {/* DUYURU ALANI - GSB MANAVGAT TEPESİNDE */}
          <div
            className={`w-full max-w-2xl p-5 md:p-6 rounded-[2.5rem] border-2 shadow-sm flex items-center gap-5 transition-all ${isDarkMode ? "bg-slate-800/40 border-slate-700/50" : "bg-[#002B67]/5 border-[#002B67]/10"}`}
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shrink-0 animate-pulse ${isDarkMode ? "bg-slate-900" : "bg-white shadow-sm"}`}
            >
              📢
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isDarkMode ? "text-slate-400" : "text-[#002B67] opacity-60"}`}
              >
                Sistem Duyurusu
              </h4>
              <p
                className={`text-[13px] md:text-sm font-bold leading-tight ${isDarkMode ? "text-white" : "text-slate-700"}`}
              >
                Yeni halı saha ayakkabıları ile giriş yapılması rica olunur.
                Keyifli maçlar dileriz!
              </p>
            </div>
          </div>

          <div className="text-center">
            <h1
              className={`text-4xl md:text-6xl font-black ${isDarkMode ? "text-white" : "text-[#002B67]"} uppercase tracking-tighter leading-tight`}
            >
              GSB MANAVGAT
            </h1>
            <div className="h-1.5 w-24 bg-[#E30A17] mx-auto rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button
              onClick={() => islemBaslat("al")}
              className="group p-8 md:p-10 bg-[#002B67] text-white rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center border-b-8 border-blue-950"
            >
              <span className="text-4xl mb-4 group-hover:animate-bounce">
                ⚽
              </span>
              <span className="font-black text-lg md:text-xl tracking-widest uppercase text-center">
                Randevu Al
              </span>
            </button>
            <button
              onClick={() => islemBaslat("sorgula")}
              className={`group p-8 md:p-10 ${isDarkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white text-[#002B67] border-[#002B67]"} border-4 rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center border-b-8 ${isDarkMode ? "border-slate-900" : "border-slate-200"}`}
            >
              <span className="text-4xl mb-4 group-hover:animate-[spin_3s_linear_infinite]">
                🔍
              </span>
              <span className="font-black text-lg md:text-xl tracking-widest uppercase text-center">
                Sorgulama
              </span>
            </button>
          </div>
        </div>
      ) : islemTuru === "sorgula" ? (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-2xl mx-auto w-full px-2 pt-4">
          <button
            onClick={anasayfayaDon}
            className={`mb-6 font-black ${isDarkMode ? "text-slate-200" : "text-[#002B67]"} flex items-center gap-2 hover:translate-x-[-4px] transition-all text-sm uppercase bg-transparent border-b-2 ${isDarkMode ? "border-slate-700" : "border-slate-200"} pb-1`}
          >
            ← Ana Sayfaya Dön
          </button>
          <div
            className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-50"} rounded-[2.5rem] shadow-2xl border p-6 md:p-10`}
          >
            <h2
              className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-[#002B67]"} uppercase text-center mb-10 tracking-tighter`}
            >
              Randevu Sorgulama
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSorgula();
              }}
              className="space-y-4 mb-10"
            >
              <div className="space-y-1 text-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  E-POSTA ADRESİ
                </label>
                <input
                  ref={firstInputRef}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="örnek@mail.com"
                  value={sorguEposta}
                  onChange={(e) => setSorguEposta(e.target.value)}
                  className={`w-full h-16 px-6 rounded-2xl border-2 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-[#E30A17]" : "bg-slate-50 border-slate-100 text-slate-900 focus:bg-white focus:border-[#002B67]"} outline-none font-bold text-lg text-center transition-all shadow-inner tracking-tight`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 rounded-2xl font-black bg-[#002B67] text-white uppercase shadow-xl active:scale-95 transition-all tracking-widest"
              >
                SORGULA
              </button>
            </form>

            {bulunanRandevu && (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div
                  className={`p-8 ${isDarkMode ? "bg-slate-900" : "bg-slate-50"} rounded-[2rem] border ${isDarkMode ? "border-slate-700" : "border-slate-100"} relative shadow-inner`}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#E30A17]" />
                  <div className="grid grid-cols-1 gap-4 uppercase text-[11px] font-bold text-slate-400 tracking-widest">
                    <div
                      className={`flex justify-between border-b ${isDarkMode ? "border-slate-800" : "border-white"} pb-3`}
                    >
                      <span>SORUMLU</span>
                      <span
                        className={isDarkMode ? "text-white" : "text-[#002B67]"}
                      >
                        {bulunanRandevu.ad}
                      </span>
                    </div>
                    <div
                      className={`flex justify-between border-b ${isDarkMode ? "border-slate-800" : "border-white"} pb-3`}
                    >
                      <span>SAHA</span>
                      <span
                        className={isDarkMode ? "text-white" : "text-[#002B67]"}
                      >
                        {bulunanRandevu.saha}
                      </span>
                    </div>
                    <div
                      className={`flex justify-between border-b ${isDarkMode ? "border-slate-800" : "border-white"} pb-3`}
                    >
                      <span>TARİH / SAAT</span>
                      <span
                        className={isDarkMode ? "text-white" : "text-[#002B67]"}
                      >
                        {bulunanRandevu.tarih} {ayIsmi.toUpperCase()} /{" "}
                        {bulunanRandevu.saat}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>DURUM</span>
                      <span
                        className={
                          bulunanRandevu.durum === "Kesinleşti"
                            ? "text-green-500 font-black"
                            : "text-orange-500 font-black"
                        }
                      >
                        {bulunanRandevu.durum.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bulunanRandevu.durum === "Beklemede" &&
                    iptalButonuAktif(bulunanRandevu.tarih) && (
                      <button className="py-5 bg-green-600 text-white rounded-2xl font-black text-sm uppercase shadow-lg">
                        KESİNLEŞTİR
                      </button>
                    )}
                  {iptalButonuAktif(bulunanRandevu.tarih) ? (
                    <button
                      className={`py-5 ${isDarkMode ? "bg-slate-700 text-red-400" : "bg-white text-red-600"} border-2 border-red-600 rounded-2xl font-black text-sm uppercase shadow-sm`}
                    >
                      İPTAL ET
                    </button>
                  ) : (
                    <div className="col-span-full p-5 bg-red-900/20 rounded-xl text-red-500 text-[10px] font-bold text-center border border-red-900/30 uppercase tracking-tighter leading-tight">
                      Randevuya 24 saatten az kaldığı için işlem yapılamaz.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500 px-1 pt-4">
          <button
            onClick={anasayfayaDon}
            className={`mb-6 ml-4 font-black ${isDarkMode ? "text-slate-200" : "text-[#002B67]"} flex items-center gap-2 hover:translate-x-[-4px] transition-all text-sm uppercase bg-transparent border-b-2 ${isDarkMode ? "border-slate-700" : "border-slate-200"} pb-1`}
          >
            ← Ana Sayfaya Dön
          </button>

          <div className="flex justify-between mb-12 relative max-w-2xl mx-auto px-6">
            <div
              className={`absolute top-1/2 left-0 w-full h-0.5 ${isDarkMode ? "bg-slate-800" : "bg-slate-100"} -translate-y-1/2 -z-10`}
            />
            {adimlar.map((i) => (
              <div
                key={i.n}
                className="flex flex-col items-center gap-2 relative transition-colors duration-300"
              >
                <div
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-black text-xs md:text-sm transition-all border-2 ${adim >= i.n ? "bg-[#002B67] border-[#002B67] text-white shadow-lg" : isDarkMode ? "bg-[#0f172a] text-slate-600 border-slate-800" : "bg-white text-slate-300 border-slate-100"}`}
                >
                  {i.n}
                </div>
                <span
                  className={`text-[7px] md:text-[9px] font-black tracking-tighter ${adim >= i.n ? (isDarkMode ? "text-white" : "text-[#002B67]") : isDarkMode ? "text-slate-700" : "text-slate-300"}`}
                >
                  {i.b}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-50"} rounded-[2.5rem] shadow-2xl border p-6 md:p-12 min-h-[500px] flex flex-col justify-center relative overflow-hidden text-center mx-2`}
          >
            {adim === 1 && (
              <div className="animate-in fade-in">
                <h2
                  className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-[#002B67]"} uppercase mb-6 tracking-tighter`}
                >
                  Tarih Seçin
                </h2>
                <div
                  className={`p-6 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-[2rem] border mb-8 shadow-inner`}
                >
                  <div
                    className={`mb-6 font-black ${isDarkMode ? "text-slate-400" : "text-[#002B67]"} uppercase tracking-widest text-sm flex justify-center gap-2`}
                  >
                    <span>{ayIsmi}</span>
                    <span>{yil}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 max-w-sm mx-auto mb-2 text-center">
                    {haftaninGunleri.map((hg) => (
                      <div
                        key={hg}
                        className="text-[10px] font-black text-slate-400 uppercase"
                      >
                        {hg}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 max-w-sm mx-auto">
                    {takvimVerileri.map((g, index) => {
                      if (!g)
                        return (
                          <div
                            key={`empty-${index}`}
                            className="aspect-square"
                          />
                        );
                      const gecmis = g < buGun;
                      return (
                        <button
                          key={index}
                          disabled={gecmis}
                          onClick={() => setSeciliGun(g)}
                          className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl border-2 transition-all ${gecmis ? "opacity-20 pointer-events-none" : seciliGun === g ? "bg-[#E30A17] text-white border-[#E30A17] scale-110 shadow-lg" : isDarkMode ? "bg-slate-800 text-white border-slate-700 hover:border-[#002B67]" : "bg-white text-slate-700 border-slate-100 hover:border-[#002B67]"}`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  disabled={!seciliGun}
                  onClick={() => sonrakiAdim(2)}
                  className="w-full max-w-xs py-5 rounded-2xl font-black bg-[#002B67] text-white uppercase shadow-xl mx-auto block active:scale-95 transition-all"
                >
                  İLERLE
                </button>
              </div>
            )}

            {adim === 2 && (
              <div className="space-y-8 animate-in fade-in text-center">
                <h2
                  className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-[#002B67]"} uppercase tracking-tighter`}
                >
                  Saha ve Saat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "Voleybol Sahası", e: "🏐" },
                    { id: "Basketbol Sahası", e: "🏀" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSeciliSaha(s.id)}
                      className={`p-6 rounded-2xl border-4 font-black transition-all flex items-center gap-4 ${seciliSaha === s.id ? (isDarkMode ? "border-white bg-slate-700 text-white" : "border-[#002B67] bg-white text-[#002B67] shadow-xl") : isDarkMode ? "border-slate-900 bg-slate-900 text-slate-500" : "border-slate-50 bg-slate-50 text-slate-400"}`}
                    >
                      <span className="text-3xl">{s.e}</span>
                      <span className="text-sm font-black uppercase text-left tracking-tighter">
                        {s.id}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto p-2 scrollbar-thin ios-scroll">
                  {tumSaatler.map((s) => {
                    const gecmis = seciliGun === buGun && parseInt(s) <= buSaat;
                    return (
                      <button
                        key={s}
                        disabled={gecmis}
                        onClick={() => setSeciliSaat(s)}
                        className={`py-4 rounded-xl border-2 font-black text-[10px] md:text-xs transition-all ${gecmis ? "opacity-20 pointer-events-none" : seciliSaat === s ? "bg-[#002B67] text-white border-[#002B67] shadow-md" : isDarkMode ? "bg-slate-900 border-slate-700 text-slate-400" : "bg-white border-slate-100 text-slate-600"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-col md:flex-row-reverse gap-4 max-w-xs md:max-w-md mx-auto">
                  <button
                    disabled={!seciliSaha || !seciliSaat}
                    onClick={() => sonrakiAdim(3)}
                    className="w-full py-5 rounded-2xl font-black bg-[#002B67] text-white uppercase shadow-lg block active:scale-95"
                  >
                    Devam Et
                  </button>
                  <button
                    onClick={anasayfayaDon}
                    className={`w-full py-4 md:py-5 rounded-2xl font-black border-2 ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"} uppercase transition-all hover:bg-slate-50 text-xs md:text-sm shadow-sm active:scale-95`}
                  >
                    Ana Sayfa
                  </button>
                </div>
              </div>
            )}

            {adim === 3 && (
              <div className="space-y-5 max-w-md mx-auto animate-in fade-in duration-500 w-full px-2 text-left">
                <h2
                  className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-[#002B67]"} text-center uppercase mb-4 tracking-tighter`}
                >
                  Kayıt Bilgileri
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Ad
                    </label>
                    <input
                      ref={firstInputRef}
                      name="given-name"
                      autoComplete="given-name"
                      placeholder="AHMET"
                      value={formData.ad}
                      onChange={(e) => handleInputChange("ad", e.target.value)}
                      className={`w-full h-12 px-4 rounded-xl border-2 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-[#E30A17]" : "bg-white border-slate-100 text-slate-900 focus:border-[#002B67]"} outline-none font-black text-sm uppercase placeholder:normal-case shadow-sm`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Soyad
                    </label>
                    <input
                      name="family-name"
                      autoComplete="family-name"
                      placeholder="YILMAZ"
                      value={formData.soy_ad}
                      onChange={(e) =>
                        handleInputChange("soy_ad", e.target.value)
                      }
                      className={`w-full h-12 px-4 rounded-xl border-2 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-[#E30A17]" : "bg-white border-slate-100 text-slate-900 focus:border-[#002B67]"} outline-none font-black text-sm uppercase shadow-sm`}
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      placeholder="05XX XXX XX XX"
                      value={formData.telefon}
                      onChange={(e) =>
                        handleInputChange("telefon", e.target.value)
                      }
                      className={`w-full h-12 px-4 rounded-xl border-2 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-[#E30A17]" : "bg-white border-slate-100 text-slate-900 focus:border-[#002B67]"} outline-none font-black text-sm shadow-sm`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      E-Posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="örnek@mail.com"
                      value={formData.eposta}
                      onChange={(e) =>
                        handleInputChange("eposta", e.target.value)
                      }
                      className={`w-full h-12 px-4 rounded-xl border-2 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-[#E30A17]" : "bg-white border-slate-100 text-slate-900 focus:border-[#002B67]"} outline-none font-medium text-sm normal-case shadow-sm`}
                    />
                  </div>
                  <div className="pt-2 flex items-start gap-3 group">
                    <div className="relative flex items-center mt-0.5">
                      <input
                        id="kvkk"
                        type="checkbox"
                        checked={kvkkOnay}
                        onChange={(e) => setKvkkOnay(e.target.checked)}
                        className={`peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 transition-all outline-none ${isDarkMode ? "bg-slate-900 border-slate-700 checked:bg-[#E30A17] checked:border-[#E30A17]" : "bg-white border-slate-200 checked:bg-[#002B67] checked:border-[#002B67]"}`}
                      />
                      <svg
                        className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5 top-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div
                      className={`text-[10px] font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"} leading-tight select-none`}
                    >
                      <span
                        onClick={() => setKvkkModal(true)}
                        className={`${isDarkMode ? "text-[#E30A17]" : "text-[#002B67]"} underline decoration-1 underline-offset-2 font-black cursor-pointer`}
                      >
                        KVKK Aydınlatma Metni
                      </span>
                      'ni okudum ve kişisel verilerimin işlenmesini onaylıyorum.
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row-reverse gap-4 pt-4">
                  <button
                    disabled={!formGecerli}
                    onClick={() => sonrakiAdim(4)}
                    className="w-full py-5 rounded-2xl font-black bg-[#002B67] text-white uppercase shadow-xl transition-all tracking-widest active:scale-95 disabled:opacity-50"
                  >
                    Kod Gönder
                  </button>
                  <button
                    onClick={anasayfayaDon}
                    className={`w-full py-4 md:py-5 rounded-2xl font-black border-2 ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"} uppercase transition-all hover:bg-slate-50 text-xs md:text-sm shadow-sm active:scale-95`}
                  >
                    Ana Sayfa
                  </button>
                </div>
              </div>
            )}

            {adim === 4 && (
              <div className="space-y-8 max-w-md mx-auto animate-in zoom-in duration-500 text-center w-full px-2">
                <h2
                  className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-[#002B67]"} uppercase tracking-tighter`}
                >
                  Doğrulama
                </h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <span
                    className={`normal-case font-black ${isDarkMode ? "text-white" : "text-[#002B67]"}`}
                  >
                    {formData.eposta}
                  </span>{" "}
                  ADRESİNE GELEN KODU GİRİNİZ
                </p>
                <input
                  ref={firstInputRef}
                  type="text"
                  pattern="\d*"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={onayKodu}
                  onChange={(e) =>
                    setOnayKodu(e.target.value.replace(/\D/g, ""))
                  }
                  className={`w-full h-24 text-center text-5xl md:text-6xl font-black tracking-[0.4em] border-2 rounded-3xl outline-none transition-all ${isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-[#E30A17]" : "bg-white border-slate-100 text-[#002B67] focus:border-[#002B67]"} shadow-sm`}
                />
                <div className="flex flex-col md:flex-row-reverse gap-4">
                  <button
                    disabled={onayKodu.length !== 6}
                    onClick={() => sonrakiAdim(5)}
                    className="w-full py-5 rounded-2xl font-black bg-[#002B67] text-white uppercase shadow-xl tracking-widest active:scale-95 disabled:opacity-50"
                  >
                    İleri
                  </button>
                  <button
                    onClick={anasayfayaDon}
                    className={`w-full py-4 md:py-5 rounded-2xl font-black border-2 ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"} uppercase transition-all hover:bg-slate-50 text-xs md:text-sm shadow-sm active:scale-95`}
                  >
                    Ana Sayfa
                  </button>
                </div>
              </div>
            )}

            {adim === 5 && (
              <div className="animate-in fade-in duration-500 w-full px-2 text-left flex flex-col min-h-[400px]">
                <h2
                  className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-[#002B67]"} text-center uppercase mb-6 tracking-tighter`}
                >
                  Takım Listesi ({katilimciSayisi} Kişi)
                </h2>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin ios-scroll">
                  {katilimcilar.slice(0, katilimciSayisi).map((k, index) => (
                    <input
                      key={index}
                      ref={index === 0 ? firstInputRef : null}
                      id={`takim-${index}`}
                      value={k}
                      onChange={(e) => {
                        const yeni = [...katilimcilar];
                        yeni[index] = e.target.value.toUpperCase();
                        setKatilimcilar(yeni);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const next = document.getElementById(
                            `takim-${index + 1}`,
                          );
                          if (next) next.focus();
                        }
                      }}
                      placeholder={`${index + 1}. KATILIMCI AD SOYAD`}
                      className={`h-12 px-4 rounded-xl border-2 ${isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-[#E30A17]" : "bg-white border-slate-100 text-slate-900 focus:border-[#002B67]"} outline-none font-black uppercase text-[10px] tracking-tight shadow-sm`}
                    />
                  ))}
                </div>
                <div className="flex flex-col md:flex-row-reverse gap-4 mt-auto">
                  <button
                    disabled={!takimGecerli}
                    onClick={() => sonrakiAdim(6)}
                    className="w-full py-5 rounded-2xl font-black bg-[#002B67] text-white shadow-xl uppercase tracking-widest active:scale-95 disabled:opacity-50"
                  >
                    Randevu Al
                  </button>
                  <button
                    onClick={anasayfayaDon}
                    className={`w-full py-4 md:py-5 rounded-2xl font-black border-2 ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"} uppercase transition-all hover:bg-slate-50 text-xs md:text-sm shadow-sm active:scale-95`}
                  >
                    Ana Sayfa
                  </button>
                </div>
              </div>
            )}

            {adim === 6 && (
              <div className="text-center py-6 animate-in zoom-in duration-700 w-full px-2">
                <div
                  className={`w-20 h-20 ${isDarkMode ? "bg-slate-900" : "bg-blue-50"} text-[#002B67] rounded-full flex items-center justify-center mx-auto mb-8 border-2 ${isDarkMode ? "border-slate-700" : "border-blue-100"} shadow-inner`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDarkMode ? "white" : "currentColor"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2
                  className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-[#002B67]"} uppercase mb-8 tracking-tighter`}
                >
                  İşlem Tamam!
                </h2>
                <div
                  className={`p-8 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-[2.5rem] border text-[10px] font-bold text-slate-400 space-y-4 uppercase tracking-widest text-left relative overflow-hidden shadow-inner mb-8`}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#E30A17]" />
                  <div
                    className={`flex justify-between border-b ${isDarkMode ? "border-slate-800" : "border-white"} pb-3 px-2`}
                  >
                    <span>Sorumlu</span>
                    <span
                      className={`${isDarkMode ? "text-white" : "text-[#002B67]"} uppercase font-black`}
                    >
                      {formData.ad} {formData.soy_ad}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between border-b ${isDarkMode ? "border-slate-800" : "border-white"} pb-3 px-2`}
                  >
                    <span>E-Posta</span>
                    <span
                      className={`${isDarkMode ? "text-white" : "text-[#002B67]"} normal-case font-medium italic`}
                    >
                      {formData.eposta}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between border-b ${isDarkMode ? "border-slate-800" : "border-white"} pb-3 px-2`}
                  >
                    <span>Saha / Saat</span>
                    <span
                      className={`${isDarkMode ? "text-white" : "text-[#002B67]"} uppercase font-black`}
                    >
                      {seciliSaha} / {seciliSaat}
                    </span>
                  </div>
                  <div className="flex justify-between px-2">
                    <span>Tarih</span>
                    <span
                      className={`${isDarkMode ? "text-white" : "text-[#002B67]"} font-black uppercase`}
                    >
                      {seciliGun} {ayIsmi}
                    </span>
                  </div>
                </div>
                <button
                  onClick={anasayfayaDon}
                  className="px-12 py-5 bg-[#002B67] text-white rounded-full font-black uppercase shadow-2xl hover:bg-[#E30A17] transition-all tracking-[0.2em] text-xs active:scale-95"
                >
                  ANASAYFAYA DÖN
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
