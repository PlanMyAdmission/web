'use client';

import { useEffect, useRef } from 'react';

const BAR_COUNT = 24;

const VoiceLevelBars = ({ stream, active }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const dataRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const resize = () => {
      const w = canvas.clientWidth || 220;
      const h = canvas.clientHeight || 26;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    let ro = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    const teardown = () => {
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioCtxRef.current?.close().catch(() => {});
      sourceRef.current = null;
      analyserRef.current = null;
      audioCtxRef.current = null;
      dataRef.current = null;
    };

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const w = canvas.clientWidth || 220;
      const h = canvas.clientHeight || 26;
      const gap = 5;
      const barW = Math.max(2, (w - gap * (BAR_COUNT - 1)) / BAR_COUNT);
      const mid = h / 2;
      let x = 0;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(244, 0, 118, 0.85)';

      if (!active || !analyserRef.current || !dataRef.current) {
        for (let i = 0; i < BAR_COUNT; i++) {
          const bh = 8 + (i % 3);
          ctx.fillRect(x, mid - bh / 2, barW, bh);
          x += barW + gap;
        }
        return;
      }

      analyserRef.current.getByteFrequencyData(dataRef.current);
      const d = dataRef.current;
      const slice = Math.max(1, Math.floor(d.length / BAR_COUNT));

      for (let i = 0; i < BAR_COUNT; i++) {
        const start = i * slice;
        const end = Math.min(d.length, start + slice);
        let sum = 0;
        for (let j = start; j < end; j++) sum += d[j];
        const avg = (end - start) ? sum / (end - start) : 0;
        const bh = Math.max(6, Math.min(1, avg / 170) * (h - 3));
        ctx.fillRect(x, mid - bh / 2, barW, bh);
        x += barW + gap;
      }
    };

    if (stream) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        const ac = new AC();
        audioCtxRef.current = ac;
        const src = ac.createMediaStreamSource(stream);
        sourceRef.current = src;
        const analyser = ac.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        analyserRef.current = analyser;
        src.connect(analyser);
        dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      }
    }

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      teardown();
      ro?.disconnect();
      if (!ro) window.removeEventListener('resize', resize);
    };
  }, [stream, active]);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ display: 'block', width: '220px', height: '22px' }} />;
};

export default VoiceLevelBars;
