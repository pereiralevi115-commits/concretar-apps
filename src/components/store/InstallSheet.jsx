import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, MoreVertical, PlusSquare, ExternalLink } from "lucide-react";

export default function InstallSheet({ app, open, onOpenChange }) {
  if (!app) return null;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const steps = isIOS
    ? [
        { icon: ExternalLink, text: "Abra o app no Safari (o botão abaixo já faz isso)." },
        { icon: Share, text: "Toque no ícone de Compartilhar na barra do Safari." },
        { icon: PlusSquare, text: "Escolha “Adicionar à Tela de Início” e confirme." },
      ]
    : [
        { icon: ExternalLink, text: "Abra o app no Chrome (o botão abaixo já faz isso)." },
        { icon: MoreVertical, text: "Toque no menu ⋮ no canto superior direito." },
        { icon: PlusSquare, text: "Escolha “Instalar app” ou “Adicionar à tela inicial”." },
      ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-slate-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-lg text-slate-900">Instalar {app.name}</DialogTitle>
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
        <Button
          variant="brand"
          className="w-full h-10 rounded-lg"
          onClick={() => window.open(app.url, "_blank")}
        >
          Abrir {app.name}
        </Button>
      </DialogContent>
    </Dialog>
  );
}