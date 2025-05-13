import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 300;
const CHARGE_RADIUS = 20;
const K = 8.99e9;
const PX_PER_M = 50;
const MIN_DIST = 0.2; // meters
const MAX_DIST = 8; // meters
const MIN_Q = -5e-6;
const MAX_Q = 5e-6;

const getForce = (q1, q2, r) => {
  if (r === 0) return 0;
  return K * Math.abs(q1 * q2) / (r * r);
};

const getForceDirection = (q1, q2) => {
  if (q1 * q2 > 0) return 'Repulsive';
  if (q1 * q2 < 0) return 'Attractive';
  return 'None';
};

const getArrowColor = (type) => (type === 'Repulsive' ? '#e53935' : '#1976d2');

const getFieldLineColor = () => '#aaa';

const EnhancedElectricForceSimulation = () => {
  // Interactive state
  const [q1, setQ1] = useState(2e-6);
  const [q2, setQ2] = useState(-2e-6);
  const [distance, setDistance] = useState(2);
  const [animate, setAnimate] = useState(false);
  const [charge1X, setCharge1X] = useState(CANVAS_WIDTH / 2 - (2 * PX_PER_M) / 2);
  const [charge2X, setCharge2X] = useState(CANVAS_WIDTH / 2 + (2 * PX_PER_M) / 2);

  // Reset positions when distance changes or reset
  useEffect(() => {
    setCharge1X(CANVAS_WIDTH / 2 - (distance * PX_PER_M) / 2);
    setCharge2X(CANVAS_WIDTH / 2 + (distance * PX_PER_M) / 2);
  }, [distance, animate === false]);

  // Animation effect
  useEffect(() => {
    if (!animate) return;
    let frame;
    const step = () => {
      const center = CANVAS_WIDTH / 2;
      let dPx = charge2X - charge1X;
      let dM = dPx / PX_PER_M;
      let type = getForceDirection(q1, q2);
      if (type === 'Repulsive' && dM < MAX_DIST) {
        setCharge1X((x) => clamp(x - 1, CHARGE_RADIUS, center - (MIN_DIST * PX_PER_M) / 2));
        setCharge2X((x) => clamp(x + 1, center + (MIN_DIST * PX_PER_M) / 2, CANVAS_WIDTH - CHARGE_RADIUS));
      } else if (type === 'Attractive' && dM > MIN_DIST) {
        setCharge1X((x) => clamp(x + 1, CHARGE_RADIUS, center));
        setCharge2X((x) => clamp(x - 1, center, CANVAS_WIDTH - CHARGE_RADIUS));
      }
      // Stop animation if limits reached
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [animate, q1, q2]);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(240);
    const centerY = CANVAS_HEIGHT / 2;
    // Draw field lines (optional, simple)
    for (let i = -3; i <= 3; i++) {
      let y = centerY + i * 15;
      p5.stroke(getFieldLineColor());
      p5.noFill();
      p5.beginShape();
      for (let t = 0; t <= 1; t += 0.05) {
        let x = (1 - t) * charge1X + t * charge2X;
        let curve = Math.sin(Math.PI * t) * 30 * i / 3;
        p5.vertex(x, y + curve);
      }
      p5.endShape();
    }
    // Draw charges
    p5.noStroke();
    p5.fill(q1 < 0 ? '#1976d2' : '#e53935');
    p5.ellipse(charge1X, centerY, CHARGE_RADIUS * 2);
    p5.fill(255);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(q1 < 0 ? '-' : '+', charge1X, centerY);
    p5.fill(q2 < 0 ? '#1976d2' : '#e53935');
    p5.ellipse(charge2X, centerY, CHARGE_RADIUS * 2);
    p5.fill(255);
    p5.text(q2 < 0 ? '-' : '+', charge2X, centerY);
    // Draw labels
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.text(`q₁ = ${q1.toExponential(2)} C`, charge1X, centerY - 30);
    p5.text(`q₂ = ${q2.toExponential(2)} C`, charge2X, centerY - 30);
    // Draw distance line
    p5.stroke(100);
    p5.line(charge1X, centerY + 30, charge2X, centerY + 30);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.text(`d = ${Math.abs((charge2X - charge1X) / PX_PER_M).toFixed(2)} m`, (charge1X + charge2X) / 2, centerY + 40);
    // Draw force arrows
    const force = getForce(q1, q2, Math.abs((charge2X - charge1X) / PX_PER_M));
    const type = getForceDirection(q1, q2);
    const arrowColor = getArrowColor(type);
    const arrowLen = 50 + Math.min(force / 1e3, 100); // scale arrow length
    p5.stroke(arrowColor);
    p5.strokeWeight(4);
    if (type !== 'None') {
      // Arrow for charge 1
      let dir = type === 'Repulsive' ? -1 : 1;
      p5.line(charge1X, centerY, charge1X + dir * arrowLen, centerY);
      p5.fill(arrowColor);
      p5.noStroke();
      p5.triangle(
        charge1X + dir * arrowLen, centerY,
        charge1X + dir * (arrowLen - 10), centerY - 7,
        charge1X + dir * (arrowLen - 10), centerY + 7
      );
      // Arrow for charge 2
      dir = type === 'Repulsive' ? 1 : -1;
      p5.stroke(arrowColor);
      p5.line(charge2X, centerY, charge2X + dir * arrowLen, centerY);
      p5.fill(arrowColor);
      p5.noStroke();
      p5.triangle(
        charge2X + dir * arrowLen, centerY,
        charge2X + dir * (arrowLen - 10), centerY - 7,
        charge2X + dir * (arrowLen - 10), centerY + 7
      );
    }
    // Draw force value and type
    p5.noStroke();
    p5.fill(arrowColor);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.text(`F = ${force.toExponential(2)} N`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10);
    p5.text(type, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30);
    p5.strokeWeight(1);
  };

  // Sliders for q1, q2, distance
  return (
    <div className="simulation-container">
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          q₁ (C):
          <input type="range" min={MIN_Q} max={MAX_Q} step={1e-7} value={q1} onChange={e => setQ1(Number(e.target.value))} style={{ width: 120 }} />
          <span style={{ marginLeft: 8 }}>{q1.toExponential(2)}</span>
        </label>
        <label>
          q₂ (C):
          <input type="range" min={MIN_Q} max={MAX_Q} step={1e-7} value={q2} onChange={e => setQ2(Number(e.target.value))} style={{ width: 120 }} />
          <span style={{ marginLeft: 8 }}>{q2.toExponential(2)}</span>
        </label>
        <label>
          Distance (m):
          <input type="range" min={MIN_DIST} max={MAX_DIST} step={0.01} value={distance} onChange={e => setDistance(Number(e.target.value))} style={{ width: 120 }} />
          <span style={{ marginLeft: 8 }}>{distance.toFixed(2)}</span>
        </label>
        <button className="simulation-button" onClick={() => setAnimate(a => !a)}>
          {animate ? 'Reset Simulation' : 'Simulate Forces'}
        </button>
      </div>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
};

export default EnhancedElectricForceSimulation; 