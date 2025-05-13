import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const InducedVoltageSimulation = ({ 
  fluxChangeRate,
  loopArea,
  numLoops,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [fieldStrength, setFieldStrength] = useState(0);
  const [needleAngle, setNeedleAngle] = useState(0);
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setFieldStrength(0);
    setNeedleAngle(0);
  }, [fluxChangeRate, loopArea, numLoops]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      const initialField = 0;
      setFieldStrength(initialField);
      
      // Animation timer
      animationTimer = setInterval(() => {
        setFieldStrength(prev => {
          // Field oscillates between 0 and max value (based on flux change rate)
          const maxField = parseFloat(fluxChangeRate) * 5;
          const newField = prev + maxField / 50;
          
          if (newField > maxField) {
            return 0; // Reset to simulate pulses
          }
          
          // Update galvanometer needle position
          const emf = newField * parseFloat(loopArea) * parseFloat(numLoops);
          setNeedleAngle(Math.min(Math.PI/3, Math.max(-Math.PI/3, emf / 50)));
          
          return newField;
        });
      }, 50);
    } else {
      setFieldStrength(0);
      setNeedleAngle(0);
    }
    
    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [animate, result, fluxChangeRate, loopArea, numLoops]);
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    // Clear background
    p5.background(240);
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Draw magnetic field region
    p5.noStroke();
    p5.fill(100, 100, 255, 50 + fieldStrength * 10);
    p5.rect(centerX - 120, centerY - 120, 240, 240);
    
    // Draw field lines
    p5.stroke(0, 0, 200, 100 + fieldStrength * 30);
    p5.strokeWeight(1);
    
    const arrowSpacing = 30;
    const arrowSize = 5;
    
    for (let x = centerX - 100; x <= centerX + 100; x += arrowSpacing) {
      for (let y = centerY - 100; y <= centerY + 100; y += arrowSpacing) {
        p5.line(x, y, x, y + arrowSpacing * 0.7);
        p5.line(x, y + arrowSpacing * 0.7, x - arrowSize, y + arrowSpacing * 0.7 - arrowSize);
        p5.line(x, y + arrowSpacing * 0.7, x + arrowSize, y + arrowSpacing * 0.7 - arrowSize);
      }
    }
    
    // Draw conductor loop
    p5.stroke(150, 75, 0);
    p5.strokeWeight(3);
    p5.noFill();
    const loopSize = Math.sqrt(parseFloat(loopArea) * 10000); // Scale for visibility
    
    // Draw multiple loops based on numLoops
    const loopCount = Math.min(parseInt(numLoops) || 1, 8); // Limit to 8 for visibility
    for (let i = 0; i < loopCount; i++) {
      const offset = i * 3;
      p5.ellipse(centerX, centerY, loopSize + offset, loopSize + offset);
    }
    
    // Draw connecting wires to galvanometer
    p5.line(centerX + loopSize/2 + loopCount*3/2, centerY, 
            centerX + 160, centerY - 100);
    p5.line(centerX - loopSize/2 - loopCount*3/2, centerY, 
            centerX - 160, centerY - 100);
    
    // Draw galvanometer
    p5.fill(220);
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.rect(centerX - 70, centerY - 180, 140, 70, 5);
    
    // Draw galvanometer scale
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.textSize(12);
    p5.text("Galvanometer", centerX, centerY - 180 + 5);
    
    p5.stroke(0);
    p5.line(centerX - 50, centerY - 140, centerX + 50, centerY - 140);
    p5.noStroke();
    p5.textSize(8);
    p5.text("-", centerX - 50, centerY - 140 + 5);
    p5.text("0", centerX, centerY - 140 + 5);
    p5.text("+", centerX + 50, centerY - 140 + 5);
    
    // Draw needle
    p5.push();
    p5.translate(centerX, centerY - 140);
    p5.rotate(needleAngle);
    p5.stroke(255, 0, 0);
    p5.strokeWeight(2);
    p5.line(0, 0, 0, -30);
    p5.fill(255, 0, 0);
    p5.noStroke();
    p5.triangle(0, -30, -3, -25, 3, -25);
    p5.pop();
    
    // Draw field strength indicator
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.textSize(14);
    p5.text(`Magnetic Field Strength: ${fieldStrength.toFixed(2)} T`, 20, 20);
    p5.text(`Field Change Rate: ${fluxChangeRate} T/s`, 20, 40);
    p5.text(`Loop Area: ${loopArea} m²`, 20, 60);
    p5.text(`Number of Loops: ${numLoops}`, 20, 80);
    
    if (animate) {
      // Calculate induced EMF
      const emf = fieldStrength * parseFloat(loopArea) * parseFloat(numLoops);
      p5.fill(0);
      p5.text(`Induced EMF: ${emf.toFixed(2)} V`, 20, 110);
      
      // Draw formula
      p5.text("Faraday's Law: EMF = -N × (dΦ/dt)", 20, canvasHeight - 60);
      p5.text("where Φ = B × A is the magnetic flux", 20, canvasHeight - 40);
      
      // Show direction of induced current (Lenz's Law)
      if (fieldStrength > 0 && fieldStrength < parseFloat(fluxChangeRate) * 5 * 0.9) {
        // Field increasing
        p5.stroke(255, 0, 0);
        p5.strokeWeight(2);
        p5.fill(255, 0, 0, 100);
        
        // Draw arrows showing counter-clockwise current
        p5.push();
        p5.translate(centerX, centerY);
        p5.noFill();
        p5.arc(0, 0, loopSize + 20, loopSize + 20, -p5.PI/4, p5.PI + p5.PI/4);
        
        const arrowX = Math.cos(p5.PI + p5.PI/4) * (loopSize + 20) / 2;
        const arrowY = Math.sin(p5.PI + p5.PI/4) * (loopSize + 20) / 2;
        
        p5.line(arrowX, arrowY, arrowX + 10, arrowY - 10);
        p5.line(arrowX, arrowY, arrowX - 5, arrowY - 12);
        
        p5.noStroke();
        p5.fill(0);
        p5.textAlign(p5.CENTER, p5.BOTTOM);
        p5.text("Induced Current", 0, -loopSize/2 - 20);
        p5.pop();
      }
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!fluxChangeRate || !loopArea || !numLoops}
      >
        {animate ? "Reset Simulation" : "Simulate Induced Voltage"}
      </button>
    </div>
  );
};

export default InducedVoltageSimulation; 