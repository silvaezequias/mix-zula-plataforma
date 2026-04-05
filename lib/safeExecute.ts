export async function safeExecute<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}
