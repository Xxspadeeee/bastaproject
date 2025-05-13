import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const ResistanceSimulation = ({ 
  resistanceType, 
  voltage, 
  current, 
  resistivity,
  wireLength,
  wireArea,
  powerDissipated,
  currentForPower,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [electronPosition, setElectronPosition] = useState([]);
  const canvasWidth = 600;
  const canvasHeight = 300;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setElectronPosition([]);
  }, [resistanceType, voltage, current, resistivity, wireLength, wireArea, powerDissipated, currentForPower]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      // Initialize electron positions
      const numElectrons = 20;
      const initialPositions = [];
      for (let i = 0; i < numElectrons; i++) {
        initialPositions.push([
          Math.random() * (canvasWidth - 200) + 100,
          Math.random() * (canvasHeight - 150) + 75
        ]);
      }
      setElectronPosition(initialPositions);
      
      // Animation timer
      animationTimer = setInterval(() => {
        setElectronPosition(prev => {
          return prev.map(([x, y]) => {
            // Speed depends on the current value - higher current = faster electrons
            const speed = resistanceType === 'ohm' 
              ? parseFloat(current) * 2
              : resistanceType === 'resistivity' 
                ? 5 / parseFloat(result.value) // Inversely proportional to resistance
                : parseFloat(currentForPower) * 2;
            
            let newX = x + speed;
            if (newX > canvasWidth - 100) {
              newX = 100;
            }
            return [newX, y];
          });
        });
      }, 50);
    } else {
      setElectronPosition([]);
    }
    
    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [animate, result, resistanceType, current, currentForPower]);
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    // Clear background
    p5.background(240);
    
    // Base coordinates for the circuit
    const circuitX = 100;
    const circuitWidth = canvasWidth - 200;
    const circuitY = canvasHeight / 2;
    
    // Draw battery/source
    p5.fill(220);
    p5.stroke(0);
    p5.rect(circuitX - 30, circuitY - 30, 30, 60);
    // Battery terminals
    p5.line(circuitX - 40, circuitY - 15, circuitX - 30, circuitY - 15);
    p5.line(circuitX - 45, circuitY + 15, circuitX - 30, circuitY + 15);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(10);
    p5.noStroke();
    p5.fill(0);
    p5.text("+", circuitX - 15, circuitY - 15);
    p5.text("-", circuitX - 15, circuitY + 15);
    
    // Draw circuit wires
    p5.stroke(0);
    p5.line(circuitX, circuitY - 15, circuitX + 50, circuitY - 15);
    p5.line(circuitX, circuitY + 15, circuitX + 50, circuitY + 15);
    p5.line(circuitX + circuitWidth - 50, circuitY - 15, circuitX + circuitWidth, circuitY - 15);
    p5.line(circuitX + circuitWidth - 50, circuitY + 15, circuitX + circuitWidth, circuitY + 15);
    p5.line(circuitX + circuitWidth, circuitY - 15, circuitX + circuitWidth, circuitY + 15);
    
    // Draw resistor
    const resistorX = circuitX + 50;
    const resistorWidth = circuitWidth - 100;
    
    // Different resistor display based on the calculation type
    if (resistanceType === 'ohm') {
      // Zigzag resistor symbol
      p5.stroke(0);
      p5.beginShape();
      p5.vertex(resistorX, circuitY - 15);
      const zigzagWidth = 20;
      const zigzagCount = 10;
      for (let i = 0; i < zigzagCount; i++) {
        p5.vertex(resistorX + i * zigzagWidth + zigzagWidth/2, i % 2 === 0 ? circuitY - 30 : circuitY);
      }
      p5.vertex(resistorX + resistorWidth, circuitY - 15);
      p5.endShape();
      
      p5.beginShape();
      p5.vertex(resistorX, circuitY + 15);
      for (let i = 0; i < zigzagCount; i++) {
        p5.vertex(resistorX + i * zigzagWidth + zigzagWidth/2, i % 2 === 0 ? circuitY + 30 : circuitY);
      }
      p5.vertex(resistorX + resistorWidth, circuitY + 15);
      p5.endShape();
      
      // Add voltage and current labels
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.textSize(14);
      p5.text(`V = ${voltage} V`, canvasWidth / 2, circuitY - 40);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(`I = ${current} A`, canvasWidth / 2, circuitY + 40);
      
    } else if (resistanceType === 'resistivity') {
      // Draw a wire with specific length and area
      p5.stroke(0);
      p5.fill(100);
      
      // Calculate height based on cross-sectional area
      const wireHeight = Math.min(30, Math.sqrt(parseFloat(wireArea)) * 100);
      
      // Draw the wire with scaled dimensions
      p5.rect(resistorX, circuitY - wireHeight / 2, resistorWidth, wireHeight);
      
      // Add resistivity, length, and area labels
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.textSize(14);
      p5.text(`ρ = ${resistivity} Ω·m`, canvasWidth / 2, circuitY - wireHeight / 2 - 10);
      p5.textAlign(p5.LEFT, p5.CENTER);
      p5.text(`L = ${wireLength} m`, resistorX + 10, circuitY);
      p5.textAlign(p5.RIGHT, p5.TOP);
      p5.text(`A = ${wireArea} m²`, resistorX + resistorWidth - 10, circuitY + wireHeight / 2 + 10);
      
    } else if (resistanceType === 'power') {
      // Draw a heating resistor
      p5.stroke(0);
      p5.fill(100);
      p5.rect(resistorX, circuitY - 20, resistorWidth, 40);
      
      // Add heat waves if animated
      if (animate) {
        const waveCount = 5;
        const waveSpacing = resistorWidth / (waveCount + 1);
        p5.stroke(255, 0, 0, 150);
        p5.strokeWeight(2);
        
        for (let i = 1; i <= waveCount; i++) {
          const x = resistorX + i * waveSpacing;
          const waveHeight = 15 + 5 * Math.sin(p5.frameCount * 0.1 + i);
          
          // Draw heat wave
          p5.noFill();
          p5.beginShape();
          for (let j = 0; j < 10; j++) {
            p5.vertex(
              x + j * 2 - 10, 
              circuitY - 20 - waveHeight + 4 * Math.sin(j * 0.5 + p5.frameCount * 0.1)
            );
          }
          p5.endShape();
        }
        p5.strokeWeight(1);
      }
      
      // Add power and current labels
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.textSize(14);
      p5.text(`P = ${powerDissipated} W`, canvasWidth / 2, circuitY - 30);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(`I = ${currentForPower} A`, canvasWidth / 2, circuitY + 30);
    }
    
    // Draw electrons if animated
    if (animate && electronPosition.length > 0) {
      p5.fill(0, 0, 255);
      p5.noStroke();
      
      electronPosition.forEach(([x, y]) => {
        p5.ellipse(x, y, 8);
        p5.fill(255);
        p5.textSize(8);
        p5.text("-", x, y);
        p5.fill(0, 0, 255);
      });
    }
    
    // Display resistance if result is available
    if (result && !result.error && animate) {
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.textSize(16);
      p5.text(`Resistance: ${result.value} ${result.unit}`, canvasWidth / 2, 20);
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={
          !resistanceType || 
          (resistanceType === 'ohm' && (!voltage || !current)) ||
          (resistanceType === 'resistivity' && (!resistivity || !wireLength || !wireArea)) ||
          (resistanceType === 'power' && (!powerDissipated || !currentForPower))
        }
      >
        {animate ? "Reset Simulation" : "Simulate Circuit"}
      </button>
    </div>
  );
};

export default ResistanceSimulation; 