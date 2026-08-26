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

  const field = "bg-white/5 border-white/10 text-white h-11 rounded-xl";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white/70">Nome do app</Label>
          <Input required value={data.name} onChange={set("name")} className={field} />
        </div>
        <div className="space-y-2">
          <Label className="text-white/70">Categoria</Label>
          <Input value={data.category} onChange={set("category")} className={field} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white/70">Link do app (URL publicada)</Label>
        <Input required type="url" placeholder="https://..." value={data.url} onChange={set("url")} className={field} />
      </div>
      <div className="space-y-2">
        <Label className="text-white/70">Link do ícone</Label>
        <Input value={data.icon_url} onChange={set("icon_url")} className={field} />
      </div>
      <div className="space-y-2">
        <Label className="text-white/70">Frase curta</Label>
        <Input value={data.tagline} onChange={set("tagline")} className={field} />
      </div>
      <div className="space-y-2">
        <Label className="text-white/70">Descrição</Label>
        <Textarea value={data.description} onChange={set("description")} className="bg-white/5 border-white/10 text-white rounded-xl min-h-24" />
      </div>
      <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
        <Label className="text-white/70">Destacar na vitrine</Label>
        <Switch checked={data.featured} onCheckedChange={(v) => setData({ ...data, featured: v })} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="rounded-xl bg-white text-black hover:bg-white/90">
          {saving ? "Salvando..." : "Salvar app"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl text-white/60">
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}