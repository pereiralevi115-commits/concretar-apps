import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import InstallSheet from "@/components/store/InstallSheet";
import { ArrowLeft, Download, Boxes } from "lucide-react";

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

  if (loading) return <p className="text-sm text-slate-500 p-8">Carregando...</p>;
  if (!app) return (
    <div className="p-8 space-y-4">
      <p className="text-slate-600">App não encontrado.</p>
      <Link to="/" className="text-slate-900 font-medium underline text-sm">Voltar à loja</Link>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 text-sm hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Voltar à vitrine
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="flex gap-5 items-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            {app.icon_url ? <Image src={app.icon_url} alt={app.name} className="w-full h-full" /> : <Boxes className="w-8 h-8 text-slate-400" />}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900">{app.name}</h1>
            <p className="text-sm text-slate-500">{app.tagline}</p>
            <p className="text-xs text-slate-400 mt-1 tabular-nums">{app.category} · {app.install_count || 0} instalações</p>
          </div>
        </div>

        <Button variant="brand" onClick={install} className="w-full h-10 rounded-lg font-medium mt-6">
          <Download className="w-4 h-4" /> Instalar no celular
        </Button>
      </div>

      {app.description && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-3">
          <h2 className="text-base font-semibold text-slate-900">Sobre este app</h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{app.description}</p>
        </div>
      )}

      <InstallSheet app={app} open={showInstall} onOpenChange={setShowInstall} />
    </div>
  );
}