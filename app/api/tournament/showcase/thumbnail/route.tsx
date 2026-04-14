import { brand } from "@/config/brand";
import { tournamentStatusMap } from "@/constants/data";
import { TournamentService } from "@/features/tournament/service";
import { numberOrInfinity } from "@/lib/formatter";
import { isValidObjectId } from "@/lib/utils";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function handler(req: NextRequest) {
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

    const title = existingTournament.title.padEnd(70, "X ");
    const prize = existingTournament.prize;
    const status = tournamentStatusMap[existingTournament.status];
    const registrations = existingTournament._count.participants;
    const maxPlayers = numberOrInfinity(
      existingTournament.maxRegistrations,
      false,
      true,
    );

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#050505",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #111 0%, #050505 100%)",
          fontFamily: "sans-serif",
          color: "white",
          textTransform: "uppercase",
          fontStyle: "italic",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "0 20px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#FFB300",
                padding: "10px 20px",
                color: "black",
                fontWeight: 900,
                fontSize: "22px",
                letterSpacing: "0.25em",
                transform: "skewX(-15deg)",
              }}
            >
              {status.label}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "80px",
                fontWeight: 950,
                letterSpacing: "-0.06em",
                margin: 0,
                lineHeight: 0.8,
                color: "white",
                display: "flex",
              }}
            >
              {brand.splittedName[0]}{" "}
              <span style={{ color: "#FFB300", marginLeft: "25px" }}>
                {brand.splittedName[1]}
              </span>
            </h1>
            <div
              style={{
                height: "6px",
                width: "100%",
                backgroundColor: "#FFB300",
                marginTop: "15px",
                boxShadow: "0 0 40px rgba(255, 179, 0, 0.6)",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
            textAlign: "center",
            height: "80%",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 1000,
              color: "white",
              marginBottom: "30px",
              letterSpacing: "0.05em",
              maxWidth: "90%",
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", gap: "30px", marginTop: "10px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 179, 0, 0.3)",
                padding: "20px 40px",
                borderRadius: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  color: "#888",
                  fontWeight: 700,
                  marginBottom: "5px",
                }}
              >
                INSCRITOS
              </span>
              <span
                style={{
                  fontSize: "38px",
                  color: "white",
                  fontWeight: 900,
                }}
              >
                {registrations}/{maxPlayers}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#FFB300",
                padding: "20px 40px",
                color: "black",
                borderRadius: "4px",
                maxWidth: "80%",
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  marginBottom: "5px",
                }}
              >
                PREMIAÇÃO
              </span>
              <span
                style={{
                  fontSize: "38px",
                  fontWeight: 950,
                }}
              >
                {prize}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontSize: "13px",
            color: "#555",
            fontWeight: 800,
            letterSpacing: "0.6em",
          }}
        >
          FAÇA PARTE DESTA COMPETIÇÃO E TESTE SUAS HABILIDADES
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    return new Response(`Erro ao processar imagem: ${(e as Error).message}`, {
      status: 500,
    });
  }
}

const NotFoundResponse = (message?: string) => {
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
    { width: 1200, height: 630 },
  );
};

export async function GET(req: NextRequest) {
  return handler(req);
}
