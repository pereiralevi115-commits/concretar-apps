import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Download, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppCard({ app, onInstall }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors">
      <Link to={`/app/${app.id}`} className="shrink-0">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
          {app.icon_url ? (
            <Image src={app.icon_url} alt={app.name} className="w-full h-full" />
          ) : (
            <Boxes className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </Link>
      <Link to={`/app/${app.id}`} className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 truncate">{app.name}</p>
        <p className="text-sm text-slate-500 truncate">{app.tagline || app.category}</p>
        <p className="text-xs text-slate-400 mt-0.5 tabular-nums">{app.install_count || 0} instalações</p>
      </Link>
      <Button
        size="sm"
        variant="brand"
        onClick={() => onInstall(app)}
        className="rounded-lg px-4"
      >
        <Download className="w-4 h-4" />
        Instalar
      </Button>
    </div>
  );
}