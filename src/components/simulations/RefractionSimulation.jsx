import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const RefractionSimulation = ({ 
  incidentAngle, 
  refractiveIndex1,
  refractiveIndex2,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [rayPosition, setRayPosition] = useState(0);
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setRayPosition(0);
  }, [incidentAngle, refractiveIndex1, refractiveIndex2]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      setRayPosition(-canvasWidth / 2);
      
      // Animation timer
      animationTimer = setInterval(() => {
        setRayPosition(prev => {
          if (prev < canvasWidth) {
            return prev + 10;
          }
          return -canvasWidth / 2;
        });
      }, 50);
    } else {
      setRayPosition(0);
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
    const interfaceY = canvasHeight / 2;
    
    // Draw media interface
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.line(0, interfaceY, canvasWidth, interfaceY);
    
    // Draw medium labels
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.textSize(14);
    p5.text(`Medium 1: n = ${refractiveIndex1}`, 20, interfaceY - 30);
    p5.text(`Medium 2: n = ${refractiveIndex2}`, 20, interfaceY + 30);
    
    // Color the media
    p5.noStroke();
    p5.fill(200, 230, 255, 50);
    p5.rect(0, 0, canvasWidth, interfaceY);
    p5.fill(255, 255, 200, 50);
    p5.rect(0, interfaceY, canvasWidth, canvasHeight - interfaceY);
    
    // Draw normal line
    p5.stroke(0, 0, 0, 100);
    p5.strokeWeight(1);
    p5.line(center, 0, center, canvasHeight);
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.text("Normal", center, interfaceY + 5);
    
    // Calculate angles in radians
    const incidentAngleRad = parseFloat(incidentAngle) * Math.PI / 180;
    const refractedAngleRad = result && !result.error 
      ? parseFloat(result.value) * Math.PI / 180 
      : 0;
    
    // Draw rays when animated
    if (animate) {
      // Draw incident ray
      p5.stroke(255, 0, 0);
      p5.strokeWeight(3);
      
      const rayStartX = center - Math.tan(incidentAngleRad) * interfaceY;
      const rayLength = interfaceY / Math.cos(incidentAngleRad);
      
      // Animate the incident ray
      if (rayPosition < 0) {
        const progress = Math.min(1, (rayPosition + canvasWidth/2) / canvasWidth);
        const currentRayLength = progress * rayLength;
        
        p5.line(
          center - Math.tan(incidentAngleRad) * interfaceY,
          0,
          center - Math.tan(incidentAngleRad) * (interfaceY - currentRayLength * Math.cos(incidentAngleRad)),
          currentRayLength * Math.sin(incidentAngleRad)
        );
      } else {
        // Draw complete incident ray
        p5.line(
          center - Math.tan(incidentAngleRad) * interfaceY,
          0,
          center,
          interfaceY
        );
        
        // Draw refracted ray
        if (!isNaN(refractedAngleRad)) {
          p5.stroke(0, 255, 0);
          
          const refractedRayLength = (canvasHeight - interfaceY) / Math.cos(refractedAngleRad);
          const animationProgress = Math.min(1, (rayPosition) / canvasWidth);
          const currentRefractedLength = animationProgress * refractedRayLength;
          
          p5.line(
            center,
            interfaceY,
            center + currentRefractedLength * Math.sin(refractedAngleRad),
            interfaceY + currentRefractedLength * Math.cos(refractedAngleRad)
          );
        }
        
        // Draw reflected ray
        p5.stroke(255, 165, 0);
        
        const reflectedAngleRad = incidentAngleRad;
        const reflectedRayLength = interfaceY / Math.cos(reflectedAngleRad);
        const animationProgress = Math.min(1, (rayPosition) / canvasWidth);
        const currentReflectedLength = animationProgress * reflectedRayLength;
        
        p5.line(
          center,
          interfaceY,
          center + currentReflectedLength * Math.sin(reflectedAngleRad),
          interfaceY - currentReflectedLength * Math.cos(reflectedAngleRad)
        );
      }
      
      // Draw angle arcs and labels
      p5.noFill();
      p5.strokeWeight(1);
      
      // Incident angle arc
      p5.stroke(255, 0, 0);
      p5.arc(center, interfaceY, 40, 40, -Math.PI + incidentAngleRad, -Math.PI/2);
      p5.noStroke();
      p5.fill(255, 0, 0);
      p5.textAlign(p5.RIGHT, p5.BOTTOM);
      p5.text(`θ₁ = ${incidentAngle}°`, center - 25, interfaceY - 10);
      
      // Refracted angle arc
      if (!isNaN(refractedAngleRad)) {
        p5.noFill();
        p5.stroke(0, 255, 0);
        p5.arc(center, interfaceY, 40, 40, Math.PI/2, Math.PI/2 + refractedAngleRad);
        p5.noStroke();
        p5.fill(0, 255, 0);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`θ₂ = ${result.value}°`, center + 25, interfaceY + 10);
      }
      
      // Reflected angle arc
      p5.noFill();
      p5.stroke(255, 165, 0);
      p5.arc(center, interfaceY, 40, 40, -Math.PI/2, -Math.PI/2 + reflectedAngleRad);
      p5.noStroke();
      p5.fill(255, 165, 0);
      p5.textAlign(p5.LEFT, p5.BOTTOM);
      p5.text(`θᵣ = ${incidentAngle}°`, center + 25, interfaceY - 10);
      
      // Draw legend
      p5.fill(0);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text("Legend:", 20, 20);
      
      p5.fill(255, 0, 0);
      p5.text("Incident Ray", 20, 40);
      
      p5.fill(0, 255, 0);
      p5.text("Refracted Ray", 20, 60);
      
      p5.fill(255, 165, 0);
      p5.text("Reflected Ray", 20, 80);
      
      // Display Snell's Law equation
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.text(`Snell's Law: n₁sin(θ₁) = n₂sin(θ₂)`, center, canvasHeight - 20);
      p5.text(`${refractiveIndex1} × sin(${incidentAngle}°) = ${refractiveIndex2} × sin(${result.value}°)`, center, canvasHeight - 40);
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!incidentAngle || !refractiveIndex1 || !refractiveIndex2}
      >
        {animate ? "Reset Simulation" : "Simulate Light Refraction"}
      </button>
    </div>
  );
};

export default RefractionSimulation; 