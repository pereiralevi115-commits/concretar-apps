import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Store, Settings, LayoutGrid } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

const APP_NAME = "Minha Loja";

export default function Layout() {
  const { pathname } = useLocation();
  const navItems = [
    { to: "/", label: "Vitrine", icon: LayoutGrid },
    { to: "/gerenciar", label: "Gerenciar", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
        <div className="max-w-full mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center">
                  <Store className="w-5 h-5 text-slate-900" />
                </div>
                <span className="font-bold text-lg text-white">
                  Concretar<span className="text-brand">RH</span>
                </span>
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                {navItems.map((item) => {
                  const active = pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        active ? "bg-brand text-slate-900" : "text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white"
              onClick={() => base44.auth.logout()}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}