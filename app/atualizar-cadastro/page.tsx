import { RequestWithSearchParams } from "@/types/frontend";
import { requireAuth } from "@/lib/authorization/accessControl";
import { ShieldCheck, Trophy } from "lucide-react";
import { brand } from "@/config/brand";
import { UpdateUserForm } from "./UpdateUserForm";
import { redirect } from "next/navigation";

export default async function UpdateRegistration(req: RequestWithSearchParams) {
  const { session, searchParams } = await requireAuth({
    forceOnboard: false,
    searchParams: req.searchParams,
  });

  if (session.user.isOnboarded) {
    if (searchParams.redirect) redirect(searchParams.redirect);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans uppercase italic tracking-widest flex items-center justify-center p-4 relative overflow-hidden selection:bg-primary selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary blur-[150px] rounded-full opacity-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800 blur-[120px] rounded-full opacity-10"></div>
      </div>

      <main className="relative z-10 w-full max-w-125 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-3 mb-4 shadow-[0_0_30px_rgba(255,179,0,0.2)] transform -rotate-6">
            <Trophy className="text-black w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-center leading-none">
            ATUALIZE SEU <span className="text-primary">CADASTRO</span>
          </h1>
          <p className="text-zinc-500 text-[9px] font-bold tracking-[0.4em] mt-3 uppercase italic">
            Atualize suas informações de Registro
          </p>
        </div>

        <div className="bg-[#111] border-t-4 border-primary p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-8 bg-primary transform skew-x-35 translate-x-16 -translate-y-4 opacity-50"></div>
          <UpdateUserForm user={session.user} />
        </div>
        <div className="mt-8 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-4 text-zinc-500">
            <div className="h-px w-12 bg-zinc-800"></div>
            <ShieldCheck size={16} />
            <div className="h-px w-12 bg-zinc-800"></div>
          </div>
          <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-center leading-relaxed px-4">
            Dados protegidos pela central de segurança {brand.name}. <br />
            suas informações pessoais são confidenciais.
          </p>
        </div>
      </main>
    </div>
  );
}
