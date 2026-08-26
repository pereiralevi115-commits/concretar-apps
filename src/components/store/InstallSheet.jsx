import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { getInstallSteps } from "@/lib/deviceInstall";

export default function InstallSheet({ app, open, onOpenChange }) {
  const [resolving, setResolving] = useState(false);
  if (!app) return null;
  const { device, icon: DeviceIcon, steps } = getInstallSteps(app.name);
  const hasApk = Boolean(app.apk_url);

  const handleInstall = async () => {
    if (!app.apk_url) return;
    // URLs já diretas (armazenamento do app ou CDN) abem sem resolução.
    if (/media\.base44\.com|wixstatic\.com/i.test(app.apk_url)) {
      window.open(app.apk_url, "_blank");
      return;
    }
    setResolving(true);
    try {
      const res = await base44.functions.invoke("resolveDownloadUrl", { url: app.apk_url });
      window.open(res.data.url, "_blank");
    } catch {
      window.open(app.apk_url, "_blank");
    } finally {
      setResolving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-slate-200 max-w-md max-h-[90vh] flex flex-col gap-3 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <DialogHeader className="space-y-1 shrink-0">
          <DialogTitle className="font-bold text-lg text-slate-900">Instalar {app.name}</DialogTitle>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <DeviceIcon className="w-3.5 h-3.5" />
            <span>Passo a passo para {device}</span>
          </div>
        </DialogHeader>
        <p className="text-xs text-slate-500 shrink-0">Treinamento rápido: siga cada etapa na ordem.</p>
        <div className="space-y-3 py-1 overflow-y-auto -mx-1 px-1 flex-1 min-h-0">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3 items-start rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm tabular-nums">
                  {i + 1}
                </div>
              </div>
              <div className="min-w-0 pt-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  <s.icon className="w-3.5 h-3.5" />
                  <span>Etapa {i + 1}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mt-0.5">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        {hasApk && (
          <Button
            variant="brand"
            className="w-full h-11 rounded-lg font-semibold shrink-0"
            onClick={handleInstall}
            disabled={resolving}
          >
            {resolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {resolving ? "Preparando download..." : "Baixar e instalar APK"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}