"use server";

import { headers } from "next/headers";

export async function getHost(isProductionHost = false) {
  if (isProductionHost) {
    return "https://mix-zula.vercel.app";
  }

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  const protocol =
    headersList.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");

  if (!host) {
    throw new Error("Host not found");
  }

  return `${protocol}://${host}`;
}

export async function getCurrentUrl(path?: string) {
  const headersList = await headers();

  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  return `${protocol}://${host}` + (path ? `/${path}` : "");
}
