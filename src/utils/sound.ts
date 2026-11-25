let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.06,
  delay = 0
) {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    // Ignore audio errors on restricted devices
  }
}

export function playSound(
  effect: 'eliminate' | 'select' | 'undo' | 'hint' | 'error' | 'victory',
  enabled: boolean
) {
  if (!enabled) return;
  switch (effect) {
    case 'eliminate':
      playTone(320, 0.065, 'triangle', 0.045);
      break;
    case 'select':
      playTone(523.25, 0.09, 'sine', 0.06);
      playTone(659.25, 0.12, 'sine', 0.05, 0.045);
      break;
    case 'undo':
      playTone(392, 0.08, 'triangle', 0.04);
      break;
    case 'hint':
      playTone(587.33, 0.11, 'sine', 0.05);
      playTone(783.99, 0.14, 'sine', 0.045, 0.06);
      break;
    case 'error':
      playTone(220, 0.13, 'sawtooth', 0.035);
      playTone(185, 0.16, 'sawtooth', 0.035, 0.07);
      break;
    case 'victory':
      playTone(523.25, 0.14, 'sine', 0.07, 0);
      playTone(659.25, 0.14, 'sine', 0.07, 0.09);
      playTone(783.99, 0.16, 'sine', 0.07, 0.18);
      playTone(1046.5, 0.34, 'sine', 0.08, 0.28);
      break;
  }
}
