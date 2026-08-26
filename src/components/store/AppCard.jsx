import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Download, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppCard({ app, onInstall }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
      <Link to={`/app/${app.id}`} className="shrink-0">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
          {app.icon_url ? (
            <Image src={app.icon_url} alt={app.name} className="w-full h-full" />
          ) : (
            <Boxes className="w-6 h-6 text-white/40" />
          )}
        </div>
      </Link>
      <Link to={`/app/${app.id}`} className="min-w-0 flex-1">
        <p className="font-medium text-white truncate">{app.name}</p>
        <p className="text-sm text-white/50 truncate">{app.tagline || app.category}</p>
        <p className="text-xs text-white/30 mt-1">{app.install_count || 0} instalações</p>
      </Link>
      <Button
        size="sm"
        onClick={() => onInstall(app)}
        className="rounded-full bg-white text-black hover:bg-white/90 px-4"
      >
        <Download className="w-4 h-4 mr-1.5" />
        Instalar
      </Button>
    </div>
  );
}