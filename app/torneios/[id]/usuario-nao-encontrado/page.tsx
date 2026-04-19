import { AlertTriangle } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotFoundUserPage(props: Props) {
  const { id: tournamentId } = await props.params;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white uppercase italic">
      <div className="text-center space-y-4">
        <AlertTriangle size={48} className="text-primary mx-auto" />
        <h2 className="text-2xl font-black italic tracking-tighter">
          USUÁRIO NÃO LOCALIZADO
        </h2>
        <p className="text-zinc-500 text-xs uppercase tracking-widest">
          O ID DO USUÁRIO É INVÁLIDO OU NÃO EXISTE
        </p>
        <Link href={`/torneios/${tournamentId}/overview`}>
          <button className="text-primary hover:text-white transition-colors underline text-xs font-bold mt-4 uppercase">
            Voltar ao torneio
          </button>
        </Link>
      </div>
    </div>
  );
}
