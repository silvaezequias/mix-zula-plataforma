export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-primary selection:text-primary-foreground italic tracking-widest">
      {children}
    </div>
  );
}
