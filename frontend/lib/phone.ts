export function isValidKsaPhone(v: string): boolean {
  const cleaned = v.replace(/[\s-]/g, "");
  return /^(?:\+966|966|0)?5\d{8}$/.test(cleaned);
}

export function toE164(v: string): string {
  const cleaned = v.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+966")) return cleaned;
  if (cleaned.startsWith("966")) return `+${cleaned}`;
  if (cleaned.startsWith("05")) return `+966${cleaned.slice(1)}`;
  if (cleaned.startsWith("5")) return `+966${cleaned}`;
  return cleaned;
}

/** Display as 05xxxxxxxx for confirmation screens */
export function formatPhoneDisplay(v: string): string {
  const cleaned = v.replace(/[\s-]/g, "");
  if (cleaned.startsWith("05")) return cleaned;
  if (cleaned.startsWith("+9665")) return `0${cleaned.slice(4)}`;
  if (cleaned.startsWith("9665")) return `0${cleaned.slice(3)}`;
  if (/^5\d{8}$/.test(cleaned)) return `0${cleaned}`;
  return cleaned;
}
