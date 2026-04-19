"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto font-sans touch-manipulation">
      <div className="w-full max-w-[400px] py-6 flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm mb-6 transition-all hover:border-[#002B67]/20">
            <img
              src="/icon.svg"
              alt="GSB Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-[900] text-[#002B67] uppercase tracking-tighter leading-none">
            YÖNETİCİ GİRİŞİ
          </h1>

          <div className="h-1.5 w-10 bg-[#E30A17] mx-auto mt-5 rounded-full"></div>

          <p className="text-[10px] md:text-[11px] font-[900] text-slate-400 uppercase tracking-[0.4em] mt-6 leading-relaxed">
            RANDEVU YÖNETİM PANELİ
          </p>
        </div>

        <div className="w-full bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,43,103,0.12)]">
          <form className="space-y-7" onSubmit={handleLogin}>
            <div className="space-y-3">
              <label className="text-[10px] font-[900] text-[#002B67] uppercase tracking-widest ml-1 opacity-60">
                KURUMSAL E-POSTA
              </label>
              <input
                ref={emailInputRef}
                type="email"
                required
                autoComplete="email"
                placeholder="Örnek@mail.com"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 text-[16px] md:text-sm font-bold text-[#002B67] outline-none transition-all focus:border-[#002B67] focus:bg-white shadow-sm"
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-[900] text-[#002B67] uppercase tracking-widest ml-1 opacity-60">
                ŞİFRE
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 text-[16px] md:text-sm font-bold text-[#002B67] outline-none transition-all focus:border-[#002B67] focus:bg-white shadow-sm"
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>

            <div className="pt-2 flex flex-col items-center gap-6">
              <Link
                href="/forgot-password"
                className="text-[10px] font-[900] text-[#002B67] uppercase tracking-widest hover:underline decoration-2 underline-offset-[10px] opacity-70 hover:opacity-100 transition-all text-center"
              >
                ŞİFREMİ UNUTTUM
              </Link>

              <button
                type="submit"
                className="w-full py-4.5 bg-[#002B67] hover:bg-[#1a365d] text-white rounded-[1.25rem] text-[11px] font-[900] uppercase tracking-[0.2em] shadow-xl shadow-[#002B67]/20 transition-all active:scale-[0.98] py-4"
              >
                SİSTEME GİRİŞ YAP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
