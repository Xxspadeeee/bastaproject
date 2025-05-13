import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const ACCircuitSimulation = ({ 
  voltage,
  frequency,
  resistance,
  inductance,
  capacitance,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [time, setTime] = useState(0);
  const [currentAmplitude, setCurrentAmplitude] = useState(0);
  const [phaseDifference, setPhaseDifference] = useState(0);
  const canvasWidth = 700;
  const canvasHeight = 500;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setTime(0);
    
    // Calculate values for the circuit
    if (result && !result.error) {
      const R = parseFloat(resistance) || 0.001;
      const L = parseFloat(inductance) || 0.001;
      const C = parseFloat(capacitance) || 0.001;
      const V = parseFloat(voltage);
      const f = parseFloat(frequency);
      const omega = 2 * Math.PI * f;
      
      // Reactances
      const XL = omega * L;
      const XC = 1 / (omega * C);
      
      // Impedance
      const Z = Math.sqrt(R*R + Math.pow(XL - XC, 2));
      
      // Current amplitude
      setCurrentAmplitude(V / Z);
      
      // Phase difference (voltage leads current)
      setPhaseDifference(Math.atan2(XL - XC, R));
    }
  }, [voltage, frequency, resistance, inductance, capacitance, result]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      // Animation timer
      animationTimer = setInterval(() => {
        setTime(prev => {
          const f = parseFloat(frequency);
          const increment = 1 / (f * 10); // 10 frames per cycle
          return prev + increment;
        });
      }, 50);
    } else {
      setTime(0);
    }
    
    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [animate, result, frequency]);
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    // Clear background
    p5.background(240);
    
    // Draw circuit diagram
    drawCircuit(p5);
    
    // Draw waveform graphs if animating
    if (animate) {
      drawWaveforms(p5);
    }
  };
  
  const drawCircuit = (p5) => {
    const centerX = canvasWidth / 2;
    const centerY = 150;
    const circuitWidth = 300;
    const circuitHeight = 180;
    
    // Draw circuit wires
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.noFill();
    
    // Top wire
    p5.line(centerX - circuitWidth/2, centerY - circuitHeight/2, 
            centerX - circuitWidth/6, centerY - circuitHeight/2);
    p5.line(centerX + circuitWidth/6, centerY - circuitHeight/2, 
            centerX + circuitWidth/2, centerY - circuitHeight/2);
    
    // Bottom wire
    p5.line(centerX - circuitWidth/2, centerY + circuitHeight/2, 
            centerX + circuitWidth/2, centerY + circuitHeight/2);
    
    // Left vertical wire
    p5.line(centerX - circuitWidth/2, centerY - circuitHeight/2, 
            centerX - circuitWidth/2, centerY + circuitHeight/2);
    
    // Right vertical wire
    p5.line(centerX + circuitWidth/2, centerY - circuitHeight/2, 
            centerX + circuitWidth/2, centerY + circuitHeight/2);
    
    // Draw AC source (sine wave symbol)
    p5.push();
    p5.translate(centerX, centerY - circuitHeight/2);
    p5.noFill();
    p5.beginShape();
    for (let x = -circuitWidth/6; x <= circuitWidth/6; x += 2) {
      const y = Math.sin(x * 0.1) * 10;
      p5.vertex(x, y);
    }
    p5.endShape();
    
    // Draw AC source label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.textSize(12);
    p5.text(`V = ${voltage} V`, 0, -15);
    p5.text(`f = ${frequency} Hz`, 0, -30);
    p5.pop();
    
    // Draw series elements (R, L, C)
    // Resistor
    p5.push();
    p5.translate(centerX - circuitWidth/4, centerY + circuitHeight/4);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.line(0, -circuitHeight/4, 0, -20);
    p5.line(0, 20, 0, circuitHeight/4);
    
    // Draw zigzag resistor
    p5.beginShape();
    p5.vertex(0, -20);
    p5.vertex(-10, -15);
    p5.vertex(10, -5);
    p5.vertex(-10, 5);
    p5.vertex(10, 15);
    p5.vertex(0, 20);
    p5.endShape();
    
    // Draw resistor label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.textSize(12);
    p5.text(`R = ${resistance} Ω`, 0, -25);
    p5.pop();
    
    // Inductor
    p5.push();
    p5.translate(centerX, centerY + circuitHeight/4);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.line(0, -circuitHeight/4, 0, -20);
    p5.line(0, 20, 0, circuitHeight/4);
    
    // Draw inductor coil
    p5.noFill();
    const coilRadius = 10;
    for (let i = 0; i < 4; i++) {
      p5.arc(-coilRadius/2 + i*coilRadius/2, 0, coilRadius, 20, -p5.PI, 0);
    }
    
    // Draw inductor label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.textSize(12);
    p5.text(`L = ${inductance} H`, 0, -25);
    p5.pop();
    
    // Capacitor
    p5.push();
    p5.translate(centerX + circuitWidth/4, centerY + circuitHeight/4);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.line(0, -circuitHeight/4, 0, -15);
    p5.line(0, 15, 0, circuitHeight/4);
    
    // Draw capacitor plates
    p5.line(-10, -15, 10, -15);
    p5.line(-10, 15, 10, 15);
    
    // Draw capacitor label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.textSize(12);
    p5.text(`C = ${capacitance} F`, 0, -25);
    p5.pop();
    
    // Draw circuit elements if animating
    if (animate) {
      const f = parseFloat(frequency);
      const omega = 2 * Math.PI * f;
      const period = 1 / f;
      
      // Show current flow with moving dots
      p5.fill(0, 0, 255);
      p5.noStroke();
      
      const numDots = 20;
      const circuitPathLength = 2 * circuitWidth + 2 * circuitHeight;
      
      for (let i = 0; i < numDots; i++) {
        // Determine if this dot should be visible based on current
        const dotPhase = (i / numDots) * 2 * Math.PI;
        const currentValue = currentAmplitude * Math.sin(omega * time - phaseDifference + dotPhase);
        if (Math.abs(currentValue) < currentAmplitude * 0.3) continue; // Only show when current is strong enough
        
        // Calculate dot position on the circuit
        const pathPosition = (time * circuitPathLength / period + i * circuitPathLength / numDots) % circuitPathLength;
        let x, y;
        
        if (pathPosition < circuitWidth) {
          // Top wire
          x = centerX - circuitWidth/2 + pathPosition;
          y = centerY - circuitHeight/2;
        } else if (pathPosition < circuitWidth + circuitHeight) {
          // Right wire
          x = centerX + circuitWidth/2;
          y = centerY - circuitHeight/2 + (pathPosition - circuitWidth);
        } else if (pathPosition < 2 * circuitWidth + circuitHeight) {
          // Bottom wire
          x = centerX + circuitWidth/2 - (pathPosition - circuitWidth - circuitHeight);
          y = centerY + circuitHeight/2;
        } else {
          // Left wire
          x = centerX - circuitWidth/2;
          y = centerY + circuitHeight/2 - (pathPosition - 2 * circuitWidth - circuitHeight);
        }
        
        // Dot size proportional to current
        const dotSize = 6 * Math.abs(currentValue) / currentAmplitude;
        p5.ellipse(x, y, dotSize, dotSize);
      }
    }
  };
  
  const drawWaveforms = (p5) => {
    const graphY = 350;
    const graphHeight = 100;
    const graphWidth = 600;
    
    // Draw graph area
    p5.fill(250);
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.rect(50, graphY - graphHeight, graphWidth, graphHeight);
    
    // Draw x and y axes
    p5.line(50, graphY - graphHeight/2, 50 + graphWidth, graphY - graphHeight/2); // x-axis
    p5.line(50, graphY - graphHeight, 50, graphY); // y-axis
    
    // Calculate values
    const f = parseFloat(frequency);
    const omega = 2 * Math.PI * f;
    const period = 1 / f;
    
    // For clearer visualization, show 2 complete cycles
    const cyclesShown = 2;
    const timeWindow = cyclesShown * period;
    
    // Draw grid lines for cycles
    p5.stroke(200);
    p5.strokeWeight(1);
    for (let i = 0; i <= cyclesShown; i++) {
      const x = 50 + (i * period / timeWindow) * graphWidth;
      p5.line(x, graphY - graphHeight, x, graphY);
    }
    
    // Draw voltage waveform
    p5.stroke(255, 0, 0);
    p5.strokeWeight(2);
    p5.noFill();
    p5.beginShape();
    const V = parseFloat(voltage);
    
    for (let i = 0; i < graphWidth; i++) {
      const t = time + (i / graphWidth) * timeWindow;
      const v = V * Math.sin(omega * t);
      const x = 50 + i;
      const y = graphY - graphHeight/2 - v * graphHeight/2 / V;
      p5.vertex(x, y);
    }
    p5.endShape();
    
    // Draw current waveform
    p5.stroke(0, 0, 255);
    p5.strokeWeight(2);
    p5.noFill();
    p5.beginShape();
    
    for (let i = 0; i < graphWidth; i++) {
      const t = time + (i / graphWidth) * timeWindow;
      const I = currentAmplitude * Math.sin(omega * t - phaseDifference);
      const x = 50 + i;
      const y = graphY - graphHeight/2 - I * graphHeight/2 / currentAmplitude;
      p5.vertex(x, y);
    }
    p5.endShape();
    
    // Draw labels
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.textSize(14);
    p5.text("Voltage and Current Waveforms", canvasWidth/2, graphY + 10);
    
    // Legend
    p5.fill(255, 0, 0);
    p5.rect(canvasWidth/2 - 100, graphY + 30, 10, 10);
    p5.fill(0);
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.text("Voltage", canvasWidth/2 - 85, graphY + 35);
    
    p5.fill(0, 0, 255);
    p5.rect(canvasWidth/2 + 20, graphY + 30, 10, 10);
    p5.fill(0);
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.text("Current", canvasWidth/2 + 35, graphY + 35);
    
    // Display circuit values
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.textSize(12);
    
    // Calculate impedance and other values
    const R = parseFloat(resistance);
    const L = parseFloat(inductance);
    const C = parseFloat(capacitance);
    
    const XL = omega * L;
    const XC = 1 / (omega * C);
    const Z = Math.sqrt(R*R + Math.pow(XL - XC, 2));
    
    // Power calculations
    const apparentPower = V * currentAmplitude;
    const realPower = apparentPower * Math.cos(phaseDifference);
    const reactivePower = apparentPower * Math.sin(phaseDifference);
    const powerFactor = Math.cos(phaseDifference);
    
    p5.text(`Impedance (Z): ${Z.toFixed(2)} Ω`, 50, graphY + 20);
    p5.text(`Current Amplitude: ${currentAmplitude.toFixed(2)} A`, 50, graphY + 35);
    p5.text(`Phase Difference: ${(phaseDifference * 180 / Math.PI).toFixed(2)}°`, 50, graphY + 50);
    p5.text(`Power Factor: ${powerFactor.toFixed(2)}`, 50, graphY + 65);
    
    p5.text(`Real Power: ${realPower.toFixed(2)} W`, 50, graphY + 80);
    p5.text(`Reactive Power: ${reactivePower.toFixed(2)} VAR`, 50, graphY + 95);
    p5.text(`Apparent Power: ${apparentPower.toFixed(2)} VA`, 50, graphY + 110);
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!voltage || !frequency || !resistance || !inductance || !capacitance}
      >
        {animate ? "Reset Simulation" : "Simulate AC Circuit"}
      </button>
    </div>
  );
};

export default ACCircuitSimulation; 