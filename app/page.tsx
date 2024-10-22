"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTokenStore } from "@/store/use-token-store";

export default function Home() {
  const router = useRouter();
  const { loadTokenFromStorage, isTokenValid, clearToken } = useTokenStore();

  useEffect(() => {
    loadTokenFromStorage();

    if (!isTokenValid()) {
      clearToken();
      router.push("/login");
    }
  }, [clearToken, isTokenValid, loadTokenFromStorage, router]);

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="aspect-video rounded-xl bg-muted/50">
        <Link href="/hssk/import">HSSK Import</Link>
      </div>
      <div className="aspect-video rounded-xl bg-muted/50">
        <Link href="/hssk/settings">HSSK Settings</Link>
      </div>
      <div className="aspect-video rounded-xl bg-muted/50">
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
