export function ensureCSSUnit(val: number | string | boolean, unit = "rem") {
  if (val === false) return null;
  const type = typeof val;
  if (type === "number") return `${val}${unit}`;
  return val;
}

export function remToPx(rem: string): number {
  return parseFloat(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function getCSSVariable(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

export function setCSSVars(values: Record<string, string>) {
  const style = document.documentElement.style
  Object.keys(values).forEach(key => {
    style.setProperty(key, values[key]);
  })
}