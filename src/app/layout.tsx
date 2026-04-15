import "./globals.css";
import Image from "next/image";

export const metadata = {
  title: "Manavgat GSB | Saha Randevu",
  description: "GSB Saha Randevu Portalı",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <nav className="bg-[#002B67] border-b-[6px] border-[#E30A17] py-4 shadow-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-5">
              <Image src="/gsb-logo.svg" alt="GSB Logo" width={170} height={50} priority />
              <div className="h-8 w-px bg-white/20 hidden md:block" />
              <div className="hidden md:block">
                <h1 className="text-white font-black text-sm uppercase tracking-tighter">Manavgat Gençlik ve Spor</h1>
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">İlçe Müdürlüğü</p>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}