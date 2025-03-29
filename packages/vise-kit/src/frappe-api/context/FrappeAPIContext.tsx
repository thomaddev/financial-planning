"use client";

import { createContext, useContext, useMemo } from "react";
import { FrappeAPI } from "@vise/kit";

type FrappeAPIContextType = {
  frappe: FrappeAPI;
};

const FrappeAPIContext = createContext<FrappeAPIContextType | undefined>(undefined);

export function FrappeAPIProvider({ children, session, onError, getFieldMetaUrl }: { children: React.ReactNode; session: any; onError?: (error: string) => void; getFieldMetaUrl?: string }) {
  const token = session?.access_token || "";

  // Handle if session Error from Session
  if (session?.error === "RefreshAccessTokenError") {
    onError && onError(session?.error);
  }

  // 👇 Memoize the instance so it doesn't re-create on every render
  const frappe = useMemo(() => new FrappeAPI(process.env.NEXT_PUBLIC_API_URL as string, token, onError, getFieldMetaUrl), [token]);

  return <FrappeAPIContext.Provider value={{ frappe }}>{children}</FrappeAPIContext.Provider>;
}

export function useFrappeAPI() {
  const context = useContext(FrappeAPIContext);
  if (!context) {
    throw new Error("useFrappeAPI must be used within a FrappeAPIProvider");
  }
  return context;
}
