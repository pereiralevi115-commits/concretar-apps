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
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="font-display text-4xl tracking-tight leading-tight">
          Seus apps,<br /><span className="text-white/40">em um só lugar.</span>
        </h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Buscar apps"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {loading && <p className="text-white/40 text-sm">Carregando...</p>}

      {!loading && apps.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <Boxes className="w-10 h-10 text-white/20 mx-auto" />
          <p className="text-white/50">Nenhum app na sua loja ainda.</p>
          <Link to="/gerenciar" className="text-white underline text-sm">Adicionar o primeiro app</Link>
        </div>
      )}

      {featured.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/40">Destaques</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5">
            {featured.map((app) => (
              <Link
                key={app.id}
                to={`/app/${app.id}`}
                className="shrink-0 w-64 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-5 space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                  {app.icon_url ? <Image src={app.icon_url} alt={app.name} className="w-full h-full" /> : <Boxes className="w-5 h-5 text-white/40" />}
                </div>
                <div>
                  <p className="font-medium">{app.name}</p>
                  <p className="text-sm text-white/50 line-clamp-2">{app.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filtered.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Todos os apps</h2>
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} onInstall={handleInstall} />
          ))}
        </section>
      )}

      <InstallSheet app={installing} open={!!installing} onOpenChange={(o) => !o && setInstalling(null)} />
    </div>
  );
}