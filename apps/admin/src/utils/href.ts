export function generateExternalLink(href?: string) {
  if (!href) return "";
  try {
    return new URL(href).toString();
  } catch (e: any) {
    if (e.message.toLowerCase().includes("invalid")) {
      return new URL("https://" + href).toString();
    }
  }
}
