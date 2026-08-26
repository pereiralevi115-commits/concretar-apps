import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AppForm from "@/components/store/AppForm";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Boxes } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Manage() {
  const [apps, setApps] = useState([]);
  const [editing, setEditing] = useState(null); // object or 'new'

  const load = async () => setApps(await base44.entities.StoreApp.list("-created_date"));
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    if (editing === "new") await base44.entities.StoreApp.create(data);
    else await base44.entities.StoreApp.update(editing.id, data);
    setEditing(null);
    load();
  };

  const remove = async (app) => {
    await base44.entities.StoreApp.delete(app.id);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-tight">Gerenciar apps</h1>
        {!editing && (
          <Button onClick={() => setEditing("new")} className="rounded-xl bg-white text-black hover:bg-white/90">
            <Plus className="w-4 h-4 mr-1.5" /> Novo
          </Button>
        )}
      </div>

      {editing ? (
        <div className="rounded-3xl border border-white/10 p-6">
          <AppForm
            initial={editing === "new" ? null : editing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : (
        <div className="space-y-2">
          {apps.length === 0 && <p className="text-white/40 text-sm">Nenhum app cadastrado.</p>}
          {apps.map((app) => (
            <div key={app.id} className="flex items-center gap-4 p-3 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {app.icon_url ? <Image src={app.icon_url} alt={app.name} className="w-full h-full" /> : <Boxes className="w-4 h-4 text-white/40" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{app.name}</p>
                <p className="text-xs text-white/40 truncate">{app.url}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-white/50" onClick={() => setEditing(app)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-400/70" onClick={() => remove(app)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}