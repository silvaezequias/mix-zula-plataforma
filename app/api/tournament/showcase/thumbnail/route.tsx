import { brand } from "@/config/brand";
import { tournamentStatusMap } from "@/constants/data";
import { TournamentService } from "@/features/tournament/service";
import { getFontData } from "@/lib/fonts";
import { isValidObjectId } from "@/lib/utils";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const fontData = await getFontData();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("id");

    if (!tournamentId || !isValidObjectId(tournamentId)) {
      return NotFoundResponse(
        "Não foi possível reconhecer identificação do torneio",
      );
    }

    const existingTournament =
      await TournamentService.findByIdForImage(tournamentId);

    if (!existingTournament) {
      return NotFoundResponse(
        "Não existe nenhum torneio com essa identificação",
      );
    }

    const title = existingTournament.title;
    const prize = existingTournament.prize;
    const status = tournamentStatusMap[existingTournament.status];

    return new ImageResponse(
      TournamentCardImage({
        title,
        prize,
        status: status.label,
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
            fontSize: "80px",
            fontWeight: 950,
            margin: 0,
            textAlign: "center",
            lineHeight: 1,
            color: "white",
          }}
        >
          TORNEIO
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

interface TournamentImageProps {
  title: string;
  prize: string;
  status: string;
}

export const TournamentCardImage = ({
  title,
  prize,
  status,
}: TournamentImageProps) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#050505",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, #111111 0%, #050505 100%)",
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
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#FFB300",
              padding: "8px 16px",
              color: "#000000",
              fontWeight: 900,
              fontSize: "18px",
              letterSpacing: "0.1em",
            }}
          >
            <span>TORNEIO OFICIAL</span>
          </div>
          <div
            style={{
              display: "contents",
              color: "#FFB300",
              fontWeight: 900,
              fontSize: "16px",
              textAlign: "center",
              letterSpacing: "0.3em",
            }}
          >
            <span>INSCREVA-SE NO TORNEIO</span>
          </div>
          <div
            style={{
              display: "flex",
              border: "2px solid #FFB300",
              padding: "8px 25px",
              color: "#FFB300",
              fontWeight: 900,
              fontSize: "20px",
              boxShadow: "0 0 20px rgba(255, 179, 0, 0.15)",
            }}
          >
            <span>{status}</span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              color: "#666666",
              fontWeight: 700,
              marginBottom: "8px",
              letterSpacing: "0.2em",
            }}
          >
            <span>ACESSE O CAMPEONATO</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 50 ? "45px" : "55px",
              fontWeight: 950,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            <span>{title}</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFB300",
            padding: "20px 30px",
            alignSelf: "flex-start",
            boxShadow: "10px 10px 0px rgba(255, 179, 0, 0.1)",
            position: "relative",
          }}
        >
          <span
            style={{
              display: "flex",
              fontSize: "12px",
              color: "rgba(0, 0, 0, 0.6)",
              fontWeight: 900,
              marginBottom: "4px",
            }}
          >
            RECOMPENSA DE VITÓRIA
          </span>
          <span
            style={{
              fontSize: "45px",
              fontWeight: 950,
              color: "#000000",
              lineHeight: 1,
            }}
          >
            {prize}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          width: "100%",
          borderTop: "1px solid #222",
          paddingTop: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
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
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "25%",
          bottom: "25%",
          width: "6px",
          backgroundColor: "#FFB300",
          display: "flex",
        }}
      />
    </div>
  );
};
