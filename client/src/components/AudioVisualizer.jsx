import React, { useRef, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';

export const AudioVisualizer = ({ height = 48, barCount = 48, mode = 'bars' }) => {
  const canvasRef = useRef(null);
  const { isPlaying, analyser } = useMusic();
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const h = canvas.height;

    // Buffer for analyser
    let dataArray = null;
    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, h);

      if (analyser && isPlaying) {
        try {
          analyser.getByteFrequencyData(dataArray);
        } catch (e) {
          dataArray = null;
        }
      }

      phase += 0.08;
      const barWidth = width / barCount;

      for (let i = 0; i < barCount; i++) {
        let value = 0;

        if (analyser && dataArray && isPlaying) {
          // Map frequency data index
          const sampleIndex = Math.floor((i / barCount) * (dataArray.length / 2));
          value = (dataArray[sampleIndex] || 0) / 255;
        } else if (isPlaying) {
          // High-fidelity synthesized wave pattern when Web Audio isn't actively streaming audio bytes
          const wave1 = Math.sin(phase + i * 0.3) * 0.4 + 0.5;
          const wave2 = Math.cos(phase * 0.7 + i * 0.5) * 0.3 + 0.4;
          const wave3 = Math.sin(phase * 1.4 + i * 0.8) * 0.2;
          value = Math.max(0.12, Math.min(0.95, (wave1 + wave2 + wave3) / 1.7));
        } else {
          // Subtle resting wave
          value = 0.08 + Math.sin(i * 0.4) * 0.04;
        }

        const barHeight = Math.max(3, value * h);
        const x = i * barWidth;
        const y = h - barHeight;

        // Radiant color gradient: White -> Sky Blue -> Electric Blue -> Crimson Peaks
        const gradient = ctx.createLinearGradient(0, h, 0, 0);
        gradient.addColorStop(0, '#0ea5e9'); // Sky Blue
        gradient.addColorStop(0.4, '#2563eb'); // Radiant Blue
        gradient.addColorStop(0.85, '#f43f5e'); // Crimson
        gradient.addColorStop(1, '#ffffff'); // Crisp White

        ctx.fillStyle = gradient;

        // Draw rounded top bar
        const r = Math.min(barWidth / 2 - 1, 2);
        const bw = Math.max(2, barWidth - 2.5);

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + bw - r, y);
        ctx.quadraticCurveTo(x + bw, y, x + bw, y + r);
        ctx.lineTo(x + bw, h);
        ctx.lineTo(x, h);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        // Crimson peak dot if playing high frequency
        if (isPlaying && value > 0.6) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x + bw / 2, Math.max(2, y - 3), 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, analyser, barCount]);

  return (
    <div className="w-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full h-full block filter drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]"
      />
    </div>
  );
};
