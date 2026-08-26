import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AppCard from "@/components/store/AppCard";
import InstallSheet from "@/components/store/InstallSheet";
import { Input } from "@/components/ui/input";
import { Search, Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export default function Home() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [installing, setInstalling] = useState(null);

  const load = async () => {
    const list = await base44.entities.StoreApp.list("-created_date");
    setApps(list);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleInstall = async (app) => {
    setInstalling(app);
    await base44.entities.StoreApp.update(app.id, { install_count: (app.install_count || 0) + 1 });
    load();
  };

  const filtered = apps.filter((a) =>
    (a.name + " " + (a.tagline || "") + " " + (a.category || "")).toLowerCase().includes(q.toLowerCase())
  );
  const featured = filtered.filter((a) => a.featured);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Vitrine de apps</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar apps"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10 h-9 rounded-md border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-brand/40 focus:border-brand"
          />
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Carregando...</p>}

      {!loading && apps.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <div className="h-14 w-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center">
            <Boxes className="h-7 w-7 text-slate-500" />
          </div>
          <p className="text-slate-500 text-sm">Nenhum app na sua loja ainda.</p>
          <Link to="/gerenciar" className="text-slate-900 font-medium underline text-sm">Adicionar o primeiro app</Link>
        </div>
      )}

      {featured.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">Destaques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featured.map((app) => (
              <Link
                key={app.id}
                to={`/app/${app.id}`}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {app.icon_url ? <Image src={app.icon_url} alt={app.name} className="w-full h-full" /> : <Boxes className="w-5 h-5 text-slate-400" />}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                    <Boxes className="w-3.5 h-3.5" />
                    {app.category || "App"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{app.name}</p>
                  <p className="text-sm text-slate-500 line-clamp-2">{app.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filtered.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">Todos os apps</h2>
          <div className="space-y-2">
            {filtered.map((app) => (
              <AppCard key={app.id} app={app} onInstall={handleInstall} />
            ))}
          </div>
        </section>
      )}

      <InstallSheet app={installing} open={!!installing} onOpenChange={(o) => !o && setInstalling(null)} />
    </div>
  );
}