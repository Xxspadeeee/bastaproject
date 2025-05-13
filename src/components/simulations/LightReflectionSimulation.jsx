import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const LightReflectionSimulation = ({ 
  incidentAngle,
  surfaceType,
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
  }, [incidentAngle, surfaceType]);
  
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
    const mirrorY = canvasHeight / 2;
    
    // Draw reflecting surface
    p5.stroke(0);
    p5.strokeWeight(2);
    
    if (surfaceType === 'plane') {
      // Draw flat mirror
      p5.line(100, mirrorY, canvasWidth - 100, mirrorY);
    } else if (surfaceType === 'convex') {
      // Draw convex mirror
      p5.noFill();
      p5.arc(center, mirrorY + 200, 400, 400, p5.PI + 0.7, 2 * p5.PI - 0.7);
    } else if (surfaceType === 'concave') {
      // Draw concave mirror
      p5.noFill();
      p5.arc(center, mirrorY - 200, 400, 400, 0 + 0.7, p5.PI - 0.7);
    }
    
    // Draw mirror label
    p5.noStroke();
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.textSize(14);
    
    let surfaceLabel = "";
    if (surfaceType === 'plane') surfaceLabel = "Plane Mirror";
    else if (surfaceType === 'convex') surfaceLabel = "Convex Mirror";
    else if (surfaceType === 'concave') surfaceLabel = "Concave Mirror";
    
    p5.text(surfaceLabel, center, mirrorY + 10);
    
    // Calculate angles in radians
    const incidentAngleRad = parseFloat(incidentAngle) * Math.PI / 180;
    
    // For normal calculation
    let normalAngle = p5.PI/2; // Default for plane mirror (pointing up)
    let normalStartX = center;
    let normalStartY = mirrorY;
    let reflectionPoint = { x: center, y: mirrorY };
    
    // Calculate ray intersection with mirror
    if (surfaceType === 'plane') {
      // For plane mirror, intersection point depends on incident angle
      reflectionPoint.x = center;
      reflectionPoint.y = mirrorY;
    } else if (surfaceType === 'convex') {
      // For convex mirror, find intersection with arc
      const mirrorCenterY = mirrorY + 200;
      const mirrorRadius = 200;
      const rayStartX = center - 250 * Math.cos(incidentAngleRad);
      const rayStartY = mirrorY - 250 * Math.sin(incidentAngleRad);
      const rayDirX = Math.cos(incidentAngleRad);
      const rayDirY = Math.sin(incidentAngleRad);
      
      // Calculate intersection with circle
      const a = rayDirX * rayDirX + rayDirY * rayDirY;
      const b = 2 * (rayDirX * (rayStartX - center) + rayDirY * (rayStartY - mirrorCenterY));
      const c = (rayStartX - center) * (rayStartX - center) + 
                (rayStartY - mirrorCenterY) * (rayStartY - mirrorCenterY) - 
                mirrorRadius * mirrorRadius;
      
      const discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        const t = (-b - Math.sqrt(discriminant)) / (2 * a);
        reflectionPoint.x = rayStartX + t * rayDirX;
        reflectionPoint.y = rayStartY + t * rayDirY;
        
        // Calculate normal at intersection point (points from center to surface)
        normalAngle = Math.atan2(reflectionPoint.y - mirrorCenterY, reflectionPoint.x - center);
        normalStartX = reflectionPoint.x;
        normalStartY = reflectionPoint.y;
      }
    } else if (surfaceType === 'concave') {
      // For concave mirror, find intersection with arc
      const mirrorCenterY = mirrorY - 200;
      const mirrorRadius = 200;
      const rayStartX = center - 250 * Math.cos(incidentAngleRad);
      const rayStartY = mirrorY - 250 * Math.sin(incidentAngleRad);
      const rayDirX = Math.cos(incidentAngleRad);
      const rayDirY = Math.sin(incidentAngleRad);
      
      // Calculate intersection with circle
      const a = rayDirX * rayDirX + rayDirY * rayDirY;
      const b = 2 * (rayDirX * (rayStartX - center) + rayDirY * (rayStartY - mirrorCenterY));
      const c = (rayStartX - center) * (rayStartX - center) + 
                (rayStartY - mirrorCenterY) * (rayStartY - mirrorCenterY) - 
                mirrorRadius * mirrorRadius;
      
      const discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        const t = (-b + Math.sqrt(discriminant)) / (2 * a);
        reflectionPoint.x = rayStartX + t * rayDirX;
        reflectionPoint.y = rayStartY + t * rayDirY;
        
        // Calculate normal at intersection point (points from center to surface)
        normalAngle = Math.atan2(reflectionPoint.y - mirrorCenterY, reflectionPoint.x - center);
        normalStartX = reflectionPoint.x;
        normalStartY = reflectionPoint.y;
      }
    }
    
    // Draw normal line
    p5.stroke(0, 0, 0, 100);
    p5.strokeWeight(1);
    
    if (surfaceType === 'plane') {
      p5.line(reflectionPoint.x, reflectionPoint.y, reflectionPoint.x, reflectionPoint.y - 80);
    } else {
      const normalLength = 80;
      p5.line(normalStartX, normalStartY, 
              normalStartX + normalLength * Math.cos(normalAngle), 
              normalStartY + normalLength * Math.sin(normalAngle));
    }
    p5.noStroke();
    p5.fill(0);
    p5.textSize(12);
    p5.text("Normal", normalStartX, normalStartY - 90);
    
    // Draw rays when animated
    if (animate) {
      // Calculate reflected angle (equal to incident angle for all mirror types)
      // But we need to adjust based on the normal angle
      let reflectedAngle;
      
      if (surfaceType === 'plane') {
        reflectedAngle = -incidentAngleRad; // For plane mirror, simple reflection
      } else {
        // For curved mirrors, reflection happens across the normal
        // Incident angle is measured from normal, so reflected angle is the same magnitude
        reflectedAngle = 2 * normalAngle - incidentAngleRad - Math.PI;
      }
      
      // Draw incident ray
      p5.stroke(255, 0, 0);
      p5.strokeWeight(3);
      
      const rayStartDistance = 250;
      const rayStartX = reflectionPoint.x - rayStartDistance * Math.cos(incidentAngleRad);
      const rayStartY = reflectionPoint.y - rayStartDistance * Math.sin(incidentAngleRad);
      
      // Animate the incident ray
      if (rayPosition < 0) {
        const progress = Math.min(1, (rayPosition + canvasWidth/2) / canvasWidth);
        const currentRayLength = progress * rayStartDistance;
        
        p5.line(
          rayStartX,
          rayStartY,
          rayStartX + currentRayLength * Math.cos(incidentAngleRad),
          rayStartY + currentRayLength * Math.sin(incidentAngleRad)
        );
      } else {
        // Draw complete incident ray
        p5.line(
          rayStartX,
          rayStartY,
          reflectionPoint.x,
          reflectionPoint.y
        );
        
        // Draw reflected ray
        p5.stroke(0, 255, 0);
        
        const reflectedRayLength = 250;
        const animationProgress = Math.min(1, (rayPosition) / canvasWidth);
        const currentReflectedLength = animationProgress * reflectedRayLength;
        
        p5.line(
          reflectionPoint.x,
          reflectionPoint.y,
          reflectionPoint.x + currentReflectedLength * Math.cos(reflectedAngle),
          reflectionPoint.y + currentReflectedLength * Math.sin(reflectedAngle)
        );
      }
      
      // Draw angle arcs and labels
      p5.noFill();
      p5.strokeWeight(1);
      
      // Incident angle arc
      if (surfaceType === 'plane') {
        p5.stroke(255, 0, 0);
        p5.arc(reflectionPoint.x, reflectionPoint.y, 40, 40, -p5.PI/2, -p5.PI/2 + incidentAngleRad);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.textAlign(p5.LEFT, p5.BOTTOM);
        p5.text(`θᵢ = ${incidentAngle}°`, reflectionPoint.x + 10, reflectionPoint.y - 10);
        
        // Reflected angle arc
        p5.noFill();
        p5.stroke(0, 255, 0);
        p5.arc(reflectionPoint.x, reflectionPoint.y, 40, 40, -p5.PI/2 + p5.PI, -p5.PI/2 + p5.PI - incidentAngleRad);
        p5.noStroke();
        p5.fill(0, 255, 0);
        p5.textAlign(p5.RIGHT, p5.BOTTOM);
        p5.text(`θᵣ = ${incidentAngle}°`, reflectionPoint.x - 10, reflectionPoint.y - 10);
      } else {
        // For curved mirrors, measure angles from the normal
        // Incident angle arc
        p5.stroke(255, 0, 0);
        p5.arc(reflectionPoint.x, reflectionPoint.y, 40, 40, normalAngle, incidentAngleRad);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.textAlign(p5.LEFT, p5.BOTTOM);
        p5.text(`θᵢ = ${incidentAngle}°`, reflectionPoint.x + 30, reflectionPoint.y - 10);
        
        // Reflected angle arc
        p5.noFill();
        p5.stroke(0, 255, 0);
        p5.arc(reflectionPoint.x, reflectionPoint.y, 40, 40, reflectedAngle, normalAngle);
        p5.noStroke();
        p5.fill(0, 255, 0);
        p5.textAlign(p5.RIGHT, p5.BOTTOM);
        p5.text(`θᵣ = ${incidentAngle}°`, reflectionPoint.x - 30, reflectionPoint.y - 10);
      }
      
      // Draw legend
      p5.fill(0);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text("Legend:", 20, 20);
      
      p5.fill(255, 0, 0);
      p5.text("Incident Ray", 20, 40);
      
      p5.fill(0, 255, 0);
      p5.text("Reflected Ray", 20, 60);
      
      // Display Law of Reflection
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.text("Law of Reflection: Angle of Incidence = Angle of Reflection", center, canvasHeight - 20);
      p5.text(`θᵢ = θᵣ = ${incidentAngle}°`, center, canvasHeight - 40);
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!incidentAngle || !surfaceType}
      >
        {animate ? "Reset Simulation" : "Simulate Light Reflection"}
      </button>
    </div>
  );
};

export default LightReflectionSimulation; 