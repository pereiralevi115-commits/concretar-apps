import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Store, Settings } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-neutral-950/70 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            <span className="font-display text-lg tracking-tight">Minha Loja</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/gerenciar">
              <Button variant="ghost" size="icon" className={pathname === "/gerenciar" ? "text-white" : "text-white/50"}>
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-white/50" onClick={() => base44.auth.logout()}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-8 pb-20">
        <Outlet />
      </main>
    </div>
  );
}