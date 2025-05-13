import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const ImageFormationSimulation = ({ 
  opticalElement,
  focalLength,
  objectDistance,
  imageDistance,
  magnification,
  result 
}) => {
  const [animate, setAnimate] = useState(false);
  const [rayProgress, setRayProgress] = useState(0);
  const canvasWidth = 700;
  const canvasHeight = 400;
  
  // Reset animation when props change
  useEffect(() => {
    setAnimate(false);
    setRayProgress(0);
  }, [opticalElement, focalLength, objectDistance, imageDistance]);
  
  // Animation effect
  useEffect(() => {
    let animationTimer;
    if (animate && result && !result.error) {
      setRayProgress(0);
      
      // Animation timer
      animationTimer = setInterval(() => {
        setRayProgress(prev => {
          if (prev < 1) {
            return prev + 0.02;
          }
          return 1;
        });
      }, 50);
    } else {
      setRayProgress(0);
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
    
    // Set up optical system coordinates
    const center = canvasWidth / 2;
    const axisY = canvasHeight / 2;
    
    // Draw optical axis
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.line(0, axisY, canvasWidth, axisY);
    
    // Calculate scaled distances and parameters
    const scale = 40; // pixels per unit distance
    const f = parseFloat(focalLength);
    const do_dist = parseFloat(objectDistance);
    const di_dist = imageDistance ? parseFloat(imageDistance) : 0;
    const f_scaled = f * scale;
    const do_scaled = do_dist * scale;
    const di_scaled = di_dist * scale;
    
    // Draw focal points
    p5.fill(255, 0, 0);
    p5.noStroke();
    p5.ellipse(center - f_scaled, axisY, 6, 6);
    p5.ellipse(center + f_scaled, axisY, 6, 6);
    
    p5.fill(0);
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.textSize(12);
    p5.text("F", center - f_scaled, axisY + 10);
    p5.text("F", center + f_scaled, axisY + 10);
    
    // Draw optical element
    p5.stroke(0, 0, 255);
    p5.strokeWeight(2);
    
    if (opticalElement === 'thin-lens') {
      // Draw thin lens symbol
      p5.line(center, axisY - 100, center, axisY + 100);
      
      // Add lens label
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.text(`Thin Lens (f = ${focalLength})`, center, axisY - 110);
    } else if (opticalElement === 'concave-mirror') {
      // Draw concave mirror
      p5.noFill();
      p5.arc(center + 150, axisY, 300, 300, p5.PI/2 - 0.5, p5.PI/2 + 0.5);
      
      // Add mirror label
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.text(`Concave Mirror (f = ${focalLength})`, center, axisY - 110);
    } else if (opticalElement === 'convex-mirror') {
      // Draw convex mirror
      p5.noFill();
      p5.arc(center - 150, axisY, 300, 300, -p5.PI/2 - 0.5, -p5.PI/2 + 0.5);
      
      // Add mirror label
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.text(`Convex Mirror (f = ${focalLength})`, center, axisY - 110);
    }
    
    // Draw object
    const objectX = center - do_scaled;
    const objectHeight = 80;
    
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.line(objectX, axisY, objectX, axisY - objectHeight);
    
    // Draw object arrow
    p5.fill(0);
    p5.noStroke();
    p5.triangle(
      objectX - 5, axisY - objectHeight,
      objectX + 5, axisY - objectHeight,
      objectX, axisY - objectHeight - 10
    );
    
    p5.textAlign(p5.RIGHT, p5.CENTER);
    p5.textSize(14);
    p5.text("Object", objectX - 10, axisY - objectHeight / 2);
    
    // Draw position label
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.textSize(12);
    p5.text(`d₀ = ${objectDistance}`, (center + objectX) / 2, axisY + 20);
    
    // Draw image if calculated
    if (result && !result.error && di_dist !== 0) {
      const imageX = center + di_scaled;
      
      // Calculate image height using magnification
      const m = magnification ? parseFloat(magnification) : -di_dist / do_dist;
      const imageHeight = objectHeight * m;
      
      // Draw image (dashed if virtual, solid if real)
      p5.strokeWeight(2);
      
      let isVirtualImage = false;
      
      // Determine if image is virtual based on optical element and image distance
      if (opticalElement === 'thin-lens') {
        isVirtualImage = di_dist < 0;
      } else if (opticalElement === 'concave-mirror') {
        isVirtualImage = di_dist > 0;
      } else if (opticalElement === 'convex-mirror') {
        isVirtualImage = di_dist < 0;
      }
      
      if (isVirtualImage) {
        // Virtual image - dashed line
        p5.stroke(0, 150, 0);
        const dashLength = 5;
        for (let y = axisY; y > axisY - Math.abs(imageHeight); y -= 2 * dashLength) {
          p5.line(imageX, y, imageX, Math.max(y - dashLength, axisY - Math.abs(imageHeight)));
        }
        
        // Draw arrow for virtual image
        p5.fill(0, 150, 0);
        p5.noStroke();
        p5.triangle(
          imageX - 5, axisY - imageHeight,
          imageX + 5, axisY - imageHeight,
          imageX, axisY - imageHeight - 10 * Math.sign(imageHeight)
        );
        
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text("Virtual Image", imageX + 10, axisY - imageHeight / 2);
      } else {
        // Real image - solid line
        p5.stroke(0, 150, 0);
        p5.line(imageX, axisY, imageX, axisY - imageHeight);
        
        // Draw arrow for real image
        p5.fill(0, 150, 0);
        p5.noStroke();
        p5.triangle(
          imageX - 5, axisY - imageHeight,
          imageX + 5, axisY - imageHeight,
          imageX, axisY - imageHeight - 10 * Math.sign(imageHeight)
        );
        
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text("Real Image", imageX + 10, axisY - imageHeight / 2);
      }
      
      // Draw image distance label
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.textSize(12);
      p5.text(`d₁ = ${Math.abs(imageDistance)}`, (center + imageX) / 2, axisY + 20);
    }
    
    // Draw light rays when animated
    if (animate && rayProgress > 0) {
      p5.strokeWeight(2);
      
      // Object tip coordinates
      const objTipX = objectX;
      const objTipY = axisY - objectHeight;
      
      // Element center coordinates
      const elementX = center;
      const elementY = axisY;
      
      // Image tip coordinates (if available)
      const imgTipX = center + di_scaled;
      const imgTipY = axisY - (objectHeight * (-di_dist / do_dist));
      
      // Draw principal rays
      if (opticalElement === 'thin-lens') {
        // Ray 1: Parallel to axis, then through focal point
        drawRay(p5, objTipX, objTipY, elementX, objTipY, rayProgress * 0.5);
        if (rayProgress > 0.5) {
          const ray1EndX = canvasWidth;
          const ray1EndY = elementY + (objTipY - elementY) * (ray1EndX - elementX) / (center + f_scaled - elementX);
          drawRay(p5, elementX, objTipY, ray1EndX, ray1EndY, (rayProgress - 0.5) * 2);
        }
        
        // Ray 2: Through center, straight line
        if (rayProgress > 0.3) {
          const ray2Slope = (objTipY - elementY) / (objTipX - elementX);
          const ray2EndX = canvasWidth;
          const ray2EndY = elementY + ray2Slope * (ray2EndX - elementX);
          drawRay(p5, objTipX, objTipY, ray2EndX, ray2EndY, Math.min((rayProgress - 0.3) * 1.4, 1));
        }
        
        // Ray 3: Through focal point, then parallel to axis
        if (rayProgress > 0.6) {
          const ray3StartX = objTipX;
          const ray3StartY = objTipY;
          const ray3MidX = elementX;
          const ray3MidSlope = (ray3StartY - (elementY - (elementX - (center - f_scaled)))) / (ray3StartX - (center - f_scaled));
          const ray3MidY = ray3StartY + ray3MidSlope * (elementX - ray3StartX);
          drawRay(p5, ray3StartX, ray3StartY, ray3MidX, ray3MidY, Math.min((rayProgress - 0.6) * 2.5, 1));
          
          if (rayProgress > 0.8) {
            const ray3EndX = canvasWidth;
            const ray3EndY = ray3MidY;
            drawRay(p5, ray3MidX, ray3MidY, ray3EndX, ray3EndY, Math.min((rayProgress - 0.8) * 5, 1));
          }
        }
      } else if (opticalElement === 'concave-mirror' || opticalElement === 'convex-mirror') {
        // For mirrors, the rays behave differently
        const mirrorX = opticalElement === 'concave-mirror' ? center : center;
        const mirrorCenterX = opticalElement === 'concave-mirror' ? center + 150 : center - 150;
        const rayLength = 300;
        
        // Ray 1: Parallel to axis, then through/from focal point
        drawRay(p5, objTipX, objTipY, mirrorX, objTipY, rayProgress * 0.5);
        
        if (rayProgress > 0.5) {
          // For concave mirror: reflects through focal point
          // For convex mirror: reflects as if from focal point
          const ray1EndX = opticalElement === 'concave-mirror' ? 0 : canvasWidth;
          const ray1MidSlope = opticalElement === 'concave-mirror' ? 
                             (objTipY - axisY) / (mirrorX - (center + f_scaled)) : 
                             (objTipY - axisY) / (mirrorX - (center - f_scaled));
          const ray1EndY = objTipY + ray1MidSlope * (ray1EndX - mirrorX);
          drawRay(p5, mirrorX, objTipY, ray1EndX, ray1EndY, (rayProgress - 0.5) * 2);
        }
        
        // Ray 2: Toward center of curvature, reflects back along same path
        if (rayProgress > 0.3) {
          const ray2EndX = mirrorCenterX;
          const ray2EndY = objTipY;
          drawRay(p5, objTipX, objTipY, mirrorX, objTipY, Math.min((rayProgress - 0.3) * 1.4, 1));
          
          if (rayProgress > 0.7) {
            drawRay(p5, mirrorX, objTipY, objTipX, objTipY, Math.min((rayProgress - 0.7) * 3, 1));
          }
        }
      }
    }
    
    // Display image characteristics if calculated
    if (result && !result.error && di_dist !== 0) {
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(14);
      
      // Calculate image characteristics
      const m = magnification ? parseFloat(magnification) : -di_dist / do_dist;
      
      let imageType = "";
      
      if ((opticalElement === 'thin-lens' && di_dist < 0) ||
          (opticalElement === 'concave-mirror' && di_dist > 0) ||
          (opticalElement === 'convex-mirror' && di_dist < 0)) {
        imageType += "Virtual, ";
      } else {
        imageType += "Real, ";
      }
      
      if (Math.abs(m) > 1) {
        imageType += "Enlarged, ";
      } else if (Math.abs(m) < 1) {
        imageType += "Reduced, ";
      } else {
        imageType += "Same size, ";
      }
      
      if (m > 0) {
        imageType += "Upright";
      } else {
        imageType += "Inverted";
      }
      
      p5.text(`Image characteristics: ${imageType}`, 20, 20);
      p5.text(`Magnification: ${Math.abs(m).toFixed(2)}×`, 20, 45);
      
      // Display lens/mirror equation
      p5.text("Lens/Mirror Equation:", 20, 80);
      p5.text(`1/f = 1/d₀ + 1/d₁`, 20, 105);
      p5.text(`1/${focalLength} = 1/${objectDistance} + 1/${imageDistance}`, 20, 130);
    }
  };
  
  // Helper function to draw rays with animation
  const drawRay = (p5, x1, y1, x2, y2, progress) => {
    p5.stroke(255, 165, 0);
    p5.strokeWeight(2);
    
    const endX = x1 + (x2 - x1) * progress;
    const endY = y1 + (y2 - y1) * progress;
    
    p5.line(x1, y1, endX, endY);
    
    // Draw arrowhead if progress is sufficient
    if (progress > 0.8) {
      const headSize = 8;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      
      p5.fill(255, 165, 0);
      p5.noStroke();
      p5.push();
      p5.translate(endX, endY);
      p5.rotate(angle);
      p5.triangle(0, 0, -headSize, headSize/2, -headSize, -headSize/2);
      p5.pop();
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!opticalElement || !focalLength || !objectDistance || !imageDistance}
      >
        {animate ? "Reset Simulation" : "Simulate Image Formation"}
      </button>
    </div>
  );
};

export default ImageFormationSimulation; 