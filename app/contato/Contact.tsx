"use client";

import { community } from "@/config/brand";
import { Zap, ExternalLink, Radio } from "lucide-react";
import { BsDiscord, BsWhatsapp } from "react-icons/bs";
import Link from "next/link";

export default function ContactPage() {
  const DISCORD_INVITE = `https://discord.gg/${community.discordInviteCode}`;
  const WHATSAPP_GROUP = `https://chat.whatsapp.com/${community.whatsappInviteCode}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans uppercase italic tracking-widest overflow-hidden selection:bg-[#FFB300] selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFB300] blur-[150px] rounded-full opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-24 flex flex-col min-h-screen">
        <header className="mb-20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 text-[#FFB300]">
            <Radio size={20} className="animate-pulse" />
            <span className="text-xs font-black tracking-[0.4em]">
              COMUNICAÇÃO & SUPORTE
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter leading-none uppercase">
            CANAIS DE <span className="text-[#FFB300]">CONTATO</span>
          </h1>
          <p className="text-zinc-500 font-bold max-w-2xl text-sm leading-relaxed uppercase">
            Entre em contato conosco, responderemos o mais rápido possível.
            Dúvidas, sugestões ou parcerias, estamos à disposição!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="group relative bg-[#111] border border-zinc-800 p-8 sm:p-12 hover:border-[#5865F2] transition-all shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5865F2] opacity-0 group-hover:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16 transition-opacity"></div>

            <div className="relative z-10 space-y-6">
              <div className="bg-[#5865F2] p-4 w-fit shadow-lg shadow-[#5865F2]/20 group-hover:scale-110 transition-transform">
                <BsDiscord size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                  Comunidade Discord
                </h3>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase">
                  Servidor dedicado a campeonatos e partidas de Zula Global,
                  conectando jogadores competitivos e casuais. Participe de
                  torneios, monte seu time e evolua com a comunidade!
                </p>
              </div>
              <ul className="space-y-2 pb-6 border-b border-zinc-900">
                <li className="flex items-center gap-2 text-[10px] text-zinc-400 font-black italic">
                  <Zap size={12} className="text-[#FFB300]" /> CANAIS DE VOZ
                  ATIVOS
                </li>
                <li className="flex items-center gap-2 text-[10px] text-zinc-400 font-black italic">
                  <Zap size={12} className="text-[#FFB300]" /> COMUNIDADE
                  BRASILEIRA
                </li>
              </ul>
              <Link
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#5865F2] text-white font-black py-5 text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:brightness-110 transition-all uppercase italic shadow-xl"
              >
                ACESSAR SERVIDOR <ExternalLink size={16} />
              </Link>
            </div>
          </div>

          <div className="group relative bg-[#111] border border-zinc-800 p-8 sm:p-12 hover:border-[#25D366] transition-all shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366] opacity-0 group-hover:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16 transition-opacity"></div>

            <div className="relative z-10 space-y-6">
              <div className="bg-[#25D366] p-4 w-fit shadow-lg shadow-[#25D366]/20 group-hover:scale-110 transition-transform">
                <BsWhatsapp size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                  Grupo WhatsApp
                </h3>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase">
                  Alertas em tempo real sobre novos torneios, resultados de
                  partidas e comunicações rápidas de comunidade.
                </p>
              </div>
              <ul className="space-y-2 pb-6 border-b border-zinc-900">
                <li className="flex items-center gap-2 text-[10px] text-zinc-400 font-black italic">
                  <Zap size={12} className="text-[#FFB300]" /> ALERTAS DE
                  TORNEIOS
                </li>
                <li className="flex items-center gap-2 text-[10px] text-zinc-400 font-black italic">
                  <Zap size={12} className="text-[#FFB300]" /> RESULTADOS AO
                  VIVO
                </li>
              </ul>
              <Link
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white font-black py-5 text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:brightness-110 transition-all uppercase italic shadow-xl"
              >
                ENTRAR NO GRUPO <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
