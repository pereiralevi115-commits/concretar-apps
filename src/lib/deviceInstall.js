import { Share, MoreVertical, PlusSquare, ExternalLink, Download, Globe } from "lucide-react";

// Detecta o modelo do celular a partir do userAgent e retorna
// um passo a passo de instalação específico, priorizando
// "Instalar app" em vez de "Adicionar à tela inicial".
export function getInstallSteps(appName) {
  const ua = navigator.userAgent || "";

  const isIOS = /iPad|iPhone|iPod/.test(ua) && !/Windows Phone/.test(ua);
  const isSamsung = /Samsung/i.test(ua) || /SM-[A-Z0-9]/i.test(ua);
  const isMotorola = /Moto|motorola/i.test(ua) || /XT\d{4}/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  const openText = `Abra o ${appName} no navegador (o botão abaixo já faz isso).`;

  if (isIOS) {
    return {
      device: "iPhone / iPad",
      browser: "Safari",
      steps: [
        { icon: ExternalLink, text: openText },
        { icon: Share, text: "Toque no ícone de Compartilhar (um quadrado com seta para cima) na barra do Safari." },
        { icon: PlusSquare, text: "Role até baixo e toque em “Adicionar à Tela de Início”." },
        { icon: Download, text: "Confirme em “Adicionar”. O ícone vai aparecer na tela inicial como um app." },
      ],
    };
  }

  if (isSamsung) {
    return {
      device: "Samsung",
      browser: "Samsung Internet / Chrome",
      steps: [
        { icon: ExternalLink, text: `Abra o ${appName} no Samsung Internet ou Chrome (o botão abaixo já faz isso).` },
        { icon: MoreVertical, text: "Toque no menu (⋮ no canto superior direito ou ≡ no canto inferior)." },
        { icon: Download, text: "Toque em “Instalar app” (priorize esta opção). Se não aparecer, escolha “Adicionar à tela inicial”." },
        { icon: PlusSquare, text: "Confirme. O app será instalado e aparecerá junto dos outros aplicativos." },
      ],
    };
  }

  if (isMotorola) {
    return {
      device: "Motorola",
      browser: "Chrome",
      steps: [
        { icon: ExternalLink, text: `Abra o ${appName} no Chrome (o botão abaixo já faz isso).` },
        { icon: MoreVertical, text: "Toque no menu ⋮ no canto superior direito." },
        { icon: Download, text: "Toque em “Instalar app” (priorize esta opção). Se não aparecer, escolha “Adicionar à tela inicial”." },
        { icon: PlusSquare, text: "Confirme a instalação. O app vai aparecer junto dos outros aplicativos." },
      ],
    };
  }

  if (isAndroid) {
    return {
      device: "Android",
      browser: "Chrome",
      steps: [
        { icon: ExternalLink, text: openText },
        { icon: MoreVertical, text: "Toque no menu ⋮ no canto superior direito." },
        { icon: Download, text: "Toque em “Instalar app” (priorize esta opção). Se não aparecer, escolha “Adicionar à tela inicial”." },
        { icon: PlusSquare, text: "Confirme a instalação. O app vai aparecer junto dos outros aplicativos." },
      ],
    };
  }

  return {
    device: "Computador",
    browser: "Navegador",
    steps: [
      { icon: Globe, text: `Abra o ${appName} no Chrome, Edge ou outro navegador (o botão abaixo já faz isso).` },
      { icon: MoreVertical, text: "No Chrome, clique no ícone de instalação (⊕) que aparece à direita da barra de endereço." },
      { icon: Download, text: "Clique em “Instalar”. O app abre como janela separada e fica disponível no computador." },
    ],
  };
}