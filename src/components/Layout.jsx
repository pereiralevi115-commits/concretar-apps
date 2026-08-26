import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Settings, LayoutGrid } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";


const LOGO_URL = "https://media.base44.com/images/public/6a8f0804d9f191ee3d88f38c/55c699aa7_generated_image.png";

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
                <div className="h-10 w-10 overflow-hidden bg-brand shrink-0">
                  <Image src={LOGO_URL} alt="Concretar Apps" className="w-full h-full" />
                </div>
                <span className="font-bold text-lg uppercase tracking-tight text-white">
                  Concretar<span className="text-brand"> Apps</span>
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