import { useState, useEffect } from 'react';
import Sketch from 'react-p5';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;
const CHARGE_RADIUS = 20;
const TEST_RADIUS = 10;
const K = 8.99e9;
const PX_PER_M = 80;
const MIN_DIST = 0.2;
const MAX_DIST = 4;
const MIN_Q = -5e-6;
const MAX_Q = 5e-6;

const getField = (q, r) => {
  if (r === 0) return 0;
  return K * Math.abs(q) / (r * r);
};

const getFieldDirection = (q) => (q > 0 ? 'Outward' : 'Inward');
const getArrowColor = (q) => (q > 0 ? '#e53935' : '#1976d2');
const getFieldLineColor = () => '#aaa';

const EnhancedElectricFieldSimulation = () => {
  const [q, setQ] = useState(2e-6);
  const [distance, setDistance] = useState(1.5);
  const [animate, setAnimate] = useState(false);
  const [testX, setTestX] = useState(CANVAS_WIDTH / 2 + 1.5 * PX_PER_M);

  useEffect(() => {
    setTestX(CANVAS_WIDTH / 2 + distance * PX_PER_M);
  }, [distance, animate === false]);

  useEffect(() => {
    if (!animate) return;
    let frame;
    const step = () => {
      const target = CANVAS_WIDTH / 2 + distance * PX_PER_M;
      setTestX((x) => {
        if (Math.abs(x - target) < 2) return target;
        return x + (target - x) * 0.15;
      });
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [animate, distance]);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(240);
    const centerY = CANVAS_HEIGHT / 2;
    const chargeX = CANVAS_WIDTH / 2;
    // Draw field lines
    for (let i = -3; i <= 3; i++) {
      let angle = (i * Math.PI) / 8;
      p5.stroke(getFieldLineColor());
      p5.noFill();
      p5.beginShape();
      for (let t = 0; t <= 1; t += 0.05) {
        let r = t * (testX - chargeX);
        let x = chargeX + r * Math.cos(angle);
        let y = centerY + r * Math.sin(angle) * 0.2;
        p5.vertex(x, y);
      }
      p5.endShape();
    }
    // Draw source charge
    p5.noStroke();
    p5.fill(q < 0 ? '#1976d2' : '#e53935');
    p5.ellipse(chargeX, centerY, CHARGE_RADIUS * 2);
    p5.fill(255);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(q < 0 ? '-' : '+', chargeX, centerY);
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.text(`q = ${q.toExponential(2)} C`, chargeX, centerY - 30);
    // Draw test point
    p5.fill('#333');
    p5.ellipse(testX, centerY, TEST_RADIUS * 2);
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.text(`r = ${Math.abs((testX - chargeX) / PX_PER_M).toFixed(2)} m`, testX, centerY + 15);
    // Draw field vector
    const field = getField(q, Math.abs((testX - chargeX) / PX_PER_M));
    const dir = getFieldDirection(q);
    const arrowColor = getArrowColor(q);
    const arrowLen = 40 + Math.min(field / 1e3, 80);
    p5.stroke(arrowColor);
    p5.strokeWeight(4);
    let sign = q > 0 ? 1 : -1;
    p5.line(testX, centerY, testX + sign * arrowLen, centerY);
    p5.fill(arrowColor);
    p5.noStroke();
    p5.triangle(
      testX + sign * arrowLen, centerY,
      testX + sign * (arrowLen - 10), centerY - 7,
      testX + sign * (arrowLen - 10), centerY + 7
    );
    // Draw field value and direction
    p5.noStroke();
    p5.fill(arrowColor);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.text(`E = ${field.toExponential(2)} N/C`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10);
    p5.text(dir, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30);
    p5.strokeWeight(1);
  };

  return (
    <div className="simulation-container">
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Source Charge (C):
          <input type="range" min={MIN_Q} max={MAX_Q} step={1e-7} value={q} onChange={e => setQ(Number(e.target.value))} style={{ width: 120 }} />
          <span style={{ marginLeft: 8 }}>{q.toExponential(2)}</span>
        </label>
        <label>
          Distance (m):
          <input type="range" min={MIN_DIST} max={MAX_DIST} step={0.01} value={distance} onChange={e => setDistance(Number(e.target.value))} style={{ width: 120 }} />
          <span style={{ marginLeft: 8 }}>{distance.toFixed(2)}</span>
        </label>
        <button className="simulation-button" onClick={() => setAnimate(a => !a)}>
          {animate ? 'Reset' : 'Show Field'}
        </button>
      </div>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
};

export default EnhancedElectricFieldSimulation; 