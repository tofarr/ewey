import type { TFunction } from 'i18next';

export function keyToLabel(key: string) {
  const fallbackLabel = key
    .split("_")
    .filter(p => !!p)
    .map((p) => p[0].toUpperCase() + p.substr(1))
    .join(" ");
  return fallbackLabel
}

export function getLabel(key: string, t: TFunction) {
  const fallbackLabel = key
    .split("_")
    .filter(p => !!p)
    .map((p) => p[0].toUpperCase() + p.substr(1))
    .join(" ");
  const result = t(key, fallbackLabel);
  return result;
}
