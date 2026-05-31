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
