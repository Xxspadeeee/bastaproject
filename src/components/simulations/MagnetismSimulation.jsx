import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const MagnetismSimulation = ({ 
  currentStrength, 
  wireLength, 
  magneticField,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [particles, setParticles] = useState([]);
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setParticles([]);
  }, [currentStrength, wireLength, magneticField]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      // Initialize particles for magnetic field visualization
      const initialParticles = [];
      const numParticles = 50;
      
      for (let i = 0; i < numParticles; i++) {
        initialParticles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          vx: 0,
          vy: 0,
          angle: 0
        });
      }
      
      setParticles(initialParticles);
      
      // Animation timer
      animationTimer = setInterval(() => {
        setParticles(prev => {
          return prev.map(particle => {
            // Calculate new position based on field lines
            const newX = particle.x + particle.vx;
            const newY = particle.y + particle.vy;
            
            // Wrap around the canvas
            const wrappedX = newX < 0 ? canvasWidth : (newX > canvasWidth ? 0 : newX);
            const wrappedY = newY < 0 ? canvasHeight : (newY > canvasHeight ? 0 : newY);
            
            return {
              x: wrappedX,
              y: wrappedY,
              vx: particle.vx,
              vy: particle.vy,
              angle: particle.angle
            };
          });
        });
      }, 50);
    } else {
      setParticles([]);
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
    const wireY = canvasHeight / 2;
    
    // Draw wire
    p5.stroke(0);
    p5.strokeWeight(4);
    p5.line(center - 150, wireY, center + 150, wireY);
    
    // Draw current direction
    if (parseFloat(currentStrength) !== 0) {
      p5.fill(0);
      p5.noStroke();
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.textSize(16);
      const direction = parseFloat(currentStrength) > 0 ? "→" : "←";
      p5.text(`Current: ${Math.abs(currentStrength)} A ${direction}`, center, wireY - 20);
      
      // Current arrow
      p5.strokeWeight(2);
      p5.stroke(0);
      const arrowLength = 30;
      const arrowDir = parseFloat(currentStrength) > 0 ? 1 : -1;
      p5.line(center, wireY - 10, center + arrowLength * arrowDir, wireY - 10);
      p5.line(center + arrowLength * arrowDir, wireY - 10, 
              center + arrowLength * arrowDir - 5 * arrowDir, wireY - 10 - 5);
      p5.line(center + arrowLength * arrowDir, wireY - 10, 
              center + arrowLength * arrowDir - 5 * arrowDir, wireY - 10 + 5);
    }
    
    // Draw magnetic field if animated
    if (animate && result && !result.error) {
      // Update particle directions based on right-hand rule
      setParticles(prev => {
        return prev.map(particle => {
          // Calculate distance from wire
          const dx = particle.x - center;
          const dy = particle.y - wireY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate angle for circular field
          const angle = Math.atan2(dy, dx) + (parseFloat(currentStrength) > 0 ? -Math.PI/2 : Math.PI/2);
          
          // Velocity based on angle and field strength (inverse with distance)
          const speed = Math.min(1.5, 5 / Math.max(10, distance)) * Math.abs(parseFloat(currentStrength)) / 5;
          
          return {
            ...particle,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            angle
          };
        });
      });
      
      // Draw magnetic field lines (concentric circles)
      p5.noFill();
      p5.stroke(0, 0, 255, 100);
      p5.strokeWeight(1);
      
      for (let radius = 20; radius < 200; radius += 20) {
        p5.ellipse(center, wireY, radius * 2);
      }
      
      // Draw the particles as small magnetic field indicators
      p5.fill(0, 0, 255);
      p5.noStroke();
      
      particles.forEach(particle => {
        p5.push();
        p5.translate(particle.x, particle.y);
        p5.rotate(particle.angle);
        
        // Draw arrow to indicate field direction
        p5.beginShape();
        p5.vertex(0, 0);
        p5.vertex(-8, -3);
        p5.vertex(-6, 0);
        p5.vertex(-8, 3);
        p5.endShape(p5.CLOSE);
        
        p5.pop();
      });
      
      // Draw force and field information
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.textSize(14);
      p5.text(`Magnetic Field: ${parseFloat(magneticField)} T`, center, 20);
      
      if (result && result.value) {
        p5.text(`Force: ${result.value} ${result.unit}`, center, 50);
        
        // Illustrate the right-hand rule
        const handX = center + 180;
        const handY = wireY - 50;
        
        // Draw thumb (current direction)
        p5.stroke(255, 0, 0);
        p5.strokeWeight(3);
        p5.line(handX, handY, handX + 20 * arrowDir, handY);
        p5.line(handX + 20 * arrowDir, handY, handX + 20 * arrowDir - 5 * arrowDir, handY - 5);
        p5.line(handX + 20 * arrowDir, handY, handX + 20 * arrowDir - 5 * arrowDir, handY + 5);
        
        // Draw fingers (magnetic field)
        p5.stroke(0, 0, 255);
        p5.noFill();
        p5.arc(handX, handY, 30, 30, 0, Math.PI);
        p5.line(handX - 15, handY, handX - 15, handY - 5);
        p5.line(handX - 15, handY, handX - 10, handY);
        
        // Draw palm (force direction out of page or into page)
        p5.fill(0, 150, 0);
        p5.noStroke();
        p5.ellipse(handX, handY - 15, 15);
        
        // Draw × or · to indicate direction
        p5.fill(255);
        p5.textSize(16);
        p5.textAlign(p5.CENTER, p5.CENTER);
        const forceSymbol = parseFloat(currentStrength) > 0 ? "×" : "•";
        p5.text(forceSymbol, handX, handY - 15);
        
        // Add legend
        p5.textSize(12);
        p5.fill(255, 0, 0);
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text("Current", handX + 30, handY);
        p5.fill(0, 0, 255);
        p5.text("Magnetic Field", handX + 30, handY + 15);
        p5.fill(0, 150, 0);
        p5.text("Force (× out of page, • into page)", handX + 30, handY + 30);
      }
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!currentStrength || !wireLength || !magneticField}
      >
        {animate ? "Reset Simulation" : "Simulate Magnetic Field"}
      </button>
    </div>
  );
};

export default MagnetismSimulation; 