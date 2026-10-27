export function scaleOf(el: Element | null): number {
  if (!el) return 1;
  const r = el.getBoundingClientRect();
  const w = (el as HTMLElement).offsetWidth || (el as HTMLElement).clientWidth;
  return w ? r.width / w : 1;
}

export function localPoint(el: Element, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect();
  const s = scaleOf(el);
  return { x: (clientX - r.left) / s, y: (clientY - r.top) / s };
}
