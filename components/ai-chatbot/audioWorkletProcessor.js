const audioWorkletProcessorSource = String.raw`
const NOISE_FLOOR_ALPHA = 0.02;

class VoiceStreamProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.muted = false;
    this.noiseFloor = 0;
    this.port.onmessage = (event) => {
      if (event.data.type === 'setMuted') this.muted = event.data.value;
    };
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    const data = input[0];
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
    const rms = Math.sqrt(sum / data.length);
    if (Number.isFinite(rms)) {
      if (!this.noiseFloor) {
        this.noiseFloor = rms;
      } else if (rms < this.noiseFloor * 1.5) {
        this.noiseFloor += (rms - this.noiseFloor) * NOISE_FLOOR_ALPHA;
      }
      this.port.postMessage({ type: 'micLevel', rms, noiseFloor: this.noiseFloor });
    }
    if (!this.muted) {
      const i16 = new Int16Array(data.length);
      for (let i = 0; i < data.length; i++) {
        const s = Math.max(-1, Math.min(1, data[i]));
        i16[i] = s < 0 ? s * 32768 : s * 32767;
      }
      this.port.postMessage({ type: 'audioData', buffer: i16.buffer }, [i16.buffer]);
    }
    return true;
  }
}

registerProcessor('voice-stream-processor', VoiceStreamProcessor);
`;

export default audioWorkletProcessorSource;
