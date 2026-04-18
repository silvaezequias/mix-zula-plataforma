// "use client";

// import { ExternalLink, Radio, Shield, Tv, X } from "lucide-react";
// import { brand } from "@/config/brand";
// import { signOut } from "next-auth/react";
// import { roleColors } from "@/constants/data";
// import { useTabsContext } from "@/providers/TabContext";
// import { useSelectedParticipantContext } from "@/providers/SelectedParticipantContext";
// import { useMobileMenuOpen } from "@/providers/MobileMenuContext";
// import { Participant } from "@prisma/client";

// export const Sidebar = () => {
//   const { isOpen } = useMobileMenuOpen();

//   const isStaff = false;
//   const staff: Participant[] = [];

//   const { selectParticipant, clearParticipant } =
//     useSelectedParticipantContext();
//   const { changeTab } = useTabsContext();

//   return (
//     <aside
//       className={`fixed lg:relative inset-y-0 right-0 w-72 bg-[#0a0a0a] flex flex-col border-l border-zinc-900 z-100 transition-transform duration-300 transform lg:translate-x-0 order-1 lg:order-2 ${
//         isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
//       }`}
//     >
//       <div className="p-6 sm:p-8 border-b border-zinc-900 mb-6 bg-primary text-black flex justify-between items-center italic">
//         <div className="flex flex-col">
//           <h2 className="font-black italic text-2xl tracking-tighter leading-none mb-1 uppercase">
//             {brand.name}
//           </h2>
//           <p className="font-black text-[9px] tracking-[0.3em] opacity-80 italic uppercase">
//             TORNEIOS
//           </p>
//         </div>
//         <button
//           onClick={clearParticipant}
//           className="lg:hidden p-2 text-black hover:bg-black/10 rounded"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <div className="px-6 flex-1 overflow-y-auto max-h-screen custom-scrollbar italic">
//         <h4 className="text-[10px] font-black text-zinc-500 tracking-[0.2em] mb-6 flex items-center gap-2 italic uppercase">
//           <Shield size={12} className="text-primary" /> EQUIPE TÉCNICA
//         </h4>
//         <div className="space-y-4 mb-10 overflow-y-auto pr-2">
//           {staff.map((member) => (
//             <div
//               key={member.id}
//               onClick={() => {
//                 if (isStaff) {
//                   selectParticipant(member);
//                   changeTab("user");
//                 }
//               }}
//               className={`bg-zinc-900/30 border-l-2 border-zinc-800 p-3 hover:bg-zinc-900 transition-colors ${
//                 isStaff ? "cursor-pointer group" : ""
//               }`}
//             >
//               <span className="text-xs font-black italic text-white block group-hover:text-primary transition-colors">
//                 {member.nickname}
//               </span>
//               <span
//                 className={`text-[9px] font-black italic ${
//                   roleColors[member.role]
//                 } tracking-widest uppercase`}
//               >
//                 {member.role}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="p-6 border-t border-zinc-900 bg-[#0a0a0a] mt-auto italic">
//         <div className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden group uppercase mb-6 italic">
//           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
//             <Tv size={40} />
//           </div>
//           <div className="flex items-center gap-2 text-primary mb-4">
//             <Radio
//               size={14}
//               className={tournament?.status === "LIVE" ? "animate-pulse" : ""}
//             />
//             <span className="text-[10px] font-black italic uppercase tracking-widest">
//               LIVE TRANSMISSÃO
//             </span>
//           </div>
//           {tournament?.broadcastUrl ? (
//             <div className="space-y-4 relative">
//               <a
//                 href={tournament.broadcastUrl!}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full bg-primary text-black font-black italic py-3 text-[10px] tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all uppercase mt-2 shadow-[0_4px_10px_rgba(255,179,0,0.2)]"
//               >
//                 ASSISTIR <ExternalLink size={12} />
//               </a>
//             </div>
//           ) : (
//             <p className="text-[9px] text-zinc-600 font-bold uppercase italic text-center py-4">
//               Aguardando definição...
//             </p>
//           )}
//         </div>
//         {currentUser ? (
//           <div className="flex items-center gap-3 mb-4 cursor-pointer group">
//             <div className="w-8 h-8 bg-primary flex items-center justify-center text-black font-black text-xs uppercase italic group-hover:scale-110 transition-transform">
//               {currentUser.name!.charAt(0)}
//             </div>
//             <div className="flex flex-col">
//               <span className="text-[11px] font-black text-white italic truncate w-24 uppercase">
//                 {currentUser.name}
//               </span>
//               <span className="text-[9px] text-zinc-500 font-bold uppercase">
//                 {sessionMember?.role ?? "SEM CARGO"}
//               </span>
//             </div>
//           </div>
//         ) : (
//           <p className="text-[9px] text-zinc-700 font-black mb-4 uppercase">
//             Sessão não identificada
//           </p>
//         )}

//         <button
//           onClick={() => signOut()}
//           className="w-full flex items-center justify-center gap-3 py-3 text-zinc-600 hover:text-red-500 transition-all text-[10px] font-black italic tracking-widest uppercase border border-zinc-800 hover:border-red-500/50 shadow-sm active:scale-95"
//         >
//           SAIR
//         </button>
//       </div>
//     </aside>
//   );
// };
