/**
 * Synthesised stadium ambience (filtered noise with a slow swell) built with the Web Audio API,
 * so no third-party audio recording is needed. Only starts on an explicit user action.
 */
export function createCrowdAudio() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  const seconds = 4;
  const buffer = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      // Brown-ish noise reads as a distant crowd murmur.
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;

  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 520;
  band.Q.value = 0.6;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.12;
  lfo.connect(lfoGain).connect(gain.gain);

  src.connect(band).connect(gain).connect(ctx.destination);
  src.start();
  lfo.start();
  gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 1.5);

  return {
    stop() {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => ctx.close().catch(() => undefined), 700);
    },
  };
}
