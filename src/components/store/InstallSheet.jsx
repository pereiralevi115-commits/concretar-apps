import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getInstallSteps } from "@/lib/deviceInstall";

function toDirectDownload(url) {
  if (!url) return url;
  try {
    // OneDrive pessoal (onedrive.live.com / 1drv.ms) — API de shares
    // com /root/content retorna o conteúdo direto do arquivo (redireciona).
    if (/onedrive\.live\.com|1drv\.ms/i.test(url)) {
      const b64 = btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return `https://api.onedrive.com/v1.0/shares/u!${b64}/root/content`;
    }
    // OneDrive for Business / SharePoint — ?download=1 força o download
    if (/sharepoint\.com|-my\.sharepoint\.com/i.test(url)) {
      const u = new URL(url);
      u.searchParams.set("download", "1");
      return u.toString();
    }
    // Google Drive share links — force direct download
    if (/drive\.google\.com/i.test(url)) {
      const m = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
      if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function InstallSheet({ app, open, onOpenChange }) {
  if (!app) return null;
  const { device, icon: DeviceIcon, steps } = getInstallSteps(app.name);
  const hasApk = Boolean(app.apk_url);
  const apkDirect = toDirectDownload(app.apk_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-slate-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-lg text-slate-900">Instalar {app.name}</DialogTitle>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <DeviceIcon className="w-3.5 h-3.5" />
            <span>Passo a passo para {device}</span>
          </div>
        </DialogHeader>
        <p className="text-xs text-slate-500 -mt-1">Treinamento rápido: siga cada etapa na ordem.</p>
        <div className="space-y-3 py-1">
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
            className="w-full h-11 rounded-lg font-semibold"
            onClick={() => window.open(apkDirect, "_blank")}
          >
            <Download className="w-4 h-4" />
            Baixar e instalar APK
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}