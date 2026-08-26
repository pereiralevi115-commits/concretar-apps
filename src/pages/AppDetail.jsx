import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import InstallSheet from "@/components/store/InstallSheet";
import { ArrowLeft, Download, Boxes, ExternalLink } from "lucide-react";

export default function AppDetail() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    base44.entities.StoreApp.get(id).then((a) => { setApp(a); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const install = async () => {
    setShowInstall(true);
    const updated = await base44.entities.StoreApp.update(app.id, { install_count: (app.install_count || 0) + 1 });
    setApp(updated);
  };

  if (loading) return <p className="text-white/40 text-sm">Carregando...</p>;
  if (!app) return (
    <div className="space-y-4">
      <p className="text-white/60">App não encontrado.</p>
      <Link to="/" className="text-white underline text-sm">Voltar à loja</Link>
    </div>
  );

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Loja
      </Link>

      <div className="flex gap-5 items-center">
        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          {app.icon_url ? <Image src={app.icon_url} alt={app.name} className="w-full h-full" /> : <Boxes className="w-8 h-8 text-white/40" />}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-3xl tracking-tight">{app.name}</h1>
          <p className="text-white/50">{app.tagline}</p>
          <p className="text-xs text-white/30 mt-1">{app.category} · {app.install_count || 0} instalações</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={install} className="flex-1 h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-medium">
          <Download className="w-4 h-4 mr-2" /> Instalar no celular
        </Button>
        <Button variant="outline" className="h-12 rounded-2xl border-white/15 bg-transparent text-white hover:bg-white/10" onClick={() => window.open(app.url, "_blank")}>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {app.description && (
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/40">Sobre este app</h2>
          <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{app.description}</p>
        </div>
      )}

      <InstallSheet app={app} open={showInstall} onOpenChange={setShowInstall} />
    </div>
  );
}