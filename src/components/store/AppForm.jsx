import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

const empty = { name: "", tagline: "", description: "", url: "", apk_url: "", icon_url: "", category: "Produtividade", featured: false };

export default function AppForm({ initial, onSubmit, onCancel }) {
  const [data, setData] = useState({ ...empty, ...(initial || {}) });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingApk, setUploadingApk] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const iconInputRef = useRef(null);
  const apkInputRef = useRef(null);
  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });

  const onUploadApk = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingApk(true);
    setUploadError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setData((d) => ({ ...d, apk_url: file_url }));
    } catch (err) {
      setUploadError("Falha ao enviar APK. Tente novamente.");
    } finally {
      setUploadingApk(false);
      e.target.value = "";
    }
  };

  const onUploadIcon = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setData((d) => ({ ...d, icon_url: file_url }));
    } catch (err) {
      setUploadError("Falha ao enviar imagem.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

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
        <Label className="text-xs font-medium text-slate-500">Ícone do app</Label>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
            {data.icon_url ? (
              <img src={data.icon_url} alt="ícone" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => iconInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md h-9"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Enviando..." : "Enviar imagem"}
          </Button>
          <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadIcon} disabled={uploading} />
        </div>
        <Input value={data.icon_url} onChange={set("icon_url")} placeholder="ou cole o link do ícone" className={field} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-500">APK do app (instalação direta no Android)</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => apkInputRef.current?.click()}
            disabled={uploadingApk}
            className="rounded-md h-9"
          >
            <Upload className="w-4 h-4" />
            {uploadingApk ? "Enviando APK..." : "Enviar APK"}
          </Button>
          <input ref={apkInputRef} type="file" accept=".apk,application/vnd.android.package-archive" className="hidden" onChange={onUploadApk} disabled={uploadingApk} />
          {data.apk_url && <span className="text-xs text-emerald-600 font-medium truncate max-w-[180px]">APK enviado ✓</span>}
        </div>
        <Input value={data.apk_url} onChange={set("apk_url")} placeholder="ou cole o link do APK" className={field} />
      </div>
      {uploadError && <p className="text-xs text-red-600 font-medium">{uploadError}</p>}
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