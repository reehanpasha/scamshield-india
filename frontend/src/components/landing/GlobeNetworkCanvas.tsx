import React, { useEffect, useRef } from 'react';

interface ThreatNode {
  x: number;
  y: number;
  z: number;
  label: string;
  type: 'SAFE' | 'THREAT';
  pulse: number;
}

export const GlobeNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate Globe Nodes
    const numNodes = 75;
    const nodes: ThreatNode[] = [];
    const radius = Math.min(width, height) * 0.38;

    const indianHubs = [
      { name: 'Delhi', isThreat: false },
      { name: 'Mumbai', isThreat: true },
      { name: 'Bengaluru', isThreat: false },
      { name: 'Hyderabad', isThreat: true },
      { name: 'Chennai', isThreat: false },
      { name: 'Kolkata', isThreat: true },
      { name: 'Pune', isThreat: false },
      { name: 'Ahmedabad', isThreat: true },
    ];

    for (let i = 0; i < numNodes; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * 2 * Math.PI;

      const isHub = i < indianHubs.length;
      nodes.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        label: isHub ? indianHubs[i].name : '',
        type: isHub && indianHubs[i].isThreat ? 'THREAT' : 'SAFE',
        pulse: Math.random() * Math.PI
      });
    }

    let rotX = 0.2;
    let rotY = 0;
    let radarAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotY += 0.004;
      radarAngle += 0.02;

      const cx = width / 2;
      const cy = height / 2;

      // Draw faint cyber radar circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Radar sweep beam
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius * 1.15, radarAngle, radarAngle + 0.35);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.15);
      sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      sweepGrad.addColorStop(1, 'rgba(6, 182, 212, 0.12)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // Rotate nodes in 3D
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projected = nodes.map((node) => {
        // Rotate around Y
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;
        // Rotate around X
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX;

        // Perspective projection
        const scale = (z2 + radius * 1.8) / (radius * 2.8);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          z2,
          node
        };
      });

      // Draw connection lines between nearby front nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        if (projected[i].z2 < -radius * 0.4) continue; // Skip back half
        for (let j = i + 1; j < projected.length; j++) {
          if (projected[j].z2 < -radius * 0.4) continue;
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.25 * (projected[i].scale + projected[j].scale) * 0.5;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projected.forEach((p) => {
        const { px, py, scale, z2, node } = p;
        const alpha = Math.max(0.15, Math.min(1, (z2 + radius) / (radius * 2)));

        node.pulse += 0.05;
        const pulseFactor = Math.sin(node.pulse) * 0.5 + 0.5;

        if (node.type === 'THREAT') {
          // Red Threat Node
          ctx.beginPath();
          ctx.arc(px, py, Math.max(1, (3 + pulseFactor * 2) * scale), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.fill();

          // Outer pulse ring
          ctx.beginPath();
          ctx.arc(px, py, (6 + pulseFactor * 5) * scale, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.4})`;
          ctx.stroke();
        } else {
          // Cyan Safe Node
          ctx.beginPath();
          ctx.arc(px, py, Math.max(1, 2.5 * scale), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.fill();
        }

        // Draw hub label if in front
        if (node.label && z2 > 0) {
          ctx.font = '10px monospace';
          ctx.fillStyle = node.type === 'THREAT' ? `rgba(248, 113, 113, ${alpha})` : `rgba(125, 211, 252, ${alpha})`;
          ctx.fillText(node.label, px + 8, py + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
