import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Download } from "lucide-react";
import { getInstallSteps } from "@/lib/deviceInstall";

export default function InstallSheet({ app, open, onOpenChange }) {
  if (!app) return null;
  const { device, browser, steps } = getInstallSteps(app.name);
  const hasApk = Boolean(app.apk_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-slate-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-lg text-slate-900">Instalar {app.name}</DialogTitle>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Passo a passo para {device} · {browser}</span>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pt-1.5">{s.text}</p>
            </div>
          ))}
        </div>
        {hasApk && (
          <Button
            variant="brand"
            className="w-full h-10 rounded-lg"
            onClick={() => window.open(app.apk_url, "_blank")}
          >
            <Download className="w-4 h-4" />
            Baixar e instalar APK
          </Button>
        )}
        <Button
          variant={hasApk ? "outline" : "brand"}
          className="w-full h-10 rounded-lg"
          onClick={() => window.open(app.url, "_blank")}
        >
          Abrir {app.name} no navegador
        </Button>
      </DialogContent>
    </Dialog>
  );
}