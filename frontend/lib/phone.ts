/** Moroccan mobile: 06 / 07, local or +212 */

export function isValidMaPhone(v: string): boolean {
  const cleaned = v.replace(/[\s-]/g, "");
  return /^(?:\+212|212|0)?[67]\d{8}$/.test(cleaned);
}

export function toE164(v: string): string {
  const cleaned = v.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+212")) return cleaned;
  if (cleaned.startsWith("212")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+212${cleaned.slice(1)}`;
  if (/^[67]\d{8}$/.test(cleaned)) return `+212${cleaned}`;
  return cleaned;
}

export function formatPhoneDisplay(v: string): string {
  const cleaned = v.replace(/[\s-]/g, "");
  if (/^0[67]\d{8}$/.test(cleaned)) return cleaned;
  if (cleaned.startsWith("+212")) return `0${cleaned.slice(4)}`;
  if (cleaned.startsWith("212")) return `0${cleaned.slice(3)}`;
  if (/^[67]\d{8}$/.test(cleaned)) return `0${cleaned}`;
  return cleaned;
}
