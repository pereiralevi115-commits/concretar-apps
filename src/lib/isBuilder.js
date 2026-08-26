// Detecta se o app está rodando dentro do builder do Base44 (preview)
// em vez do app publicado. Usado para esconder telas internas (ex.: Gerenciar)
// que só devem aparecer durante a edição.
export function isBuilderPreview() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return (
    params.has("_preview_token") ||
    window.location.hostname.startsWith("preview-sandbox--")
  );
}