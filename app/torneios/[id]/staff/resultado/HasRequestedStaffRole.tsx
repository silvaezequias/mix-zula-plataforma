import { FullTournament } from "@/types";
import { Lock, UserCheck, UserSearch, UserX } from "lucide-react";
import Link from "next/link";
import { TournamentRoleRequest } from "@prisma/client";

export function HasRequestedStaffRole({
  tournament,
  requestedRole,
}: {
  tournament: FullTournament;
  requestedRole: TournamentRoleRequest;
}) {
  return (
    <div className="text-center h-[80vh] w-full flex flex-col items-center justify-center space-y-10 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="h-px w-12 bg-zinc-800"></div>
        <div className="bg-[#FFB300] p-2 transform -rotate-12 shadow-[0_0_20px_rgba(255,179,0,0.2)]">
          <Lock size={20} className="text-black" />
        </div>
        <div className="h-px w-12 bg-zinc-800"></div>
      </div>
      <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter leading-none uppercase">
        CARGO SOLICITADO:{" "}
        <span className="text-[#FFB300]">{requestedRole.requestedRole}</span>
      </h1>

      <div className="relative inline-block">
        <div
          className={`absolute inset-0 blur-3xl rounded-full ${
            requestedRole.status === "PENDING"
              ? "bg-yellow-500/20"
              : requestedRole.status === "ACCEPTED"
                ? "bg-green-500/20"
                : "bg-red-500/20"
          }`}
        ></div>
        {requestedRole.status === "PENDING" ? (
          <UserSearch
            size={100}
            className="text-yellow-500 relative z-10 mx-auto"
          />
        ) : requestedRole.status === "ACCEPTED" ? (
          <UserCheck
            size={100}
            className="text-green-500 relative z-10 mx-auto"
          />
        ) : (
          <UserX size={100} className="text-red-500 relative z-10 mx-auto" />
        )}
      </div>
      {requestedRole.status === "PENDING" ? (
        <div className="space-y-4 px-10">
          <h2 className="text-4xl font-black italic trackivng-tighter uppercase">
            PEDIDO EM ANÁLISE
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm leading-relaxed">
            Sua solicitação foi enviada para o sistema <br />
            Aguarde a resposta do administrador
          </p>
        </div>
      ) : requestedRole.status === "ACCEPTED" ? (
        <div className="space-y-4 px-10">
          <h2 className="text-4xl font-black italic trackivng-tighter uppercase">
            PEDIDO ACEITO
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm leading-relaxed">
            Sua solicitação foi aceita pelo administrador <br />
            Entre no torneio e descubra suas novas possibilidades de acesso
          </p>
        </div>
      ) : (
        <div className="space-y-4 px-10">
          <h2 className="text-4xl font-black italic trackivng-tighter uppercase">
            PEDIDO NEGADO
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm leading-relaxed">
            Sua solicitação não foi aceita pelo administrador do torneio <br />
            Infelizmente o administrador não aceitou sua solicitação
          </p>
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${requestedRole.status === "DENIED" ? "md:grid-cols-2" : ""}`}
      >
        <Link href={`/torneios/${tournament.id}`}>
          <button className="px-12 py-5 border-2 border-zinc-800 text-zinc-500 font-black text-xs tracking-widest hover:border-[#FFB300] hover:text-[#FFB300] transition-all uppercase italic">
            Visualizar Torneio
          </button>
        </Link>
        {requestedRole.status === "DENIED" && (
          <Link href={`/torneios/${tournament.id}/staff?afterDenied=tryagain`}>
            <button className="px-12 py-5 border-2 border-zinc-800 text-zinc-500 font-black text-xs tracking-widest hover:border-2 hover:border-[#FFB300] hover:text-[#FFB300] transition-all uppercase italic">
              Nova solicitação
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
