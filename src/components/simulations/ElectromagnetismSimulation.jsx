import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const ElectromagnetismSimulation = ({ 
  coilTurns, 
  magnetStrength, 
  area,
  movementSpeed,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [magnetPosition, setMagnetPosition] = useState(0);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setMagnetPosition(0);
    setCurrent(0);
    setDirection(1);
  }, [coilTurns, magnetStrength, area, movementSpeed]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      setMagnetPosition(-200);
      
      // Animation timer
      animationTimer = setInterval(() => {
        setMagnetPosition(prev => {
          const speed = parseFloat(movementSpeed) || 5;
          const newPos = prev + speed * direction;
          
          // Reverse direction at edges
          if (newPos > 200 || newPos < -200) {
            setDirection(d => -d);
            return prev;
          }
          
          // Current depends on magnet movement and field change
          // Maximum current when magnet crosses the coil center
          const distFromCenter = Math.abs(newPos);
          const currentMagnitude = distFromCenter < 100 
            ? (1 - distFromCenter/100) * parseFloat(magnetStrength) * parseFloat(coilTurns) / 20
            : 0;
            
          // Current direction depends on magnet movement direction and position
          const currentDir = newPos < 0 ? direction : -direction;
          setCurrent(currentMagnitude * currentDir);
          
          return newPos;
        });
      }, 50);
    } else {
      setMagnetPosition(0);
      setCurrent(0);
    }
    
    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [animate, result, direction, coilTurns, magnetStrength, movementSpeed]);
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    // Clear background
    p5.background(240);
    
    const center = canvasWidth / 2;
    const coilY = canvasHeight / 2;
    
    // Draw coil
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.noFill();
    
    // Draw multiple turns to represent the coil
    const coilWidth = 100;
    const coilHeight = 150;
    const turnsToShow = Math.min(10, Math.max(1, Math.floor(parseFloat(coilTurns)/10)));
    
    for (let i = 0; i < turnsToShow; i++) {
      const offset = i * 4;
      p5.rect(center - coilWidth/2 - offset, coilY - coilHeight/2 - offset, 
              coilWidth + offset*2, coilHeight + offset*2);
    }
    
    // Draw connecting wires
    p5.line(center - coilWidth/2 - turnsToShow*4, coilY + coilHeight/2 + turnsToShow*4, 
            center - coilWidth/2 - turnsToShow*4 - 50, coilY + coilHeight/2 + turnsToShow*4);
    p5.line(center + coilWidth/2 + turnsToShow*4, coilY + coilHeight/2 + turnsToShow*4, 
            center + coilWidth/2 + turnsToShow*4 + 50, coilY + coilHeight/2 + turnsToShow*4);
    
    // Draw ammeter
    p5.fill(200);
    p5.strokeWeight(1);
    p5.rect(center - 40, coilY + coilHeight/2 + turnsToShow*4 + 30, 80, 60, 5);
    
    // Draw ammeter needle
    p5.push();
    p5.translate(center, coilY + coilHeight/2 + turnsToShow*4 + 60);
    p5.rotate(p5.map(current, -1, 1, -p5.PI/4, p5.PI/4));
    p5.stroke(255, 0, 0);
    p5.strokeWeight(2);
    p5.line(0, 0, 0, -25);
    p5.pop();
    
    // Draw ammeter scale
    p5.stroke(0);
    p5.line(center - 30, coilY + coilHeight/2 + turnsToShow*4 + 60, 
            center + 30, coilY + coilHeight/2 + turnsToShow*4 + 60);
    p5.noStroke();
    p5.fill(0);
    p5.textSize(10);
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.text("-", center - 30, coilY + coilHeight/2 + turnsToShow*4 + 62);
    p5.text("+", center + 30, coilY + coilHeight/2 + turnsToShow*4 + 62);
    p5.text("Ammeter", center, coilY + coilHeight/2 + turnsToShow*4 + 80);
    
    // Draw magnet if animated
    if (animate) {
      // Draw bar magnet
      const magnetWidth = 40;
      const magnetHeight = 100;
      const magnetX = center + magnetPosition;
      
      // North pole (red)
      p5.fill(255, 0, 0);
      p5.rect(magnetX - magnetWidth/2, coilY - magnetHeight/2, magnetWidth, magnetHeight/2);
      p5.fill(255);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text("N", magnetX, coilY - magnetHeight/4);
      
      // South pole (blue)
      p5.fill(0, 0, 255);
      p5.rect(magnetX - magnetWidth/2, coilY, magnetWidth, magnetHeight/2);
      p5.fill(255);
      p5.text("S", magnetX, coilY + magnetHeight/4);
      
      // Draw magnetic field lines
      p5.stroke(0, 0, 255, 100);
      p5.strokeWeight(1);
      p5.noFill();
      
      // Draw field lines from N to S
      for (let offset = -magnetWidth/4; offset <= magnetWidth/4; offset += magnetWidth/4) {
        p5.beginShape();
        for (let x = -magnetWidth/2; x <= magnetWidth/2; x += 5) {
          const arcHeight = 30 + Math.abs(x * 1.5);
          p5.vertex(magnetX + x, coilY - magnetHeight/2 - arcHeight * Math.sin(p5.PI * (x + magnetWidth/2) / magnetWidth) + offset);
        }
        p5.endShape();
        
        p5.beginShape();
        for (let x = -magnetWidth/2; x <= magnetWidth/2; x += 5) {
          const arcHeight = 30 + Math.abs(x * 1.5);
          p5.vertex(magnetX + x, coilY + magnetHeight/2 + arcHeight * Math.sin(p5.PI * (x + magnetWidth/2) / magnetWidth) + offset);
        }
        p5.endShape();
      }
      
      // Draw direction of movement
      p5.stroke(0);
      p5.strokeWeight(2);
      const arrowX = magnetX;
      const arrowY = coilY - magnetHeight/2 - 20;
      const arrowDir = direction;
      p5.line(arrowX - 20 * arrowDir, arrowY, arrowX + 20 * arrowDir, arrowY);
      p5.line(arrowX + 20 * arrowDir, arrowY, arrowX + 20 * arrowDir - 10 * arrowDir, arrowY - 5);
      p5.line(arrowX + 20 * arrowDir, arrowY, arrowX + 20 * arrowDir - 10 * arrowDir, arrowY + 5);
      
      // Draw current in the coil
      if (Math.abs(current) > 0.1) {
        p5.stroke(255, 0, 0);
        p5.strokeWeight(2);
        
        // Draw current indicators on coil
        const indicatorCount = 8;
        const currentDir = current > 0 ? 1 : -1;
        
        for (let i = 0; i < indicatorCount; i++) {
          const angle = i * (2 * Math.PI / indicatorCount);
          const x = center + Math.cos(angle) * (coilWidth/2 + turnsToShow*2);
          const y = coilY + Math.sin(angle) * (coilHeight/2 + turnsToShow*2);
          
          p5.push();
          p5.translate(x, y);
          p5.rotate(angle + (currentDir > 0 ? 0 : Math.PI));
          
          const arrowSize = 10;
          p5.line(0, 0, arrowSize, 0);
          p5.line(arrowSize, 0, arrowSize - 3, -3);
          p5.line(arrowSize, 0, arrowSize - 3, 3);
          
          p5.pop();
        }
      }
      
      // Display information
      p5.fill(0);
      p5.noStroke();
      p5.textSize(14);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(`Magnet Strength: ${magnetStrength} T`, center, 20);
      p5.text(`Coil Turns: ${coilTurns}`, center, 40);
      
      if (result && result.value) {
        p5.text(`Induced EMF: ${Math.abs(current * 10).toFixed(2)} V`, center, 60);
        
        // Add explanation of Lenz's law
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textSize(12);
        p5.text("Lenz's Law: The induced current creates a magnetic field that", 20, canvasHeight - 60);
        p5.text("opposes the change in magnetic flux that produced it.", 20, canvasHeight - 40);
      }
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!coilTurns || !magnetStrength || !area || !movementSpeed}
      >
        {animate ? "Reset Simulation" : "Simulate Electromagnetic Induction"}
      </button>
    </div>
  );
};

export default ElectromagnetismSimulation; 