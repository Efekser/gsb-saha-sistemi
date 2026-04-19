"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitted && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isSubmitted]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setIsSubmitted(true);
    }
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
            {isSubmitted ? "E-POSTA GÖNDERİLDİ" : "ŞİFRE KURTARMA"}
          </h1>

          <div className="h-1.5 w-10 bg-[#E30A17] mx-auto mt-5 rounded-full"></div>
        </div>

        <div className="w-full bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,43,103,0.12)]">
          {!isSubmitted ? (
            <form className="space-y-7" onSubmit={handleSubmit}>
              <div className="text-center px-2 mb-2 font-bold text-[11px] text-slate-500">
                E-posta adresinize sıfırlama bağlantısı ileteceğiz.
              </div>

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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="pt-2 flex flex-col items-center gap-6">
                <button
                  type="submit"
                  className="w-full py-4.5 bg-[#002B67] hover:bg-[#1a365d] text-white rounded-[1.25rem] text-[11px] font-[900] uppercase tracking-[0.2em] shadow-xl shadow-[#002B67]/20 transition-all active:scale-[0.98] py-4"
                >
                  BAĞLANTI GÖNDER
                </button>

                <Link
                  href="/admin/login"
                  className="text-[10px] font-[900] text-[#002B67] uppercase tracking-widest hover:underline decoration-2 underline-offset-[10px] opacity-70 hover:opacity-100 transition-all text-center"
                >
                  ← GİRİŞ SAYFASINA DÖN
                </Link>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center space-y-7 py-2 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-600 leading-relaxed px-2">
                  Sıfırlama bağlantısı başarıyla iletildi:
                </p>
                <p className="text-[13px] font-[900] text-[#002B67] break-all bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {email}
                </p>
              </div>

              <Link
                href="/admin/login"
                className="w-full py-4.5 bg-[#002B67] hover:bg-[#1a365d] text-white rounded-[1.25rem] text-[11px] font-[900] uppercase tracking-[0.2em] shadow-xl shadow-[#002B67]/20 transition-all active:scale-[0.98] text-center py-4"
              >
                GİRİŞE DÖN
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
