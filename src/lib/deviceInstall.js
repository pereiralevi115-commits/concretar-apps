import { Download, Settings, ShieldOff, Check, FileDown, Smartphone } from "lucide-react";

// Detecção de marca/dispositivo + passo a passo de instalação do APK no Android.
export function getInstallSteps(appName) {
  const ua = navigator.userAgent || "";

  const isSamsung = /Samsung|SM-[A-Z0-9]/i.test(ua);
  const isMotorola = /Moto|motorola|XT\d{4}/i.test(ua);
  const isXiaomi = /Mi\s|Redmi|POCO|xiaomi|miui/i.test(ua);
  const isLg = /LG|LM-/i.test(ua);
  const isAsus = /Asus|Zenfone/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !/Windows Phone/.test(ua);

  const stepDownload = { icon: Download, text: "Toque em “Baixar e instalar APK” abaixo. O arquivo será salvo no celular." };
  const stepOpen = { icon: FileDown, text: `Após o download, abra o arquivo ${appName}.apk na pasta Downloads (ou toque na notificação “Download concluído”).` };
  const stepInstall = { icon: Check, text: "Confirme a instalação. Quando terminar, o ícone do app aparecerá junto dos outros aplicativos." };

  if (isSamsung) {
    return {
      device: "Samsung",
      icon: Smartphone,
      steps: [
        stepDownload,
        stepOpen,
        { icon: ShieldOff, text: "Se aparecer “Aplicativo desconhecido bloqueado”, toque em OK e desative o Bloqueador automático: Configurações → Segurança e privacidade → Bloqueador automático → desativar." },
        { icon: Settings, text: "Abra o arquivo novamente. Se pedir permissão de fonte desconhecida: Configurações → Apps → (Samsung Internet ou Chrome) → Instalar apps desconhecidas → Permitir." },
        stepInstall,
      ],
    };
  }

  if (isMotorola) {
    return {
      device: "Motorola",
      icon: Smartphone,
      steps: [
        stepDownload,
        stepOpen,
        { icon: Settings, text: "Se pedir permissão: Configurações → Apps → Chrome → Instalar apps desconhecidas → Permitir nesta origem." },
        stepInstall,
      ],
    };
  }

  if (isXiaomi) {
    return {
      device: "Xiaomi / Redmi / POCO",
      icon: Smartphone,
      steps: [
        stepDownload,
        stepOpen,
        { icon: ShieldOff, text: "Se aparecer aviso de segurança da MIUI, toque em “Instalar mesmo assim” e autorize em Configurações → Permissões → Instalar apps desconhecidos → permitir o navegador." },
        { icon: Settings, text: "Se necessário: Configurações → Apps → (Mi Browser ou Chrome) → Instalar apps desconhecidas → Permitir." },
        stepInstall,
      ],
    };
  }

  if (isLg) {
    return {
      device: "LG",
      icon: Smartphone,
      steps: [
        stepDownload,
        stepOpen,
        { icon: Settings, text: "Se pedir permissão: Configurações → Apps e notificações → Acesso especial a apps → Instalar apps desconhecidas → (navegador) → Permitir." },
        stepInstall,
      ],
    };
  }

  if (isAsus) {
    return {
      device: "Asus / Zenfone",
      icon: Smartphone,
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
      icon: Smartphone,
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
    icon: Smartphone,
    steps: [
      { icon: Download, text: isIOS
        ? "iPhone e iPad não instalam arquivos APK. Use um celular Android para instalar este app."
        : "No computador, baixe o APK e transfira para um celular Android para instalar." },
    ],
  };
}