import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const DirectCurrentSimulation = ({ 
  voltage,
  resistance,
  current,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [electrons, setElectrons] = useState([]);
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setElectrons([]);
  }, [voltage, resistance, current]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      // Initialize electrons for circuit visualization
      const initialElectrons = [];
      const numElectrons = 30;
      const pathPoints = createCircuitPath();
      
      for (let i = 0; i < numElectrons; i++) {
        initialElectrons.push({
          pathIndex: (i * pathPoints.length / numElectrons) % pathPoints.length,
          x: 0,
          y: 0,
          speed: parseFloat(current) / 5, // Speed based on current
        });
      }
      
      setElectrons(initialElectrons);
      
      // Animation timer
      animationTimer = setInterval(() => {
        setElectrons(prev => {
          return prev.map(electron => {
            const pathPoints = createCircuitPath();
            const newPathIndex = (electron.pathIndex + electron.speed) % pathPoints.length;
            const position = pathPoints[Math.floor(newPathIndex)];
            
            return {
              ...electron,
              pathIndex: newPathIndex,
              x: position.x,
              y: position.y
            };
          });
        });
      }, 50);
    } else {
      setElectrons([]);
    }
    
    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [animate, result, current]);
  
  // Create circuit path points
  const createCircuitPath = () => {
    const pathPoints = [];
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const circuitWidth = 300;
    const circuitHeight = 180;
    
    // Top wire
    for (let x = centerX - circuitWidth/2; x <= centerX + circuitWidth/2; x += 2) {
      pathPoints.push({ x, y: centerY - circuitHeight/2 });
    }
    
    // Right side (includes resistor)
    for (let y = centerY - circuitHeight/2; y <= centerY + circuitHeight/2; y += 2) {
      pathPoints.push({ x: centerX + circuitWidth/2, y });
    }
    
    // Bottom wire
    for (let x = centerX + circuitWidth/2; x >= centerX - circuitWidth/2; x -= 2) {
      pathPoints.push({ x, y: centerY + circuitHeight/2 });
    }
    
    // Left side (includes battery)
    for (let y = centerY + circuitHeight/2; y >= centerY - circuitHeight/2; y -= 2) {
      pathPoints.push({ x: centerX - circuitWidth/2, y });
    }
    
    return pathPoints;
  };
  
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    // Clear background
    p5.background(240);
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const circuitWidth = 300;
    const circuitHeight = 180;
    
    // Draw circuit diagram
    p5.stroke(0);
    p5.strokeWeight(2);
    
    // Top wire
    p5.line(centerX - circuitWidth/2, centerY - circuitHeight/2, 
            centerX + circuitWidth/2, centerY - circuitHeight/2);
    
    // Bottom wire
    p5.line(centerX - circuitWidth/2, centerY + circuitHeight/2, 
            centerX + circuitWidth/2, centerY + circuitHeight/2);
    
    // Battery (left side)
    // Negative terminal
    p5.line(centerX - circuitWidth/2, centerY - circuitHeight/4, 
            centerX - circuitWidth/2, centerY + circuitHeight/4);
    // Positive terminal
    p5.line(centerX - circuitWidth/2 - 10, centerY - circuitHeight/4 - 10, 
            centerX - circuitWidth/2 + 10, centerY - circuitHeight/4 - 10);
    p5.line(centerX - circuitWidth/2, centerY - circuitHeight/4 - 10, 
            centerX - circuitWidth/2, centerY - circuitHeight/2);
    p5.line(centerX - circuitWidth/2, centerY + circuitHeight/4, 
            centerX - circuitWidth/2, centerY + circuitHeight/2);
    
    // Battery label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.RIGHT, p5.CENTER);
    p5.textSize(14);
    p5.text(`${voltage}V`, centerX - circuitWidth/2 - 20, centerY);
    
    // Resistor (right side)
    p5.push();
    p5.translate(centerX + circuitWidth/2, centerY);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.noFill();
    
    // Draw zigzag resistor
    const resistorHeight = 80;
    const zigzagWidth = 15;
    const zigzags = 6;
    p5.line(0, -circuitHeight/2, 0, -resistorHeight/2);
    p5.line(0, resistorHeight/2, 0, circuitHeight/2);
    
    // Zigzag pattern
    p5.beginShape();
    p5.vertex(0, -resistorHeight/2);
    for (let i = 0; i < zigzags; i++) {
      p5.vertex(-zigzagWidth, -resistorHeight/2 + (i + 0.5) * resistorHeight/zigzags);
      p5.vertex(0, -resistorHeight/2 + (i + 1) * resistorHeight/zigzags);
    }
    p5.endShape();
    
    // Resistor label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.textSize(14);
    p5.text(`${resistance}Ω`, 20, 0);
    p5.pop();
    
    // Draw electrons if animated
    if (animate && electrons.length > 0) {
      p5.fill(0, 0, 255);
      p5.noStroke();
      
      electrons.forEach(electron => {
        p5.ellipse(electron.x, electron.y, 8, 8);
      });
      
      // Draw current direction arrow
      p5.stroke(255, 0, 0);
      p5.strokeWeight(2);
      p5.fill(255, 0, 0, 100);
      
      p5.push();
      p5.translate(centerX, centerY - circuitHeight/2 - 20);
      const arrowSize = 15;
      p5.line(-arrowSize*2, 0, arrowSize*2, 0);
      p5.triangle(arrowSize*2, 0, arrowSize, -arrowSize/2, arrowSize, arrowSize/2);
      p5.noStroke();
      p5.fill(255, 0, 0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.textSize(14);
      p5.text(`I = ${current}A`, 0, -5);
      p5.pop();
      
      // Add information display
      p5.fill(0);
      p5.noStroke();
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(14);
      
      // Ohm's Law
      p5.text("Ohm's Law: V = IR", 20, 20);
      p5.text(`Voltage: ${voltage}V`, 20, 50);
      p5.text(`Current: ${current}A`, 20, 70);
      p5.text(`Resistance: ${resistance}Ω`, 20, 90);
      
      // Power calculation
      const power = (parseFloat(voltage) * parseFloat(current)).toFixed(2);
      p5.text(`Power: P = VI = ${power}W`, 20, 120);
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!voltage || !resistance || !current}
      >
        {animate ? "Reset Simulation" : "Simulate Direct Current Circuit"}
      </button>
    </div>
  );
};

export default DirectCurrentSimulation; 