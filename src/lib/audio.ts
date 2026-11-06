/** A soft, synthesised wooden "tick-tick" and an optional chime, like the app's alert sounds. */
let ctx: AudioContext | null = null;

function audio() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = ctx ?? new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function wood(at: number, gain = 0.5) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + at;
  // A short burst of filtered noise plus a quickly damped low tone reads as a soft wooden tick.
  const len = Math.floor(ac.sampleRate * 0.05);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
  const noise = ac.createBufferSource();
  noise.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1900;
  bp.Q.value = 4;
  const ng = ac.createGain();
  ng.gain.value = gain * 0.9;
  noise.connect(bp).connect(ng).connect(ac.destination);
  const osc = ac.createOscillator();
  osc.frequency.setValueAtTime(820, t);
  osc.frequency.exponentialRampToValueAtTime(420, t + 0.06);
  const og = ac.createGain();
  og.gain.setValueAtTime(gain * 0.5, t);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(og).connect(ac.destination);
  noise.start(t);
  osc.start(t);
  osc.stop(t + 0.1);
}

export function chime(at = 0) {
  const ac = audio();
  if (!ac) return;
  for (const [f, dt] of [[880, 0], [1318.5, 0.12]] as const) {
    const t = ac.currentTime + at + dt;
    const o = ac.createOscillator();
    o.frequency.value = f;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + 1.2);
  }
}

export const tickTick = () => {
  wood(0);
  wood(0.16, 0.42);
};
export const softTick = () => wood(0, 0.22);

export type SoundMode = "off" | "tick" | "both";
export function alertSound(mode: SoundMode) {
  if (mode === "off") return;
  tickTick();
  if (mode === "both") chime(0.38);
}
