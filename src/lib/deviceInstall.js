import { Download, Settings, ShieldOff, Check, FileDown } from "lucide-react";

// Passo a passo de instalação do APK no Android, específico por modelo,
// incluindo como liberar a instalação de fontes desconhecidas.
export function getInstallSteps(appName) {
  const ua = navigator.userAgent || "";

  const isSamsung = /Samsung/i.test(ua) || /SM-[A-Z0-9]/i.test(ua);
  const isMotorola = /Moto|motorola/i.test(ua) || /XT\d{4}/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !/Windows Phone/.test(ua);

  const stepDownload = { icon: Download, text: "Toque em “Baixar e instalar APK” abaixo. O arquivo será baixado para o celular." };
  const stepOpen = { icon: FileDown, text: `Após o download, abra o arquivo ${appName}.apk na pasta Downloads (ou na notificação “Download concluído”).` };
  const stepInstall = { icon: Check, text: "Confirme a instalação. Quando terminar, o ícone do app aparecerá junto dos outros aplicativos." };

  if (isSamsung) {
    return {
      device: "Samsung",
      browser: "Samsung Internet / Chrome",
      steps: [
        stepDownload,
        stepOpen,
        { icon: ShieldOff, text: "Se aparecer “Aplicativo desconhecido bloqueado”: vá em Configurações → Segurança e privacidade → Bloqueador automático e desative a opção." },
        { icon: Settings, text: "Se pedir permissão: Configurações → Apps → (Samsung Internet ou Chrome) → Instalar apps desconhecidas → Permitir." },
        stepInstall,
      ],
    };
  }

  if (isMotorola) {
    return {
      device: "Motorola",
      browser: "Chrome",
      steps: [
        stepDownload,
        stepOpen,
        { icon: Settings, text: "Se pedir permissão: Configurações → Apps → Chrome → Instalar apps desconhecidas → Permitir nesta origem." },
        stepInstall,
      ],
    };
  }

  if (isAndroid) {
    return {
      device: "Android",
      browser: "Chrome",
      steps: [
        stepDownload,
        stepOpen,
        { icon: Settings, text: "Se pedir permissão: Configurações → Apps → Chrome → Instalar apps desconhecidas → Permitir nesta origem." },
        stepInstall,
      ],
    };
  }

  // iPhone/iPad/Computador — não suportam APK
  return {
    device: isIOS ? "iPhone / iPad" : "Computador",
    browser: isIOS ? "iOS" : "Navegador",
    steps: [
      { icon: Download, text: isIOS
        ? "iPhone e iPad não instalam arquivos APK. Use um celular Android para instalar este app."
        : "No computador, baixe o APK e transfira para um celular Android para instalar." },
    ],
  };
}