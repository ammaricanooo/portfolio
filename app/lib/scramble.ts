// ─── Shared scramble utilities ────────────────────────────────────────────────

const SYM  = "!@#$%^&*()_+-=[]{}|;':\",./<>?\\";
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randStr = (chars: string, len: number) =>
  Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

export const scramble = (el: HTMLElement | null, target: string, dur = 0.5, sym = false) => {
  if (!el) return;
  let t = 0;
  const fps = sym ? 40 : 30;
  if ((el as any)._si) clearInterval((el as any)._si);
  (el as any)._si = setInterval(() => {
    t += fps;
    const p = Math.min(t / (dur * 1000), 1);
    if (p >= 1) { clearInterval((el as any)._si); el.textContent = target; return; }
    if (sym) {
      el.textContent = randStr(SYM, target.length);
    } else {
      const done = Math.floor(target.length * p);
      el.textContent = target.slice(0, done) + randStr(ALPHA, target.length - done);
    }
  }, fps);
};
