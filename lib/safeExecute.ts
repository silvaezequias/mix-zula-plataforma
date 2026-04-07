import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function safeExecute<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    console.error("Action Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}
