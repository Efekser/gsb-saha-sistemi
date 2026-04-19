import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f7fa] flex flex-col overflow-x-hidden">
      <main className="flex-1 w-full max-w-[1600px] mx-auto transition-all duration-300">
        {children}
      </main>
    </div>
  );
}