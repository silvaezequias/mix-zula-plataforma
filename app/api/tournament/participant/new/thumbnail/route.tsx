import { brand } from "@/config/brand";
import {
  ParticipantStatusMap,
  participantStatusMap,
  STAFF_ROLES,
} from "@/constants/data";
import { TournamentService } from "@/features/tournament/service";
import { getFontData } from "@/lib/fonts";
import { isValidObjectId } from "@/lib/utils";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const fontData = await getFontData();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const participantId = searchParams.get("participantId");

    if (!participantId || !isValidObjectId(participantId)) {
      return NotFoundResponse(
        "Não foi possível reconhecer identificação do participante",
      );
    }

    const existingParticipant =
      await TournamentService.findParticipantById(participantId);

    if (!existingParticipant) {
      return NotFoundResponse(
        "Não existe nenhum participante com essa identificação",
      );
    }

    return new ImageResponse(
      PlayerRegisteredCardImage({
        id: existingParticipant.user.name!,
        playerNick: existingParticipant.user.player!.nickname!,
        tournamentName: existingParticipant.tournament.title,
        status: participantStatusMap[existingParticipant.status],
        role: STAFF_ROLES.find((r) => r.id === existingParticipant.role)?.title,
      }),
      {
        fonts: fontData,
        width: 1200,
        height: 630,
        headers: {
          "Content-Type": "image/png",
        },
      },
    );
  } catch (e) {
    console.error(e);
    return NotFoundResponse("Não foi possível processar as informações");
  }
}

const NotFoundResponse = async (message?: string) => {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#050505",
        fontFamily: "sans-serif",
        color: "white",
        padding: "40px",
        textTransform: "uppercase",
        fontStyle: "italic",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage:
            "radial-gradient(circle at center, #ff0000 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "4px solid #ff4444",
          padding: "60px",
          backgroundColor: "rgba(255, 0, 0, 0.05)",
          boxShadow: "0 0 50px rgba(255, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: 900,
            color: "#ff4444",
            marginBottom: "20px",
            letterSpacing: "0.4em",
          }}
        >
          ALERTA DO SISTEMA
        </div>
        <h1
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "80px",
            fontWeight: 950,
            margin: 0,
            textAlign: "center",
            lineHeight: 1,
            color: "white",
          }}
        >
          PARTICIPANTE
          <span style={{ color: "#ff4444", marginLeft: "15px" }}>
            NÃO LOCALIZADO
          </span>
        </h1>
        <div
          style={{
            marginTop: "30px",
            fontSize: "18px",
            color: "#666",
            fontWeight: 700,
            letterSpacing: "0.2em",
          }}
        >
          {message?.toUpperCase() || "CÓDIGO DE ERRO: 404_TOURNAMENT_FAILURE"}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: "14px",
          color: "#444",
          fontWeight: 800,
          letterSpacing: "0.5em",
        }}
      >
        CONTATE OS ADMINISTRADORES E COMPARILHE ESSE ERRO
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fontData,
      headers: {
        "Content-Type": "image/png",
      },
    },
  );
};

interface PlayerRegisteredImageProps {
  tournamentName: string;
  playerNick: string;
  id?: string;
  role?: string;
  status?: ParticipantStatusMap[keyof ParticipantStatusMap];
}

export const PlayerRegisteredCardImage = ({
  tournamentName,
  playerNick,
  id = "US@ER_UND3F1NEPD",
  role = "Jogador",
  status = participantStatusMap["ACTIVE"],
}: PlayerRegisteredImageProps) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#050505",
        backgroundImage:
          "radial-gradient(circle at 100% 100%, #151515 0%, #050505 100%)",
        fontFamily: "sans-serif",
        color: "#ffffff",
        padding: "60px",
        textTransform: "uppercase",
        fontStyle: "italic",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          opacity: 0.05,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#000",
            borderLeft: "4px solid #FFB300",
            padding: "10px 20px",
            flexDirection: "column",
          }}
        >
          <span style={{ fontSize: "10px", color: "#666", fontWeight: 800 }}>
            USUÁRIO DO DISCORD
          </span>
          <span style={{ fontSize: "18px", color: "#fff", fontWeight: 900 }}>
            {id}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: status.hex,
              boxShadow: `0 0 15px ${status.hex}66`,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: "16px",
              fontWeight: 900,
              color: status.hex,
              letterSpacing: "0.1em",
            }}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#FFB300",
            color: "#000",
            padding: "6px 20px",
            fontSize: "35px",
            fontWeight: 900,
            marginBottom: "20px",
            transform: "skewX(-15deg)",
          }}
        >
          <span style={{ transform: "skewX(15deg)" }}>
            INSCRIÇÃO CONFIRMADA
          </span>
        </div>

        <span
          style={{
            fontSize: "18px",
            color: "#888",
            fontWeight: 700,
            marginBottom: "5px",
          }}
        >
          BEM-VINDO AO TORNEIO, {role}:
        </span>
        <h1
          style={{
            fontSize: "90px",
            fontWeight: 950,
            color: "#fff",
            margin: 0,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          {playerNick}
        </h1>

        <div
          style={{
            display: "flex",
            marginTop: "30px",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{ width: "40px", height: "1px", backgroundColor: "#333" }}
          />
          <span style={{ fontSize: "24px", fontWeight: 800, color: "#FFB300" }}>
            {tournamentName}
          </span>
          <div
            style={{ width: "40px", height: "1px", backgroundColor: "#333" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: "1px solid #222",
          paddingTop: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            fontSize: "25px",
            fontWeight: 950,
            color: "#ffffff",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex" }}>
            <span>{brand.splittedName[0]}</span>
            <span style={{ color: "#FFB300", marginLeft: "10px" }}>
              {brand.splittedName[1]}
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{ fontSize: "15px", fontWeight: "700", color: "#666" }}
            >
              {brand.slogan}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
