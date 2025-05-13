import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const CapacitanceSimulation = ({ capacitorType, plateArea, plateSeparation, innerRadius, outerRadius, dielectricConstant, result }) => {
  const [animate, setAnimate] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);
  const canvasWidth = 600;
  const canvasHeight = 300;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setChargeLevel(0);
  }, [capacitorType, plateArea, plateSeparation, innerRadius, outerRadius, dielectricConstant]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      // Animate charge buildup
      animationTimer = setInterval(() => {
        setChargeLevel(prev => {
          if (prev < 1) return prev + 0.05;
          clearInterval(animationTimer);
          return 1;
        });
      }, 50);
    } else {
      setChargeLevel(0);
    }
    
    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [animate, result]);
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    // Clear background
    p5.background(240);
    
    const center = canvasWidth / 2;
    const middleY = canvasHeight / 2;
    
    if (capacitorType === 'parallel') {
      // Draw parallel plate capacitor
      const plateWidth = Math.min(150, plateArea * 1000);
      const plateHeight = 100;
      const separation = Math.max(10, plateSeparation * 200);
      
      const plate1Y = middleY - separation / 2;
      const plate2Y = middleY + separation / 2;
      
      // Draw plates
      p5.fill(100);
      p5.rect(center - plateWidth / 2, plate1Y - 5, plateWidth, 10);
      p5.rect(center - plateWidth / 2, plate2Y - 5, plateWidth, 10);
      
      // Draw dielectric
      p5.fill(200, 230, 255, 100);
      p5.rect(center - plateWidth / 2, plate1Y + 5, plateWidth, separation - 10);
      
      // Draw charges if animated
      if (animate && chargeLevel > 0) {
        const chargeCount = Math.floor(chargeLevel * 10) + 1;
        const chargeSpacing = plateWidth / (chargeCount + 1);
        
        for (let i = 1; i <= chargeCount; i++) {
          const x = center - plateWidth / 2 + i * chargeSpacing;
          
          // Top plate charges (negative)
          p5.fill(0, 0, 255);
          p5.ellipse(x, plate1Y - 3, 8);
          p5.fill(255);
          p5.textSize(8);
          p5.textAlign(p5.CENTER, p5.CENTER);
          p5.text("-", x, plate1Y - 3);
          
          // Bottom plate charges (positive)
          p5.fill(255, 0, 0);
          p5.ellipse(x, plate2Y + 3, 8);
          p5.fill(255);
          p5.text("+", x, plate2Y + 3);
        }
        
        // Draw electric field lines
        p5.stroke(0, 0, 255, 150);
        const fieldLineCount = chargeCount;
        const fieldLineSpacing = plateWidth / (fieldLineCount + 1);
        
        for (let i = 1; i <= fieldLineCount; i++) {
          const x = center - plateWidth / 2 + i * fieldLineSpacing;
          p5.line(x, plate1Y + 5, x, plate2Y - 5);
          
          // Add arrow to indicate direction
          const arrowY = middleY;
          p5.line(x, arrowY, x - 3, arrowY - 3);
          p5.line(x, arrowY, x + 3, arrowY - 3);
        }
      }
      
      // Labels
      p5.fill(0);
      p5.noStroke();
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(`Plate area: ${plateArea} m²`, center, canvasHeight - 60);
      p5.text(`Separation: ${plateSeparation} m`, center, canvasHeight - 40);
      p5.text(`Dielectric constant: ${dielectricConstant || 1}`, center, canvasHeight - 20);
      
    } else if (capacitorType === 'spherical') {
      // Draw spherical capacitor
      const innerRad = Math.max(20, innerRadius * 100);
      const outerRad = Math.max(innerRad + 20, outerRadius * 100);
      
      // Outer sphere (transparent)
      p5.noFill();
      p5.stroke(0);
      p5.ellipse(center, middleY, outerRad * 2);
      
      // Inner sphere
      p5.noStroke();
      p5.fill(200);
      p5.ellipse(center, middleY, innerRad * 2);
      
      // Draw charges if animated
      if (animate && chargeLevel > 0) {
        // Draw charges on inner sphere (positive)
        const innerChargeCount = Math.floor(chargeLevel * 8) + 4;
        for (let i = 0; i < innerChargeCount; i++) {
          const angle = (i / innerChargeCount) * 2 * Math.PI;
          const x = center + innerRad * Math.cos(angle);
          const y = middleY + innerRad * Math.sin(angle);
          
          p5.fill(255, 0, 0);
          p5.ellipse(x, y, 8);
          p5.fill(255);
          p5.textSize(8);
          p5.textAlign(p5.CENTER, p5.CENTER);
          p5.text("+", x, y);
        }
        
        // Draw charges on outer sphere (negative)
        const outerChargeCount = innerChargeCount;
        for (let i = 0; i < outerChargeCount; i++) {
          const angle = (i / outerChargeCount) * 2 * Math.PI;
          const x = center + outerRad * Math.cos(angle);
          const y = middleY + outerRad * Math.sin(angle);
          
          p5.fill(0, 0, 255);
          p5.ellipse(x, y, 8);
          p5.fill(255);
          p5.textSize(8);
          p5.textAlign(p5.CENTER, p5.CENTER);
          p5.text("-", x, y);
        }
        
        // Draw radial electric field lines
        p5.stroke(0, 0, 255, 150);
        const fieldLineCount = 12;
        for (let i = 0; i < fieldLineCount; i++) {
          const angle = (i / fieldLineCount) * 2 * Math.PI;
          const x1 = center + innerRad * Math.cos(angle);
          const y1 = middleY + innerRad * Math.sin(angle);
          const x2 = center + outerRad * Math.cos(angle);
          const y2 = middleY + outerRad * Math.sin(angle);
          
          p5.line(x1, y1, x2, y2);
          
          // Add arrow to indicate direction
          const midX = center + (innerRad + (outerRad - innerRad) * 0.6) * Math.cos(angle);
          const midY = middleY + (innerRad + (outerRad - innerRad) * 0.6) * Math.sin(angle);
          const perpAngle = angle + Math.PI / 2;
          p5.line(midX, midY, 
                 midX + 5 * Math.cos(angle + Math.PI / 4), 
                 midY + 5 * Math.sin(angle + Math.PI / 4));
          p5.line(midX, midY, 
                 midX + 5 * Math.cos(angle - Math.PI / 4), 
                 midY + 5 * Math.sin(angle - Math.PI / 4));
        }
      }
      
      // Labels
      p5.fill(0);
      p5.noStroke();
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(`Inner radius: ${innerRadius} m`, center, canvasHeight - 60);
      p5.text(`Outer radius: ${outerRadius} m`, center, canvasHeight - 40);
      p5.text(`Dielectric constant: ${dielectricConstant || 1}`, center, canvasHeight - 20);
    }
    
    // Display capacitance if result is available
    if (result && !result.error && animate) {
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.textSize(16);
      p5.text(`Capacitance: ${result.value} ${result.unit}`, center, 20);
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!capacitorType || (capacitorType === 'parallel' && (!plateArea || !plateSeparation)) || 
                 (capacitorType === 'spherical' && (!innerRadius || !outerRadius))}
      >
        {animate ? "Reset Simulation" : "Simulate Capacitor"}
      </button>
    </div>
  );
};

export default CapacitanceSimulation; 