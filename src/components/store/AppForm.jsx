import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const empty = { name: "", tagline: "", description: "", url: "", icon_url: "", category: "Produtividade", featured: false };

export default function AppForm({ initial, onSubmit, onCancel }) {
  const [data, setData] = useState({ ...empty, ...(initial || {}) });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(data);
    setSaving(false);
  };

  const field = "h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-brand/40 focus:border-brand";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-500">Nome do app</Label>
          <Input required value={data.name} onChange={set("name")} className={field} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-500">Categoria</Label>
          <Input value={data.category} onChange={set("category")} className={field} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-500">Link do app (URL publicada)</Label>
        <Input required type="url" placeholder="https://..." value={data.url} onChange={set("url")} className={field} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-500">Link do ícone</Label>
        <Input value={data.icon_url} onChange={set("icon_url")} className={field} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-500">Frase curta</Label>
        <Input value={data.tagline} onChange={set("tagline")} className={field} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-500">Descrição</Label>
        <Textarea value={data.description} onChange={set("description")} className="rounded-md border border-slate-200 bg-white text-sm text-slate-700 min-h-24 focus:ring-2 focus:ring-brand/40 focus:border-brand" />
      </div>
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
        <Label className="text-sm font-medium text-slate-700">Destacar na vitrine</Label>
        <Switch checked={data.featured} onCheckedChange={(v) => setData({ ...data, featured: v })} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" variant="brand" disabled={saving} className="rounded-lg">
          {saving ? "Salvando..." : "Salvar app"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-lg">
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}