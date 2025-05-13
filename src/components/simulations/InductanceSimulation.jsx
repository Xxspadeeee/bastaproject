import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const InductanceSimulation = ({ 
  inductance,
  currentChangeRate,
  coilLength,
  numTurns,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [current, setCurrent] = useState(0);
  const [magneticField, setMagneticField] = useState(0);
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setCurrent(0);
    setMagneticField(0);
  }, [inductance, currentChangeRate, coilLength, numTurns]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      // Animation timer
      animationTimer = setInterval(() => {
        setCurrent(prev => {
          // Current builds up to a maximum value and then decreases
          const maxCurrent = 10;
          let newCurrent;
          
          if (prev < maxCurrent) {
            newCurrent = prev + parseFloat(currentChangeRate) / 5;
            if (newCurrent > maxCurrent) return maxCurrent;
          } else {
            newCurrent = prev - parseFloat(currentChangeRate) / 5;
            if (newCurrent < 0) return 0;
          }
          
          // Update magnetic field strength based on current
          const fieldStrength = newCurrent * parseFloat(numTurns) / parseFloat(coilLength);
          setMagneticField(fieldStrength);
          
          return newCurrent;
        });
      }, 50);
    } else {
      setCurrent(0);
      setMagneticField(0);
    }
    
    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [animate, result, currentChangeRate, coilLength, numTurns]);
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    // Clear background
    p5.background(240);
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Draw inductor (solenoid)
    p5.push();
    p5.translate(centerX, centerY);
    
    // Draw inductor body
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.fill(240);
    const solenoidWidth = 200;
    const solenoidHeight = 80;
    p5.rect(-solenoidWidth/2, -solenoidHeight/2, solenoidWidth, solenoidHeight);
    
    // Draw coil turns
    p5.stroke(150, 75, 0);
    p5.strokeWeight(2);
    p5.noFill();
    
    const turnsToShow = Math.min(parseInt(numTurns), 20);
    const spacing = solenoidWidth / (turnsToShow + 1);
    
    for (let i = 1; i <= turnsToShow; i++) {
      const x = -solenoidWidth/2 + i * spacing;
      p5.ellipse(x, 0, solenoidHeight * 0.8, solenoidHeight * 1.2);
    }
    
    // Draw connecting wires
    p5.stroke(150, 75, 0);
    p5.strokeWeight(2);
    // Left wire
    p5.line(-solenoidWidth/2, 0, -solenoidWidth/2 - 50, 0);
    p5.line(-solenoidWidth/2 - 50, 0, -solenoidWidth/2 - 50, solenoidHeight);
    // Right wire
    p5.line(solenoidWidth/2, 0, solenoidWidth/2 + 50, 0);
    p5.line(solenoidWidth/2 + 50, 0, solenoidWidth/2 + 50, solenoidHeight);
    
    // Draw circuit elements
    // Battery
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.line(-solenoidWidth/2 - 50, solenoidHeight, -solenoidWidth/4, solenoidHeight);
    // Battery symbol
    p5.line(-solenoidWidth/4, solenoidHeight - 10, -solenoidWidth/4, solenoidHeight + 10);
    p5.line(-solenoidWidth/4 - 20, solenoidHeight - 5, -solenoidWidth/4 - 20, solenoidHeight + 5);
    p5.line(-solenoidWidth/4 - 20, solenoidHeight, -solenoidWidth/4, solenoidHeight);
    
    // Switch
    p5.line(-solenoidWidth/4, solenoidHeight, solenoidWidth/4, solenoidHeight);
    
    // If animating, show switch closed
    if (animate) {
      p5.line(solenoidWidth/4, solenoidHeight, solenoidWidth/2 + 50, solenoidHeight);
    } else {
      p5.line(solenoidWidth/4, solenoidHeight, solenoidWidth/4 + 30, solenoidHeight - 15);
    }
    
    // Switch label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.textSize(12);
    p5.text("Switch", solenoidWidth/4, solenoidHeight + 20);
    
    p5.pop();
    
    // Draw magnetic field inside solenoid when current is flowing
    if (animate && current > 0) {
      p5.push();
      p5.translate(centerX, centerY);
      
      // Color fill based on field strength
      const fieldOpacity = p5.map(magneticField, 0, 20, 20, 200);
      p5.fill(100, 100, 255, fieldOpacity);
      p5.noStroke();
      p5.rect(-solenoidWidth/2 + 10, -solenoidHeight/2 + 10, 
               solenoidWidth - 20, solenoidHeight - 20);
      
      // Draw field lines
      p5.stroke(0, 0, 200, fieldOpacity);
      p5.strokeWeight(1);
      
      const arrowSpacing = 20;
      const arrowSize = 5;
      const arrowDensity = p5.map(magneticField, 0, 20, 1, 3);
      
      for (let x = -solenoidWidth/2 + 20; x <= solenoidWidth/2 - 20; x += arrowSpacing) {
        for (let i = 0; i < arrowDensity; i++) {
          const y = p5.map(i, 0, arrowDensity - 1, -solenoidHeight/2 + 15, solenoidHeight/2 - 15);
          p5.line(x, y, x + arrowSpacing * 0.7, y);
          p5.line(x + arrowSpacing * 0.7, y, x + arrowSpacing * 0.7 - arrowSize, y - arrowSize);
          p5.line(x + arrowSpacing * 0.7, y, x + arrowSpacing * 0.7 - arrowSize, y + arrowSize);
        }
      }
      
      p5.pop();
      
      // Draw current flow arrows
      p5.stroke(255, 0, 0);
      p5.strokeWeight(2);
      p5.fill(255, 0, 0, 100);
      
      // Right side current indicator
      p5.push();
      p5.translate(centerX + 120, centerY + 80);
      p5.line(-15, 0, 15, 0);
      p5.triangle(15, 0, 5, -5, 5, 5);
      p5.pop();
      
      // Left side current indicator
      p5.push();
      p5.translate(centerX - 120, centerY + 80);
      p5.line(15, 0, -15, 0);
      p5.triangle(-15, 0, -5, -5, -5, 5);
      p5.pop();
      
      // Calculate and display EMF
      const inducedEMF = parseFloat(inductance) * parseFloat(currentChangeRate);
      
      // Draw information display
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(14);
      
      p5.text(`Current: ${current.toFixed(2)} A`, 20, 20);
      p5.text(`Rate of Current Change: ${currentChangeRate} A/s`, 20, 40);
      p5.text(`Inductance: ${inductance} H`, 20, 60);
      p5.text(`Magnetic Field: ${magneticField.toFixed(2)} T`, 20, 80);
      
      if (Math.abs(current - 10) < 9) { // If current is changing
        p5.text(`Self-induced EMF: ${inducedEMF.toFixed(2)} V`, 20, 110);
        
        // Draw formula
        p5.text("Self-Inductance: EMF = -L × (dI/dt)", 20, canvasHeight - 60);
        if (current < 10) {
          p5.text("Current increasing: EMF opposes the change", 20, canvasHeight - 40);
        } else {
          p5.text("Current decreasing: EMF sustains the current", 20, canvasHeight - 40);
        }
      }
    }
    
    // Draw inductor label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.textSize(16);
    p5.text(`Inductor (L = ${inductance} H)`, centerX, centerY - 60);
    p5.textSize(14);
    p5.text(`${numTurns} turns, ${coilLength} m length`, centerX, centerY - 40);
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!inductance || !currentChangeRate || !coilLength || !numTurns}
      >
        {animate ? "Reset Simulation" : "Simulate Inductance"}
      </button>
    </div>
  );
};

export default InductanceSimulation; 