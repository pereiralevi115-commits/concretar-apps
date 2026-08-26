import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AppForm from "@/components/store/AppForm";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Boxes } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Manage() {
  const [apps, setApps] = useState([]);
  const [editing, setEditing] = useState(null);

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
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gerenciar apps</h1>
        {!editing && (
          <Button variant="brand" onClick={() => setEditing("new")} className="rounded-lg">
            <Plus className="w-4 h-4" /> Novo app
          </Button>
        )}
      </div>

      {editing ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {editing === "new" ? "Adicionar app" : "Editar app"}
          </h2>
          <AppForm
            initial={editing === "new" ? null : editing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {apps.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center">
                <Boxes className="h-7 w-7 text-slate-500" />
              </div>
              <p className="text-slate-500 text-sm">Nenhum app cadastrado.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {apps.map((app) => (
                <div key={app.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50/60">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {app.icon_url ? <Image src={app.icon_url} alt={app.name} className="w-full h-full" /> : <Boxes className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{app.name}</p>
                    <p className="text-xs text-slate-400 truncate">{app.url}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" onClick={() => setEditing(app)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50" onClick={() => remove(app)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}