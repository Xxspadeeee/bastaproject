import { useEffect, useState } from 'react';
import Sketch from 'react-p5';

const LensSimulation = ({ 
  lensType, 
  objectDistance,
  focalLength,
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
  }, [lensType, objectDistance, focalLength]);
  
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
    
    const center = canvasWidth / 2;
    const axisY = canvasHeight / 2;
    
    // Draw principal axis
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.line(0, axisY, canvasWidth, axisY);
    
    // Calculate scaled distances
    const scaleFactor = 30; // pixels per unit distance
    const objDist = parseFloat(objectDistance) * scaleFactor;
    const focalLen = parseFloat(focalLength) * scaleFactor;
    const imageDistance = result && !result.error 
      ? parseFloat(result.value) * scaleFactor
      : 0;
    
    // Draw the lens or mirror
    if (lensType === 'converging-lens' || lensType === 'diverging-lens') {
      // Draw lens
      p5.stroke(0, 0, 255);
      p5.strokeWeight(2);
      
      if (lensType === 'converging-lens') {
        // Draw convex lens
        p5.line(center, axisY - 80, center, axisY + 80);
        p5.noFill();
        p5.strokeWeight(3);
        p5.arc(center - 10, axisY, 40, 160, -p5.PI/2, p5.PI/2);
        p5.arc(center + 10, axisY, 40, 160, p5.PI/2, 3*p5.PI/2);
      } else {
        // Draw concave lens
        p5.line(center, axisY - 80, center, axisY + 80);
        p5.noFill();
        p5.strokeWeight(3);
        p5.arc(center + 10, axisY, 40, 160, -p5.PI/2, p5.PI/2);
        p5.arc(center - 10, axisY, 40, 160, p5.PI/2, 3*p5.PI/2);
      }
    } else if (lensType === 'converging-mirror' || lensType === 'diverging-mirror') {
      // Draw mirror
      p5.stroke(100);
      p5.strokeWeight(3);
      
      if (lensType === 'converging-mirror') {
        // Draw concave mirror
        p5.noFill();
        p5.arc(center + 100, axisY, 200, 300, -p5.PI/2 - 0.5, p5.PI/2 + 0.5);
      } else {
        // Draw convex mirror
        p5.noFill();
        p5.arc(center - 100, axisY, 200, 300, p5.PI/2 - 0.5, 3*p5.PI/2 + 0.5);
      }
    }
    
    // Draw focal points
    p5.stroke(0);
    p5.strokeWeight(1);
    
    if (lensType === 'converging-lens' || lensType === 'converging-mirror') {
      // Positive focal length
      const F1 = center - focalLen;
      const F2 = center + focalLen;
      
      p5.fill(255, 0, 0);
      p5.ellipse(F1, axisY, 6, 6);
      p5.ellipse(F2, axisY, 6, 6);
      
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text("F", F1, axisY + 10);
      p5.text("F", F2, axisY + 10);
    } else {
      // Negative focal length
      const F1 = center + focalLen;
      const F2 = center - focalLen;
      
      p5.fill(255, 0, 0);
      p5.ellipse(F1, axisY, 6, 6);
      p5.ellipse(F2, axisY, 6, 6);
      
      p5.noStroke();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text("F", F1, axisY + 10);
      p5.text("F", F2, axisY + 10);
    }
    
    // Draw object
    const objectX = center - objDist;
    const objectHeight = 80;
    
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.line(objectX, axisY, objectX, axisY - objectHeight);
    
    p5.fill(0);
    p5.noStroke();
    p5.triangle(
      objectX, axisY - objectHeight,
      objectX - 5, axisY - objectHeight - 10,
      objectX + 5, axisY - objectHeight - 10
    );
    
    p5.textAlign(p5.RIGHT, p5.CENTER);
    p5.text("Object", objectX - 10, axisY - objectHeight / 2);
    
    // Draw image if calculated
    if (result && !result.error && imageDistance !== 0) {
      const imageX = center + imageDistance;
      
      // Calculate image height using magnification
      const magnification = -imageDistance / objDist;
      const imageHeight = objectHeight * magnification;
      
      // Draw image (dashed if virtual, solid if real)
      p5.stroke(0, 150, 0);
      p5.strokeWeight(2);
      
      if ((lensType === 'converging-lens' && imageDistance > 0) || 
          (lensType === 'diverging-lens' && imageDistance < 0) ||
          (lensType === 'converging-mirror' && imageDistance < 0) ||
          (lensType === 'diverging-mirror' && imageDistance > 0)) {
        // Real image - solid line
        p5.line(imageX, axisY, imageX, axisY - imageHeight);
        
        p5.fill(0, 150, 0);
        p5.noStroke();
        p5.triangle(
          imageX, axisY - imageHeight,
          imageX - 5, axisY - imageHeight - 10 * Math.sign(imageHeight),
          imageX + 5, axisY - imageHeight - 10 * Math.sign(imageHeight)
        );
        
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text("Real Image", imageX + 10, axisY - imageHeight / 2);
      } else {
        // Virtual image - dashed line
        const dashLength = 5;
        for (let y = axisY; y > axisY - Math.abs(imageHeight); y -= 2 * dashLength) {
          p5.line(imageX, y, imageX, Math.max(y - dashLength, axisY - Math.abs(imageHeight)));
        }
        
        p5.fill(0, 150, 0);
        p5.noStroke();
        p5.triangle(
          imageX, axisY - imageHeight,
          imageX - 5, axisY - imageHeight - 10 * Math.sign(imageHeight),
          imageX + 5, axisY - imageHeight - 10 * Math.sign(imageHeight)
        );
        
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text("Virtual Image", imageX + 10, axisY - imageHeight / 2);
      }
    }
    
    // Draw light rays when animated
    if (animate && rayProgress > 0) {
      p5.strokeWeight(2);
      
      const isLens = lensType === 'converging-lens' || lensType === 'diverging-lens';
      const isConverging = lensType === 'converging-lens' || lensType === 'converging-mirror';
      
      // Ray 1: Parallel to principal axis, then through/away from focal point
      p5.stroke(255, 0, 0);
      
      // First part of ray 1 (before lens/mirror)
      const ray1X1 = objectX;
      const ray1Y1 = axisY - objectHeight;
      let ray1X2, ray1Y2;
      
      if (isLens) {
        ray1X2 = center;
        ray1Y2 = ray1Y1;
      } else if (lensType === 'converging-mirror') {
        // For concave mirror
        const mirrorX = center + 100;
        const mirrorRadius = 200;
        
        // Find intersection with mirror
        const y = ray1Y1 - axisY;
        const angle = Math.asin(y / mirrorRadius);
        ray1X2 = mirrorX - mirrorRadius * Math.cos(angle);
        ray1Y2 = axisY + mirrorRadius * Math.sin(angle);
      } else {
        // For convex mirror
        const mirrorX = center - 100;
        const mirrorRadius = 200;
        
        // Find intersection with mirror
        const y = ray1Y1 - axisY;
        const angle = Math.asin(y / mirrorRadius);
        ray1X2 = mirrorX + mirrorRadius * Math.cos(angle);
        ray1Y2 = axisY + mirrorRadius * Math.sin(angle);
      }
      
      // Draw first part of ray 1
      p5.line(
        ray1X1, 
        ray1Y1, 
        ray1X1 + (ray1X2 - ray1X1) * Math.min(rayProgress * 2, 1),
        ray1Y1 + (ray1Y2 - ray1Y1) * Math.min(rayProgress * 2, 1)
      );
      
      // Draw second part of ray 1 (after lens/mirror)
      if (rayProgress > 0.5) {
        let ray1X3, ray1Y3;
        
        if (isLens) {
          if (isConverging) {
            // Through focal point
            ray1X3 = center + 2 * focalLen;
            ray1Y3 = axisY;
          } else {
            // Away from focal point
            const slope = (ray1Y2 - axisY) / (center + focalLen - center);
            ray1X3 = canvasWidth;
            ray1Y3 = ray1Y2 + slope * (ray1X3 - center);
          }
        } else if (lensType === 'converging-mirror') {
          // Reflected through focal point
          ray1X3 = center;
          ray1Y3 = axisY;
        } else {
          // Reflected as if from focal point
          const slope = (ray1Y2 - axisY) / (ray1X2 - (center + focalLen));
          ray1X3 = 0;
          ray1Y3 = ray1Y2 + slope * (ray1X3 - ray1X2);
        }
        
        p5.line(
          ray1X2,
          ray1Y2,
          ray1X2 + (ray1X3 - ray1X2) * Math.min((rayProgress - 0.5) * 2, 1),
          ray1Y2 + (ray1Y3 - ray1Y2) * Math.min((rayProgress - 0.5) * 2, 1)
        );
      }
      
      // Ray 2: Through center of lens or perpendicular to mirror
      if (rayProgress > 0.3) {
        p5.stroke(0, 0, 255);
        
        let ray2X1 = objectX;
        let ray2Y1 = axisY - objectHeight;
        let ray2X2, ray2Y2;
        
        if (isLens) {
          // Through center of lens
          ray2X2 = center;
          ray2Y2 = axisY - objectHeight * (center - objectX) / objDist;
        } else if (lensType === 'converging-mirror') {
          // Perpendicular to concave mirror
          const mirrorX = center + 100;
          ray2X2 = mirrorX - Math.sqrt(40000 - Math.pow(ray2Y1 - axisY, 2));
          ray2Y2 = ray2Y1;
        } else {
          // Perpendicular to convex mirror
          const mirrorX = center - 100;
          ray2X2 = mirrorX + Math.sqrt(40000 - Math.pow(ray2Y1 - axisY, 2));
          ray2Y2 = ray2Y1;
        }
        
        // Draw first part of ray 2
        p5.line(
          ray2X1, 
          ray2Y1, 
          ray2X1 + (ray2X2 - ray2X1) * Math.min((rayProgress - 0.3) * 2, 1),
          ray2Y1 + (ray2Y2 - ray2Y1) * Math.min((rayProgress - 0.3) * 2, 1)
        );
        
        // Draw second part of ray 2 (after lens/mirror)
        if (rayProgress > 0.8) {
          let ray2X3, ray2Y3;
          
          if (isLens) {
            // Straight through center
            ray2X3 = canvasWidth;
            ray2Y3 = ray2Y2 + (ray2Y2 - axisY) * (ray2X3 - center) / (center - objectX);
          } else {
            // Reflect back along the same path for perpendicular rays to mirror
            ray2X3 = objectX;
            ray2Y3 = ray2Y1;
          }
          
          p5.line(
            ray2X2,
            ray2Y2,
            ray2X2 + (ray2X3 - ray2X2) * Math.min((rayProgress - 0.8) * 5, 1),
            ray2Y2 + (ray2Y3 - ray2Y2) * Math.min((rayProgress - 0.8) * 5, 1)
          );
        }
      }
      
      // Display information
      p5.fill(0);
      p5.noStroke();
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(14);
      
      let opticType = "";
      if (lensType === 'converging-lens') opticType = "Convex Lens";
      else if (lensType === 'diverging-lens') opticType = "Concave Lens";
      else if (lensType === 'converging-mirror') opticType = "Concave Mirror";
      else if (lensType === 'diverging-mirror') opticType = "Convex Mirror";
      
      p5.text(`Optic: ${opticType}`, 20, 20);
      p5.text(`Object Distance: ${objectDistance} cm`, 20, 40);
      p5.text(`Focal Length: ${focalLength} cm`, 20, 60);
      
      if (result && !result.error) {
        p5.text(`Image Distance: ${result.value} cm`, 20, 80);
        p5.text(`Magnification: ${(-parseFloat(result.value)/parseFloat(objectDistance)).toFixed(2)}×`, 20, 100);
        
        // Image characteristics
        let imageType = "";
        const imagePos = parseFloat(result.value);
        
        if ((lensType === 'converging-lens' && imagePos > 0) || 
            (lensType === 'diverging-lens' && imagePos < 0) ||
            (lensType === 'converging-mirror' && imagePos < 0) ||
            (lensType === 'diverging-mirror' && imagePos > 0)) {
          imageType = "Real, ";
        } else {
          imageType = "Virtual, ";
        }
        
        if (Math.abs(imagePos) > Math.abs(parseFloat(objectDistance))) {
          imageType += "Magnified, ";
        } else {
          imageType += "Diminished, ";
        }
        
        if (imagePos > 0) {
          imageType += "Upright";
        } else {
          imageType += "Inverted";
        }
        
        p5.text(`Image Characteristics: ${imageType}`, 20, 120);
      }
    }
  };

  return (
    <div className="simulation-container">
      <Sketch setup={setup} draw={draw} />
      <button 
        className="simulation-button"
        onClick={() => setAnimate(!animate)}
        disabled={!lensType || !objectDistance || !focalLength}
      >
        {animate ? "Reset Simulation" : "Simulate Optics"}
      </button>
    </div>
  );
};

export default LensSimulation; 