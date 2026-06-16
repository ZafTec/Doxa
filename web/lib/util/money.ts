/**
 * Money helpers. All amounts are integers in minor units (e.g. cents).
 * Never accept floats — backend stores ItemVariant.price as `Int`.
 */

const DEFAULT_CURRENCY = "USD";

export function formatPrice(minorUnits: number, currency = DEFAULT_CURRENCY): string {
  const major = minorUnits / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(major);
}

export function formatPriceWithCurrencyLabel(
  minorUnits: number,
  currency = DEFAULT_CURRENCY,
): string {
  return `${formatPrice(minorUnits, currency)} ${currency}`;
}
