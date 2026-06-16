// ─── Shared scramble utilities ────────────────────────────────────────────────

const SYM  = "!@#$%^&*()_+-=[]{}|;':\",./<>?\\";
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randStr = (chars: string, len: number) =>
  Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

const _siKey = Symbol("_scrambleInterval");

interface ScrambleElement extends HTMLElement {
  [_siKey]?: ReturnType<typeof setInterval>;
}

export const scramble = (el: HTMLElement | null, target: string, dur = 0.5, sym = false) => {
  if (!el) return;
  const scrEl = el as ScrambleElement;
  let t = 0;
  const fps = sym ? 40 : 30;
  if (scrEl[_siKey]) clearInterval(scrEl[_siKey]);

  const tick = () => {
    t += fps;
    const p = Math.min(t / (dur * 1000), 1);
    if (p >= 1) {
      clearInterval(scrEl[_siKey]);
      el.textContent = target;
      return;
    }
    if (sym) {
      el.textContent = randStr(SYM, target.length);
    } else {
      const done = Math.floor(target.length * p);
      el.textContent = target.slice(0, done) + randStr(ALPHA, target.length - done);
    }
  };

  el.textContent = sym ? randStr(SYM, target.length) : randStr(ALPHA, target.length);
  scrEl[_siKey] = setInterval(tick, fps);
};
