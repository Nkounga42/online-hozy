// guid.ts
export function guid(): string {
  // Utilise l’API native quand dispo (Node 16.14+ / navigateurs modernes)
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }

  // Polyfill RFC 4122 v4
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    (crypto as Crypto).getRandomValues(bytes);
  } else {
    // Node < 16.14: fallback
    const { randomBytes } = require("crypto");
    randomBytes(16).forEach((b: number, i: number) => (bytes[i] = b));
  }

  // Version & variant
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  const b = Array.from(bytes).map(toHex).join("");
  return `${b.slice(0,8)}-${b.slice(8,12)}-${b.slice(12,16)}-${b.slice(16,20)}-${b.slice(20)}`;
}
 

