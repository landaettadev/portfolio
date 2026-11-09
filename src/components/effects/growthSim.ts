/** Differential-growth simulation, kept pure so it can run headless. */
export interface P { x: number; y: number }
export interface Pulse { pos: number; speed: number; life: number }

export const MAX_NODES = 1500;
const MAX_EDGE = 4.6;
const REPEL_R = 9;
const REPEL_K = 0.42;
const ATTRACT_K = 0.22;

export const createBrain = (W: number, H: number) => {
    const rx = W * 0.225;
    const ry = H * 0.4;
    const hemis = [
      { cx: W / 2 - rx * 0.98, cy: H / 2, rx, ry },
      { cx: W / 2 + rx * 0.98, cy: H / 2, rx, ry },
    ];
    const curves: P[][] = hemis.map((h) =>
      Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return { x: h.cx + Math.cos(a) * 18, y: h.cy + Math.sin(a) * 18 };
      })
    );
    const pointer = { x: -999, y: -999 };

    const step = () => {
      curves.forEach((pts, ci) => {
        const h = hemis[ci];
        const n = pts.length;
        // spatial hash
        const grid = new Map<number, number[]>();
        const key = (gx: number, gy: number) => gx * 7919 + gy;
        for (let i = 0; i < n; i++) {
          const k = key(Math.floor(pts[i].x / REPEL_R), Math.floor(pts[i].y / REPEL_R));
          const cell = grid.get(k);
          if (cell) cell.push(i);
          else grid.set(k, [i]);
        }
        const next: P[] = new Array(n);
        for (let i = 0; i < n; i++) {
          const p = pts[i];
          const a = pts[(i - 1 + n) % n];
          const b = pts[(i + 1) % n];
          let fx = ((a.x + b.x) / 2 - p.x) * ATTRACT_K;
          let fy = ((a.y + b.y) / 2 - p.y) * ATTRACT_K;
          const gx = Math.floor(p.x / REPEL_R);
          const gy = Math.floor(p.y / REPEL_R);
          for (let ox = -1; ox <= 1; ox++)
            for (let oy = -1; oy <= 1; oy++) {
              const cell = grid.get(key(gx + ox, gy + oy));
              if (!cell) continue;
              for (const j of cell) {
                const d = Math.abs(i - j);
                if (d < 3 || d > n - 3) continue;
                const dx = p.x - pts[j].x;
                const dy = p.y - pts[j].y;
                const dist2 = dx * dx + dy * dy;
                if (dist2 > REPEL_R * REPEL_R || dist2 === 0) continue;
                const dist = Math.sqrt(dist2);
                const f = ((REPEL_R - dist) / REPEL_R) * REPEL_K;
                fx += (dx / dist) * f;
                fy += (dy / dist) * f;
              }
            }
          // the pointer gently pushes the tissue
          const pdx = p.x - pointer.x;
          const pdy = p.y - pointer.y;
          const pd2 = pdx * pdx + pdy * pdy;
          if (pd2 < 900) {
            const pd = Math.sqrt(pd2) || 1;
            fx += (pdx / pd) * (30 - pd) * 0.03;
            fy += (pdy / pd) * (30 - pd) * 0.03;
          }
          const fm = Math.hypot(fx, fy);
          if (fm > 1.5) {
            fx = (fx / fm) * 1.5;
            fy = (fy / fm) * 1.5;
          }
          let x = p.x + fx;
          let y = p.y + fy;
          const ex = (x - h.cx) / h.rx;
          const ey = (y - h.cy) / h.ry;
          const e = ex * ex + ey * ey;
          if (e > 1) {
            const s = 0.995 / Math.sqrt(e);
            x = h.cx + (x - h.cx) * s;
            y = h.cy + (y - h.cy) * s;
          }
          next[i] = { x, y };
        }
        // split long edges, then grow at a few random places
        const out: P[] = [];
        for (let i = 0; i < next.length; i++) {
          const p = next[i];
          const q = next[(i + 1) % next.length];
          out.push(p);
          if (out.length < MAX_NODES && Math.hypot(q.x - p.x, q.y - p.y) > MAX_EDGE) out.push({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
        }
        for (let g = 0; g < 3 && out.length < MAX_NODES; g++) {
          const i = Math.floor(Math.random() * out.length);
          const p = out[i];
          const q = out[(i + 1) % out.length];
          out.splice(i + 1, 0, { x: (p.x + q.x) / 2 + (Math.random() - 0.5), y: (p.y + q.y) / 2 + (Math.random() - 0.5) });
        }
        curves[ci] = out;
      });
    };

    return { curves, pointer, step };
};
