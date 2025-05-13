import { useState } from 'react'
import './App.css'
import ElectricForceSimulation from './components/simulations/ElectricForceSimulation'
import ElectricFieldSimulation from './components/simulations/ElectricFieldSimulation'
import CapacitanceSimulation from './components/simulations/CapacitanceSimulation'
import ResistanceSimulation from './components/simulations/ResistanceSimulation'
import MagnetismSimulation from './components/simulations/MagnetismSimulation'
import ElectromagnetismSimulation from './components/simulations/ElectromagnetismSimulation'
import RefractionSimulation from './components/simulations/RefractionSimulation'
import LensSimulation from './components/simulations/LensSimulation'
import DirectCurrentSimulation from './components/simulations/DirectCurrentSimulation'
import InducedVoltageSimulation from './components/simulations/InducedVoltageSimulation'
import InductanceSimulation from './components/simulations/InductanceSimulation'
import ACCircuitSimulation from './components/simulations/ACCircuitSimulation'
import LightReflectionSimulation from './components/simulations/LightReflectionSimulation'
import ImageFormationSimulation from './components/simulations/ImageFormationSimulation'

function App() {
  const [activeTopic, setActiveTopic] = useState('home')
  const [inputValues, setInputValues] = useState({})
  const [result, setResult] = useState(null)

  const topics = [
    { id: 'home', label: 'Home' },
    { id: 'electric-forces', label: 'Electric Forces' },
    { id: 'electric-fields', label: 'Electric Fields' },
    { id: 'capacitance', label: 'Capacitance' },
    { id: 'current-resistance', label: 'Current & Resistance' },
    { id: 'direct-current', label: 'Direct Current' },
    { id: 'magnetism', label: 'Magnetism' },
    { id: 'electromagnetism', label: 'Electromagnetism' },
    { id: 'induced-voltages', label: 'Induced Voltages' },
    { id: 'inductance', label: 'Inductance' },
    { id: 'ac-circuits', label: 'AC Circuits' },
    { id: 'light-reflection', label: 'Light Reflection' },
    { id: 'light-refraction', label: 'Light Refraction' },
    { id: 'mirrors-lenses', label: 'Mirrors & Lenses' },
    { id: 'image-formation', label: 'Image Formation' },
  ]

  const handleInputChange = (field, value) => {
    setInputValues({
      ...inputValues,
      [field]: value
    })
  }

  const calculateElectricForce = () => {
    const k = 8.99e9 // Coulomb constant in N·m²/C²
    const q1 = parseFloat(inputValues.charge1)
    const q2 = parseFloat(inputValues.charge2)
    const r = parseFloat(inputValues.distance)
    
    if (isNaN(q1) || isNaN(q2) || isNaN(r) || r === 0) {
      return { error: 'Please enter valid values' }
    }
    
    const force = k * Math.abs(q1 * q2) / (r * r)
    return { 
      value: force.toExponential(3), 
      unit: 'N',
      explanation: `The electric force between two charges is calculated using Coulomb's Law: F = k|q₁q₂|/r²`
    }
  }

  const calculateElectricField = () => {
    const k = 8.99e9 // Coulomb constant in N·m²/C²
    const q = parseFloat(inputValues.charge)
    const r = parseFloat(inputValues.fieldDistance)
    
    if (isNaN(q) || isNaN(r) || r === 0) {
      return { error: 'Please enter valid values' }
    }
    
    const field = k * Math.abs(q) / (r * r)
    return { 
      value: field.toExponential(3), 
      unit: 'N/C',
      explanation: `The electric field due to a point charge is calculated using E = k|q|/r²`
    }
  }

  const calculateCapacitance = () => {
    const type = inputValues.capacitorType
    const epsilon0 = 8.85e-12 // Vacuum permittivity in F/m
    
    if (type === 'parallel') {
      const area = parseFloat(inputValues.plateArea)
      const distance = parseFloat(inputValues.plateSeparation)
      const k = parseFloat(inputValues.dielectricConstant) || 1 // Default to vacuum
      
      if (isNaN(area) || isNaN(distance) || distance === 0) {
        return { error: 'Please enter valid values' }
      }
      
      const capacitance = epsilon0 * k * area / distance
      return { 
        value: capacitance.toExponential(3), 
        unit: 'F',
        explanation: `The capacitance of a parallel plate capacitor is calculated using C = ε₀κA/d`
      }
    } else if (type === 'spherical') {
      const radius1 = parseFloat(inputValues.innerRadius)
      const radius2 = parseFloat(inputValues.outerRadius)
      const k = parseFloat(inputValues.dielectricConstant) || 1 // Default to vacuum
      
      if (isNaN(radius1) || isNaN(radius2) || radius1 >= radius2) {
        return { error: 'Please enter valid values (outer radius must be greater than inner radius)' }
      }
      
      const capacitance = 4 * Math.PI * epsilon0 * k * radius1 * radius2 / (radius2 - radius1)
      return { 
        value: capacitance.toExponential(3), 
        unit: 'F',
        explanation: `The capacitance of a spherical capacitor is calculated using C = 4πε₀κr₁r₂/(r₂-r₁)`
      }
    }
    
    return { error: 'Please select a capacitor type' }
  }

  const calculateResistance = () => {
    const calculationType = inputValues.resistanceType
    
    if (calculationType === 'ohm') {
      const voltage = parseFloat(inputValues.voltage)
      const current = parseFloat(inputValues.current)
      
      if (isNaN(voltage) || isNaN(current) || current === 0) {
        return { error: 'Please enter valid values' }
      }
      
      const resistance = voltage / current
      return { 
        value: resistance.toFixed(3), 
        unit: 'Ω',
        explanation: `The resistance is calculated using Ohm's Law: R = V/I`
      }
    } else if (calculationType === 'resistivity') {
      const resistivity = parseFloat(inputValues.resistivity)
      const length = parseFloat(inputValues.wireLength)
      const area = parseFloat(inputValues.wireArea)
      
      if (isNaN(resistivity) || isNaN(length) || isNaN(area) || area === 0) {
        return { error: 'Please enter valid values' }
      }
      
      const resistance = resistivity * length / area
      return { 
        value: resistance.toFixed(3), 
        unit: 'Ω',
        explanation: `The resistance is calculated using R = ρL/A, where ρ is the resistivity`
      }
    } else if (calculationType === 'power') {
      const power = parseFloat(inputValues.powerDissipated)
      const current = parseFloat(inputValues.currentForPower)
      
      if (isNaN(power) || isNaN(current) || current === 0) {
        return { error: 'Please enter valid values' }
      }
      
      const resistance = power / (current * current)
      return { 
        value: resistance.toFixed(3), 
        unit: 'Ω',
        explanation: `The resistance is calculated using R = P/I², derived from P = I²R`
      }
    }
    
    return { error: 'Please select a calculation type' }
  }

  const calculateMagneticForce = () => {
    const current = parseFloat(inputValues.currentStrength);
    const length = parseFloat(inputValues.wireLength);
    const field = parseFloat(inputValues.magneticField);
    
    if (isNaN(current) || isNaN(length) || isNaN(field)) {
      return { error: 'Please enter valid values' }
    }
    
    const force = Math.abs(current * length * field);
    return { 
      value: force.toFixed(3), 
      unit: 'N',
      explanation: `The magnetic force on a current-carrying wire is calculated using F = |I × L × B| where I is current, L is length, and B is the magnetic field strength.`
    }
  }

  const calculateInducedEMF = () => {
    const turns = parseFloat(inputValues.coilTurns);
    const area = parseFloat(inputValues.loopArea);
    const fieldChange = parseFloat(inputValues.fieldChangeRate);
    
    if (isNaN(turns) || isNaN(area) || isNaN(fieldChange)) {
      return { error: 'Please enter valid values' }
    }
    
    const emf = Math.abs(turns * area * fieldChange);
    return { 
      value: emf.toFixed(3), 
      unit: 'V',
      explanation: `The induced EMF is calculated using Faraday's Law: EMF = -N × (dΦ/dt) = -N × A × (dB/dt) where N is the number of turns, A is the area, and dB/dt is the rate of change of the magnetic field.`
    }
  }

  const calculateRefractedAngle = () => {
    const incidentAngle = parseFloat(inputValues.incidentAngle);
    const n1 = parseFloat(inputValues.refractiveIndex1);
    const n2 = parseFloat(inputValues.refractiveIndex2);
    
    if (isNaN(incidentAngle) || isNaN(n1) || isNaN(n2)) {
      return { error: 'Please enter valid values' }
    }
    
    // Convert incident angle to radians
    const incidentRad = incidentAngle * Math.PI / 180;
    
    // Calculate using Snell's Law
    const sinRefracted = (n1 * Math.sin(incidentRad)) / n2;
    
    // Check for total internal reflection
    if (Math.abs(sinRefracted) > 1) {
      return { 
        value: "Total Internal Reflection", 
        unit: "",
        explanation: `Total internal reflection occurs when light travels from a medium with higher refractive index to one with lower refractive index at an angle greater than the critical angle.`
      }
    }
    
    const refractedRad = Math.asin(sinRefracted);
    const refractedAngle = (refractedRad * 180 / Math.PI).toFixed(1);
    
    return { 
      value: refractedAngle, 
      unit: '°',
      explanation: `The refracted angle is calculated using Snell's Law: n₁sin(θ₁) = n₂sin(θ₂).`
    }
  }

  const calculateDirectCurrent = () => {
    const voltage = parseFloat(inputValues.voltage);
    const resistance = parseFloat(inputValues.resistance);
    
    if (isNaN(voltage) || isNaN(resistance) || resistance === 0) {
      return { error: 'Please enter valid values (resistance cannot be zero)' }
    }
    
    const current = voltage / resistance;
    const power = voltage * current;
    
    return { 
      value: current.toFixed(3), 
      unit: 'A',
      power: power.toFixed(3),
      explanation: `The current is calculated using Ohm's Law: I = V/R = ${voltage}V/${resistance}Ω = ${current.toFixed(3)}A. The power dissipated is P = VI = ${power.toFixed(3)}W.`
    }
  }
  
  const calculateInducedVoltage = () => {
    const fluxChangeRate = parseFloat(inputValues.fluxChangeRate);
    const loopArea = parseFloat(inputValues.loopArea);
    const numLoops = parseFloat(inputValues.numLoops);
    
    if (isNaN(fluxChangeRate) || isNaN(loopArea) || isNaN(numLoops)) {
      return { error: 'Please enter valid values' }
    }
    
    const inducedVoltage = fluxChangeRate * loopArea * numLoops;
    
    return { 
      value: inducedVoltage.toFixed(3), 
      unit: 'V',
      explanation: `The induced voltage is calculated using Faraday's Law: EMF = -N × (dΦ/dt) = -N × A × (dB/dt) where N is the number of loops, A is the area, and dB/dt is the rate of change of magnetic flux.`
    }
  }
  
  const calculateInductance = () => {
    const coilLength = parseFloat(inputValues.coilLength);
    const coilRadius = parseFloat(inputValues.coilRadius);
    const numTurns = parseFloat(inputValues.numTurns);
    const currentChangeRate = parseFloat(inputValues.currentChangeRate);
    
    if (isNaN(coilLength) || isNaN(coilRadius) || isNaN(numTurns) || coilLength === 0) {
      return { error: 'Please enter valid values' }
    }
    
    // Calculate inductance using the formula for a solenoid
    const mu0 = 4 * Math.PI * 1e-7; // Permeability of free space
    const area = Math.PI * coilRadius * coilRadius;
    const inductance = mu0 * numTurns * numTurns * area / coilLength;
    
    // Calculate induced EMF if current change rate is provided
    const inducedEMF = isNaN(currentChangeRate) ? 0 : inductance * currentChangeRate;
    
    return { 
      value: inductance.toFixed(6), 
      unit: 'H',
      emf: inducedEMF.toFixed(3),
      explanation: `The inductance of a solenoid is calculated using L = μ₀N²A/l where N is the number of turns, A is the cross-sectional area, and l is the length.`
    }
  }
  
  const calculateACCircuit = () => {
    const voltage = parseFloat(inputValues.acVoltage);
    const frequency = parseFloat(inputValues.frequency);
    const resistance = parseFloat(inputValues.acResistance);
    const inductance = parseFloat(inputValues.acInductance) || 0;
    const capacitance = parseFloat(inputValues.acCapacitance) || 0;
    
    if (isNaN(voltage) || isNaN(frequency) || isNaN(resistance) || frequency === 0) {
      return { error: 'Please enter valid values' }
    }
    
    // Calculate angular frequency
    const omega = 2 * Math.PI * frequency;
    
    // Calculate reactances
    const XL = omega * inductance;
    const XC = capacitance === 0 ? 0 : 1 / (omega * capacitance);
    
    // Calculate impedance
    const Z = Math.sqrt(resistance * resistance + Math.pow(XL - XC, 2));
    
    // Calculate current amplitude
    const current = voltage / Z;
    
    // Calculate phase difference (positive if voltage leads current)
    const phaseDifference = Math.atan2(XL - XC, resistance);
    const phaseDegrees = phaseDifference * 180 / Math.PI;
    
    // Calculate power factor
    const powerFactor = Math.cos(phaseDifference);
    
    // Calculate powers
    const apparentPower = voltage * current;
    const realPower = apparentPower * powerFactor;
    const reactivePower = apparentPower * Math.sin(phaseDifference);
    
    return { 
      value: Z.toFixed(3), 
      unit: 'Ω',
      current: current.toFixed(3),
      phase: phaseDegrees.toFixed(1),
      powerFactor: powerFactor.toFixed(3),
      realPower: realPower.toFixed(3),
      reactivePower: reactivePower.toFixed(3),
      apparentPower: apparentPower.toFixed(3),
      explanation: `The impedance is calculated using Z = √(R² + (XL - XC)²) where XL = ωL and XC = 1/(ωC). The current amplitude is I = V/Z.`
    }
  }
  
  const calculateReflectedAngle = () => {
    const incidentAngle = parseFloat(inputValues.reflectionAngle);
    
    if (isNaN(incidentAngle) || incidentAngle < 0 || incidentAngle > 90) {
      return { error: 'Please enter a valid angle between 0 and 90 degrees' }
    }
    
    // By the Law of Reflection, reflected angle equals incident angle
    return { 
      value: incidentAngle.toFixed(1), 
      unit: '°',
      explanation: `According to the Law of Reflection, the angle of reflection equals the angle of incidence: θᵣ = θᵢ = ${incidentAngle}°.`
    }
  }
  
  const calculateImageFormation = () => {
    const focalLength = parseFloat(inputValues.imageFocalLength);
    const objectDistance = parseFloat(inputValues.imageObjectDistance);
    
    if (isNaN(focalLength) || isNaN(objectDistance) || focalLength === 0 || objectDistance === 0) {
      return { error: 'Please enter valid values (focal length and object distance cannot be zero)' }
    }
    
    // Using the lens/mirror equation: 1/f = 1/do + 1/di
    // Rearranged to: di = (do × f) / (do - f)
    const imageDistance = (objectDistance * focalLength) / (objectDistance - focalLength);
    
    // Calculate magnification: m = -di/do
    const magnification = -imageDistance / objectDistance;
    
    return { 
      value: imageDistance.toFixed(2), 
      unit: 'cm',
      magnification: magnification.toFixed(2),
      explanation: `The image distance is calculated using the lens/mirror equation: 1/f = 1/do + 1/di, where f is focal length, do is object distance, and di is image distance. The magnification is m = -di/do = ${magnification.toFixed(2)}.`
    }
  }

  const calculateImageDistance = () => {
    const objectDist = parseFloat(inputValues.objectDistance);
    const focalLength = parseFloat(inputValues.focalLength);
    
    if (isNaN(objectDist) || isNaN(focalLength) || focalLength === 0) {
      return { error: 'Please enter valid values' }
    }
    
    // Using the lens/mirror equation: 1/f = 1/do + 1/di
    // Rearranged to: di = (do × f) / (do - f)
    const imageDistance = (objectDist * focalLength) / (objectDist - focalLength);
    
    return { 
      value: imageDistance.toFixed(2), 
      unit: 'cm',
      explanation: `The image distance is calculated using the lens/mirror equation: 1/f = 1/do + 1/di, where f is focal length, do is object distance, and di is image distance.`
    }
  }

  const handleCalculate = () => {
    let calculationResult = null;
    
    switch (activeTopic) {
      case 'electric-forces':
        calculationResult = calculateElectricForce();
        break;
      case 'electric-fields':
        calculationResult = calculateElectricField();
        break;
      case 'capacitance':
        calculationResult = calculateCapacitance();
        break;
      case 'current-resistance':
        calculationResult = calculateResistance();
        break;
      case 'direct-current':
        calculationResult = calculateDirectCurrent();
        break;
      case 'magnetism':
        calculationResult = calculateMagneticForce();
        break;
      case 'electromagnetism':
        calculationResult = calculateInducedEMF();
        break;
      case 'induced-voltages':
        calculationResult = calculateInducedVoltage();
        break;
      case 'inductance':
        calculationResult = calculateInductance();
        break;
      case 'ac-circuits':
        calculationResult = calculateACCircuit();
        break;
      case 'light-reflection':
        calculationResult = calculateReflectedAngle();
        break;
      case 'light-refraction':
        calculationResult = calculateRefractedAngle();
        break;
      case 'mirrors-lenses':
        calculationResult = calculateImageDistance();
        break;
      case 'image-formation':
        calculationResult = calculateImageFormation();
        break;
      default:
        calculationResult = { error: 'No calculation available for this topic' };
    }
    
    setResult(calculationResult);
  }

  const renderContent = () => {
    if (activeTopic === 'home') {
      return (
        <div className="home-content">
          <h2>Welcome to DO nald The Physics Explorer</h2>
          <p>This interactive website helps you learn and practice physics concepts from electromagnetism to optics.</p>
          <p>Select a topic from the navigation menu to explore equations, solve problems, and test your understanding.</p>
          <p><strong>New Feature:</strong> Interactive simulations are now available! Calculate values and then click "Simulate" to visualize the physics concepts.</p>
          <div className="topics-overview">
            <h3>Topics Covered:</h3>
            <ul>
              {topics.slice(1).map(topic => (
                <li key={topic.id}>{topic.label}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'electric-forces') {
      return (
        <div className="topic-content">
          <h2>Electric Forces</h2>
          <p>Electric force is the force acting between charged particles. It's described by Coulomb's Law.</p>
          
          <div className="equation-box">
            <h3>Coulomb's Law:</h3>
            <p className="equation">F = k|q₁q₂|/r²</p>
            <p>where:</p>
            <ul>
              <li>F is the electric force (in newtons, N)</li>
              <li>k is Coulomb's constant (8.99 × 10⁹ N·m²/C²)</li>
              <li>q₁ and q₂ are the magnitudes of the charges (in coulombs, C)</li>
              <li>r is the distance between the charges (in meters, m)</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Electric Force Calculator</h3>
            <div className="input-group">
              <label>
                Charge 1 (C):
                <input 
                  type="number" 
                  value={inputValues.charge1 || ''} 
                  onChange={(e) => handleInputChange('charge1', e.target.value)} 
                  placeholder="e.g., 1.6e-19"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Charge 2 (C):
                <input 
                  type="number" 
                  value={inputValues.charge2 || ''} 
                  onChange={(e) => handleInputChange('charge2', e.target.value)} 
                  placeholder="e.g., 1.6e-19"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Distance (m):
                <input 
                  type="number" 
                  value={inputValues.distance || ''} 
                  onChange={(e) => handleInputChange('distance', e.target.value)} 
                  placeholder="e.g., 1.0"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Force = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <ElectricForceSimulation 
                        charge1={inputValues.charge1} 
                        charge2={inputValues.charge2} 
                        distance={inputValues.distance} 
                        result={result} 
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'electric-fields') {
      return (
        <div className="topic-content">
          <h2>Electric Fields</h2>
          <p>An electric field is a region around a charged particle where a force would be exerted on other charged particles.</p>
          
          <div className="equation-box">
            <h3>Electric Field due to a Point Charge:</h3>
            <p className="equation">E = k|q|/r²</p>
            <p>where:</p>
            <ul>
              <li>E is the electric field strength (in newtons per coulomb, N/C)</li>
              <li>k is Coulomb's constant (8.99 × 10⁹ N·m²/C²)</li>
              <li>q is the magnitude of the source charge (in coulombs, C)</li>
              <li>r is the distance from the charge (in meters, m)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Electric Field and Force Relationship:</h3>
            <p className="equation">F = qE</p>
            <p>where:</p>
            <ul>
              <li>F is the force on a charge (in newtons, N)</li>
              <li>q is the test charge (in coulombs, C)</li>
              <li>E is the electric field (in N/C)</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Electric Field Calculator</h3>
            <div className="input-group">
              <label>
                Source Charge (C):
                <input 
                  type="number" 
                  value={inputValues.charge || ''} 
                  onChange={(e) => handleInputChange('charge', e.target.value)} 
                  placeholder="e.g., 1.6e-19"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Distance from Charge (m):
                <input 
                  type="number" 
                  value={inputValues.fieldDistance || ''} 
                  onChange={(e) => handleInputChange('fieldDistance', e.target.value)} 
                  placeholder="e.g., 1.0"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Electric Field</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Electric Field = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <ElectricFieldSimulation 
                        charge={inputValues.charge} 
                        distance={inputValues.fieldDistance} 
                        result={result} 
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'capacitance') {
      return (
        <div className="topic-content">
          <h2>Capacitance</h2>
          <p>A capacitor is a device that stores electrical energy in an electric field. Capacitance is a measure of a capacitor's ability to store charge.</p>
          
          <div className="equation-box">
            <h3>Capacitance Definition:</h3>
            <p className="equation">C = Q/V</p>
            <p>where:</p>
            <ul>
              <li>C is capacitance (in farads, F)</li>
              <li>Q is electric charge (in coulombs, C)</li>
              <li>V is electric potential difference (in volts, V)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Parallel Plate Capacitor:</h3>
            <p className="equation">C = ε₀κA/d</p>
            <p>where:</p>
            <ul>
              <li>ε₀ is the vacuum permittivity (8.85 × 10⁻¹² F/m)</li>
              <li>κ is the dielectric constant (1 for vacuum)</li>
              <li>A is the area of plate overlap (in m²)</li>
              <li>d is the separation between plates (in m)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Spherical Capacitor:</h3>
            <p className="equation">C = 4πε₀κr₁r₂/(r₂-r₁)</p>
            <p>where:</p>
            <ul>
              <li>r₁ is the radius of the inner sphere</li>
              <li>r₂ is the radius of the outer sphere</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Energy Stored in a Capacitor:</h3>
            <p className="equation">U = ½CV² = ½QV = Q²/(2C)</p>
          </div>
          
          <div className="calculator">
            <h3>Capacitance Calculator</h3>
            <div className="input-group">
              <label>
                Capacitor Type:
                <select 
                  value={inputValues.capacitorType || ''} 
                  onChange={(e) => handleInputChange('capacitorType', e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="parallel">Parallel Plate</option>
                  <option value="spherical">Spherical</option>
                </select>
              </label>
            </div>
            
            {inputValues.capacitorType === 'parallel' && (
              <>
                <div className="input-group">
                  <label>
                    Plate Area (m²):
                    <input 
                      type="number" 
                      value={inputValues.plateArea || ''} 
                      onChange={(e) => handleInputChange('plateArea', e.target.value)} 
                      placeholder="e.g., 0.01"
                    />
                  </label>
                </div>
                <div className="input-group">
                  <label>
                    Plate Separation (m):
                    <input 
                      type="number" 
                      value={inputValues.plateSeparation || ''} 
                      onChange={(e) => handleInputChange('plateSeparation', e.target.value)} 
                      placeholder="e.g., 0.001"
                    />
                  </label>
                </div>
              </>
            )}
            
            {inputValues.capacitorType === 'spherical' && (
              <>
                <div className="input-group">
                  <label>
                    Inner Radius (m):
                    <input 
                      type="number" 
                      value={inputValues.innerRadius || ''} 
                      onChange={(e) => handleInputChange('innerRadius', e.target.value)} 
                      placeholder="e.g., 0.01"
                    />
                  </label>
                </div>
                <div className="input-group">
                  <label>
                    Outer Radius (m):
                    <input 
                      type="number" 
                      value={inputValues.outerRadius || ''} 
                      onChange={(e) => handleInputChange('outerRadius', e.target.value)} 
                      placeholder="e.g., 0.02"
                    />
                  </label>
                </div>
              </>
            )}
            
            {(inputValues.capacitorType === 'parallel' || inputValues.capacitorType === 'spherical') && (
              <div className="input-group">
                <label>
                  Dielectric Constant:
                  <input 
                    type="number" 
                    value={inputValues.dielectricConstant || ''} 
                    onChange={(e) => handleInputChange('dielectricConstant', e.target.value)} 
                    placeholder="e.g., 1 for vacuum"
                  />
                </label>
              </div>
            )}
            
            <button onClick={handleCalculate}>Calculate Capacitance</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Capacitance = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <CapacitanceSimulation 
                        capacitorType={inputValues.capacitorType}
                        plateArea={inputValues.plateArea}
                        plateSeparation={inputValues.plateSeparation}
                        innerRadius={inputValues.innerRadius}
                        outerRadius={inputValues.outerRadius}
                        dielectricConstant={inputValues.dielectricConstant}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'current-resistance') {
      return (
        <div className="topic-content">
          <h2>Current and Resistance</h2>
          <p>Electric current is the flow of electric charge through a conductor. Resistance is the opposition to the flow of electric current.</p>
          
          <div className="equation-box">
            <h3>Ohm's Law:</h3>
            <p className="equation">V = IR</p>
            <p>where:</p>
            <ul>
              <li>V is the voltage (in volts, V)</li>
              <li>I is the current (in amperes, A)</li>
              <li>R is the resistance (in ohms, Ω)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Resistance and Resistivity:</h3>
            <p className="equation">R = ρL/A</p>
            <p>where:</p>
            <ul>
              <li>R is the resistance (in ohms, Ω)</li>
              <li>ρ (rho) is the resistivity (in ohm-meters, Ω·m)</li>
              <li>L is the length of the conductor (in meters, m)</li>
              <li>A is the cross-sectional area (in square meters, m²)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Power Dissipated in a Resistor:</h3>
            <p className="equation">P = VI = I²R = V²/R</p>
            <p>where:</p>
            <ul>
              <li>P is the power (in watts, W)</li>
              <li>V is the voltage (in volts, V)</li>
              <li>I is the current (in amperes, A)</li>
              <li>R is the resistance (in ohms, Ω)</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Resistance Calculator</h3>
            <div className="input-group">
              <label>
                Calculation Type:
                <select 
                  value={inputValues.resistanceType || ''} 
                  onChange={(e) => handleInputChange('resistanceType', e.target.value)}
                >
                  <option value="">Select calculation</option>
                  <option value="ohm">Using Ohm's Law (V/I)</option>
                  <option value="resistivity">Using Resistivity (ρL/A)</option>
                  <option value="power">Using Power (P/I²)</option>
                </select>
              </label>
            </div>
            
            {inputValues.resistanceType === 'ohm' && (
              <>
                <div className="input-group">
                  <label>
                    Voltage (V):
                    <input 
                      type="number" 
                      value={inputValues.voltage || ''} 
                      onChange={(e) => handleInputChange('voltage', e.target.value)} 
                      placeholder="e.g., 12"
                    />
                  </label>
                </div>
                <div className="input-group">
                  <label>
                    Current (A):
                    <input 
                      type="number" 
                      value={inputValues.current || ''} 
                      onChange={(e) => handleInputChange('current', e.target.value)} 
                      placeholder="e.g., 2"
                    />
                  </label>
                </div>
              </>
            )}
            
            {inputValues.resistanceType === 'resistivity' && (
              <>
                <div className="input-group">
                  <label>
                    Resistivity (Ω·m):
                    <input 
                      type="number" 
                      value={inputValues.resistivity || ''} 
                      onChange={(e) => handleInputChange('resistivity', e.target.value)} 
                      placeholder="e.g., 1.68e-8 for copper"
                    />
                  </label>
                </div>
                <div className="input-group">
                  <label>
                    Wire Length (m):
                    <input 
                      type="number" 
                      value={inputValues.wireLength || ''} 
                      onChange={(e) => handleInputChange('wireLength', e.target.value)} 
                      placeholder="e.g., 10"
                    />
                  </label>
                </div>
                <div className="input-group">
                  <label>
                    Wire Cross-sectional Area (m²):
                    <input 
                      type="number" 
                      value={inputValues.wireArea || ''} 
                      onChange={(e) => handleInputChange('wireArea', e.target.value)} 
                      placeholder="e.g., 0.0001"
                    />
                  </label>
                </div>
              </>
            )}
            
            {inputValues.resistanceType === 'power' && (
              <>
                <div className="input-group">
                  <label>
                    Power Dissipated (W):
                    <input 
                      type="number" 
                      value={inputValues.powerDissipated || ''} 
                      onChange={(e) => handleInputChange('powerDissipated', e.target.value)} 
                      placeholder="e.g., 100"
                    />
                  </label>
                </div>
                <div className="input-group">
                  <label>
                    Current (A):
                    <input 
                      type="number" 
                      value={inputValues.currentForPower || ''} 
                      onChange={(e) => handleInputChange('currentForPower', e.target.value)} 
                      placeholder="e.g., 5"
                    />
                  </label>
                </div>
              </>
            )}
            
            <button onClick={handleCalculate}>Calculate Resistance</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Resistance = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <ResistanceSimulation 
                        resistanceType={inputValues.resistanceType}
                        voltage={inputValues.voltage}
                        current={inputValues.current}
                        resistivity={inputValues.resistivity}
                        wireLength={inputValues.wireLength}
                        wireArea={inputValues.wireArea}
                        powerDissipated={inputValues.powerDissipated}
                        currentForPower={inputValues.currentForPower}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'direct-current') {
      return (
        <div className="topic-content">
          <h2>Direct Current</h2>
          <p>Direct current (DC) is the unidirectional flow of electric charge. In a DC circuit, current flows in only one direction, unlike alternating current (AC).</p>
          
          <div className="equation-box">
            <h3>Ohm's Law:</h3>
            <p className="equation">V = IR</p>
            <p>where:</p>
            <ul>
              <li>V is the voltage (in volts, V)</li>
              <li>I is the current (in amperes, A)</li>
              <li>R is the resistance (in ohms, Ω)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Power in DC Circuits:</h3>
            <p className="equation">P = VI = I²R = V²/R</p>
            <p>where:</p>
            <ul>
              <li>P is the power (in watts, W)</li>
              <li>V is the voltage (in volts, V)</li>
              <li>I is the current (in amperes, A)</li>
              <li>R is the resistance (in ohms, Ω)</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>DC Circuit Calculator</h3>
            <div className="input-group">
              <label>
                Voltage (V):
                <input 
                  type="number" 
                  value={inputValues.voltage || ''} 
                  onChange={(e) => handleInputChange('voltage', e.target.value)} 
                  placeholder="e.g., 12"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Resistance (Ω):
                <input 
                  type="number" 
                  value={inputValues.resistance || ''} 
                  onChange={(e) => handleInputChange('resistance', e.target.value)} 
                  placeholder="e.g., 100"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Current</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Results:</h4>
                    <p>Current = {result.value} {result.unit}</p>
                    <p>Power = {result.power} W</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <DirectCurrentSimulation 
                        voltage={inputValues.voltage}
                        resistance={inputValues.resistance}
                        current={result.value}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'magnetism') {
      return (
        <div className="topic-content">
          <h2>Magnetism</h2>
          <p>Magnetism involves the interaction between moving electric charges and magnetic fields. A current-carrying wire in a magnetic field experiences a force that depends on the current, wire length, and field strength.</p>
          
          <div className="equation-box">
            <h3>Magnetic Force on a Current-carrying Wire:</h3>
            <p className="equation">F = I × L × B × sin(θ)</p>
            <p>where:</p>
            <ul>
              <li>F is the magnetic force (in newtons, N)</li>
              <li>I is the current through the wire (in amperes, A)</li>
              <li>L is the length of the wire (in meters, m)</li>
              <li>B is the magnetic field strength (in teslas, T)</li>
              <li>θ is the angle between the current and magnetic field directions</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Magnetic Force Calculator</h3>
            <div className="input-group">
              <label>
                Current (A):
                <input 
                  type="number" 
                  value={inputValues.currentStrength || ''} 
                  onChange={(e) => handleInputChange('currentStrength', e.target.value)} 
                  placeholder="e.g., 5"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Wire Length (m):
                <input 
                  type="number" 
                  value={inputValues.wireLength || ''} 
                  onChange={(e) => handleInputChange('wireLength', e.target.value)} 
                  placeholder="e.g., 2"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Magnetic Field (T):
                <input 
                  type="number" 
                  value={inputValues.magneticField || ''} 
                  onChange={(e) => handleInputChange('magneticField', e.target.value)} 
                  placeholder="e.g., 0.5"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Magnetic Force</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Magnetic Force = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <MagnetismSimulation 
                        currentStrength={inputValues.currentStrength}
                        wireLength={inputValues.wireLength}
                        magneticField={inputValues.magneticField}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'electromagnetism') {
      return (
        <div className="topic-content">
          <h2>Electromagnetism</h2>
          <p>Electromagnetic induction occurs when a changing magnetic field generates an electric potential (EMF) in a conductor. This is the principle behind generators and transformers.</p>
          
          <div className="equation-box">
            <h3>Faraday's Law of Induction:</h3>
            <p className="equation">EMF = -N × (dΦ/dt)</p>
            <p>where:</p>
            <ul>
              <li>EMF is the induced electromotive force (in volts, V)</li>
              <li>N is the number of turns in the coil</li>
              <li>dΦ/dt is the rate of change of magnetic flux (in webers per second, Wb/s)</li>
              <li>Φ = B × A × cos(θ) is the magnetic flux</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Induced EMF Calculator</h3>
            <div className="input-group">
              <label>
                Number of Coil Turns:
                <input 
                  type="number" 
                  value={inputValues.coilTurns || ''} 
                  onChange={(e) => handleInputChange('coilTurns', e.target.value)} 
                  placeholder="e.g., 50"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Loop Area (m²):
                <input 
                  type="number" 
                  value={inputValues.loopArea || ''} 
                  onChange={(e) => handleInputChange('loopArea', e.target.value)} 
                  placeholder="e.g., 0.01"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Rate of Magnetic Field Change (T/s):
                <input 
                  type="number" 
                  value={inputValues.fieldChangeRate || ''} 
                  onChange={(e) => handleInputChange('fieldChangeRate', e.target.value)} 
                  placeholder="e.g., 0.2"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Magnet Movement Speed (relative):
                <input 
                  type="number" 
                  value={inputValues.movementSpeed || ''} 
                  onChange={(e) => handleInputChange('movementSpeed', e.target.value)} 
                  placeholder="e.g., 5"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Induced EMF</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Induced EMF = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <ElectromagnetismSimulation 
                        coilTurns={inputValues.coilTurns}
                        magnetStrength={inputValues.fieldChangeRate}
                        area={inputValues.loopArea}
                        movementSpeed={inputValues.movementSpeed}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'induced-voltages') {
      return (
        <div className="topic-content">
          <h2>Induced Voltages</h2>
          <p>Electromagnetic induction is the production of voltage across a conductor when it is exposed to a varying magnetic field. This principle is the basis for many electrical devices like generators and transformers.</p>
          
          <div className="equation-box">
            <h3>Faraday's Law of Electromagnetic Induction:</h3>
            <p className="equation">EMF = -N × (dΦ/dt)</p>
            <p>where:</p>
            <ul>
              <li>EMF is the induced electromotive force (in volts, V)</li>
              <li>N is the number of turns in the coil</li>
              <li>dΦ/dt is the rate of change of magnetic flux (in webers per second, Wb/s)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Magnetic Flux:</h3>
            <p className="equation">Φ = B × A × cos(θ)</p>
            <p>where:</p>
            <ul>
              <li>Φ is the magnetic flux (in webers, Wb)</li>
              <li>B is the magnetic field strength (in teslas, T)</li>
              <li>A is the area of the loop (in square meters, m²)</li>
              <li>θ is the angle between the magnetic field and the normal to the loop</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Induced Voltage Calculator</h3>
            <div className="input-group">
              <label>
                Magnetic Flux Change Rate (T/s):
                <input 
                  type="number" 
                  value={inputValues.fluxChangeRate || ''} 
                  onChange={(e) => handleInputChange('fluxChangeRate', e.target.value)} 
                  placeholder="e.g., 0.1"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Loop Area (m²):
                <input 
                  type="number" 
                  value={inputValues.loopArea || ''} 
                  onChange={(e) => handleInputChange('loopArea', e.target.value)} 
                  placeholder="e.g., 0.01"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Number of Loops:
                <input 
                  type="number" 
                  value={inputValues.numLoops || ''} 
                  onChange={(e) => handleInputChange('numLoops', e.target.value)} 
                  placeholder="e.g., 100"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Induced Voltage</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Induced Voltage = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <InducedVoltageSimulation 
                        fluxChangeRate={inputValues.fluxChangeRate}
                        loopArea={inputValues.loopArea}
                        numLoops={inputValues.numLoops}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'inductance') {
      return (
        <div className="topic-content">
          <h2>Inductance</h2>
          <p>Inductance is the property of an electrical conductor by which a change in current through it induces an electromotive force (EMF) in both the conductor itself and in any nearby conductors.</p>
          
          <div className="equation-box">
            <h3>Self-Inductance:</h3>
            <p className="equation">EMF = -L × (dI/dt)</p>
            <p>where:</p>
            <ul>
              <li>EMF is the self-induced electromotive force (in volts, V)</li>
              <li>L is the self-inductance of the coil (in henries, H)</li>
              <li>dI/dt is the rate of change of current (in amperes per second, A/s)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Inductance of a Solenoid:</h3>
            <p className="equation">L = μ₀N²A/l</p>
            <p>where:</p>
            <ul>
              <li>L is the inductance (in henries, H)</li>
              <li>μ₀ is the permeability of free space (4π × 10⁻⁷ H/m)</li>
              <li>N is the number of turns in the coil</li>
              <li>A is the cross-sectional area of the coil (in square meters, m²)</li>
              <li>l is the length of the coil (in meters, m)</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Inductance Calculator</h3>
            <div className="input-group">
              <label>
                Number of Turns:
                <input 
                  type="number" 
                  value={inputValues.numTurns || ''} 
                  onChange={(e) => handleInputChange('numTurns', e.target.value)} 
                  placeholder="e.g., 200"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Coil Radius (m):
                <input 
                  type="number" 
                  value={inputValues.coilRadius || ''} 
                  onChange={(e) => handleInputChange('coilRadius', e.target.value)} 
                  placeholder="e.g., 0.01"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Coil Length (m):
                <input 
                  type="number" 
                  value={inputValues.coilLength || ''} 
                  onChange={(e) => handleInputChange('coilLength', e.target.value)} 
                  placeholder="e.g., 0.05"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Rate of Current Change (A/s):
                <input 
                  type="number" 
                  value={inputValues.currentChangeRate || ''} 
                  onChange={(e) => handleInputChange('currentChangeRate', e.target.value)} 
                  placeholder="e.g., 10"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Inductance</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Inductance = {result.value} {result.unit}</p>
                    {result.emf && <p>Self-induced EMF = {result.emf} V</p>}
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <InductanceSimulation 
                        inductance={result.value}
                        currentChangeRate={inputValues.currentChangeRate}
                        coilLength={inputValues.coilLength}
                        numTurns={inputValues.numTurns}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'ac-circuits') {
      return (
        <div className="topic-content">
          <h2>AC Circuits</h2>
          <p>Alternating current (AC) circuits involve current that periodically reverses direction. AC circuits can include resistors, inductors, and capacitors, which together determine the circuit's impedance and phase relationships.</p>
          
          <div className="equation-box">
            <h3>Impedance in AC Circuits:</h3>
            <p className="equation">Z = √(R² + (X<sub>L</sub> - X<sub>C</sub>)²)</p>
            <p>where:</p>
            <ul>
              <li>Z is the impedance (in ohms, Ω)</li>
              <li>R is the resistance (in ohms, Ω)</li>
              <li>X<sub>L</sub> is the inductive reactance: X<sub>L</sub> = ωL (in ohms, Ω)</li>
              <li>X<sub>C</sub> is the capacitive reactance: X<sub>C</sub> = 1/(ωC) (in ohms, Ω)</li>
              <li>ω is the angular frequency: ω = 2πf (in radians per second, rad/s)</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Power in AC Circuits:</h3>
            <p className="equation">S = VI = √(P² + Q²)</p>
            <p>where:</p>
            <ul>
              <li>S is the apparent power (in volt-amperes, VA)</li>
              <li>P is the real power: P = VI×cos(φ) (in watts, W)</li>
              <li>Q is the reactive power: Q = VI×sin(φ) (in volt-amperes reactive, VAR)</li>
              <li>φ is the phase angle between voltage and current</li>
              <li>cos(φ) is the power factor</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>AC Circuit Calculator</h3>
            <div className="input-group">
              <label>
                Voltage (V):
                <input 
                  type="number" 
                  value={inputValues.acVoltage || ''} 
                  onChange={(e) => handleInputChange('acVoltage', e.target.value)} 
                  placeholder="e.g., 120"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Frequency (Hz):
                <input 
                  type="number" 
                  value={inputValues.frequency || ''} 
                  onChange={(e) => handleInputChange('frequency', e.target.value)} 
                  placeholder="e.g., 60"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Resistance (Ω):
                <input 
                  type="number" 
                  value={inputValues.acResistance || ''} 
                  onChange={(e) => handleInputChange('acResistance', e.target.value)} 
                  placeholder="e.g., 100"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Inductance (H):
                <input 
                  type="number" 
                  value={inputValues.acInductance || ''} 
                  onChange={(e) => handleInputChange('acInductance', e.target.value)} 
                  placeholder="e.g., 0.1"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Capacitance (F):
                <input 
                  type="number" 
                  value={inputValues.acCapacitance || ''} 
                  onChange={(e) => handleInputChange('acCapacitance', e.target.value)} 
                  placeholder="e.g., 1e-6"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate AC Circuit</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Impedance (Z) = {result.value} {result.unit}</p>
                    <p>Current Amplitude = {result.current} A</p>
                    <p>Phase Angle = {result.phase}°</p>
                    <p>Power Factor = {result.powerFactor}</p>
                    <p>Real Power = {result.realPower} W</p>
                    <p>Reactive Power = {result.reactivePower} VAR</p>
                    <p>Apparent Power = {result.apparentPower} VA</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <ACCircuitSimulation 
                        voltage={inputValues.acVoltage}
                        frequency={inputValues.frequency}
                        resistance={inputValues.acResistance}
                        inductance={inputValues.acInductance}
                        capacitance={inputValues.acCapacitance}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'light-reflection') {
      return (
        <div className="topic-content">
          <h2>Light Reflection</h2>
          <p>Reflection occurs when light bounces off a surface. The Law of Reflection states that the angle of incidence equals the angle of reflection, measured from the normal to the reflecting surface.</p>
          
          <div className="equation-box">
            <h3>Law of Reflection:</h3>
            <p className="equation">θ<sub>i</sub> = θ<sub>r</sub></p>
            <p>where:</p>
            <ul>
              <li>θ<sub>i</sub> is the angle of incidence (measured from the normal)</li>
              <li>θ<sub>r</sub> is the angle of reflection (measured from the normal)</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Reflection Calculator</h3>
            <div className="input-group">
              <label>
                Angle of Incidence (°):
                <input 
                  type="number" 
                  value={inputValues.reflectionAngle || ''} 
                  onChange={(e) => handleInputChange('reflectionAngle', e.target.value)} 
                  placeholder="e.g., 30"
                  min="0"
                  max="90"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Surface Type:
                <select 
                  value={inputValues.surfaceType || ''} 
                  onChange={(e) => handleInputChange('surfaceType', e.target.value)}
                >
                  <option value="">Select surface</option>
                  <option value="plane">Plane Mirror</option>
                  <option value="concave">Concave Mirror</option>
                  <option value="convex">Convex Mirror</option>
                </select>
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Reflected Angle</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Reflected Angle = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <LightReflectionSimulation 
                        incidentAngle={inputValues.reflectionAngle}
                        surfaceType={inputValues.surfaceType}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'light-refraction') {
      return (
        <div className="topic-content">
          <h2>Light Refraction</h2>
          <p>Refraction is the bending of light as it passes from one medium to another due to the change in its speed. The amount of bending depends on the refractive indices of the media.</p>
          
          <div className="equation-box">
            <h3>Snell's Law:</h3>
            <p className="equation">n₁ × sin(θ₁) = n₂ × sin(θ₂)</p>
            <p>where:</p>
            <ul>
              <li>n₁ is the refractive index of the first medium</li>
              <li>θ₁ is the angle of incidence</li>
              <li>n₂ is the refractive index of the second medium</li>
              <li>θ₂ is the angle of refraction</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Refraction Calculator</h3>
            <div className="input-group">
              <label>
                Angle of Incidence (°):
                <input 
                  type="number" 
                  value={inputValues.incidentAngle || ''} 
                  onChange={(e) => handleInputChange('incidentAngle', e.target.value)} 
                  placeholder="e.g., 30"
                  min="0"
                  max="90"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Refractive Index of Medium 1:
                <input 
                  type="number" 
                  value={inputValues.refractiveIndex1 || ''} 
                  onChange={(e) => handleInputChange('refractiveIndex1', e.target.value)} 
                  placeholder="e.g., 1.0 (air)"
                  min="1"
                  step="0.01"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Refractive Index of Medium 2:
                <input 
                  type="number" 
                  value={inputValues.refractiveIndex2 || ''} 
                  onChange={(e) => handleInputChange('refractiveIndex2', e.target.value)} 
                  placeholder="e.g., 1.33 (water)"
                  min="1"
                  step="0.01"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Refracted Angle</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    {result.value === "Total Internal Reflection" ? (
                      <p>Total Internal Reflection occurs</p>
                    ) : (
                      <p>Refracted Angle = {result.value}{result.unit}</p>
                    )}
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <RefractionSimulation 
                        incidentAngle={inputValues.incidentAngle}
                        refractiveIndex1={inputValues.refractiveIndex1}
                        refractiveIndex2={inputValues.refractiveIndex2}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'mirrors-lenses') {
      return (
        <div className="topic-content">
          <h2>Mirrors and Lenses</h2>
          <p>Mirrors and lenses form images by reflecting or refracting light rays. The characteristics of the image formed depend on the object distance and focal length.</p>
          
          <div className="equation-box">
            <h3>Mirror/Lens Equation:</h3>
            <p className="equation">1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub></p>
            <p>where:</p>
            <ul>
              <li>f is the focal length</li>
              <li>d<sub>o</sub> is the object distance</li>
              <li>d<sub>i</sub> is the image distance</li>
            </ul>
          </div>
          
          <div className="equation-box">
            <h3>Magnification:</h3>
            <p className="equation">m = -d<sub>i</sub>/d<sub>o</sub></p>
          </div>
          
          <div className="calculator">
            <h3>Image Formation Calculator</h3>
            <div className="input-group">
              <label>
                Optic Type:
                <select 
                  value={inputValues.lensType || ''} 
                  onChange={(e) => handleInputChange('lensType', e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="converging-lens">Converging Lens (Convex)</option>
                  <option value="diverging-lens">Diverging Lens (Concave)</option>
                  <option value="converging-mirror">Converging Mirror (Concave)</option>
                  <option value="diverging-mirror">Diverging Mirror (Convex)</option>
                </select>
              </label>
            </div>
            <div className="input-group">
              <label>
                Object Distance (cm):
                <input 
                  type="number" 
                  value={inputValues.objectDistance || ''} 
                  onChange={(e) => handleInputChange('objectDistance', e.target.value)} 
                  placeholder="e.g., 20"
                  min="0.1"
                  step="0.1"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Focal Length (cm):
                <input 
                  type="number" 
                  value={inputValues.focalLength || ''} 
                  onChange={(e) => handleInputChange('focalLength', e.target.value)} 
                  placeholder="e.g., 10 (positive for converging, negative for diverging)"
                  step="0.1"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Image Position</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Image Distance = {result.value} {result.unit}</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <LensSimulation 
                        lensType={inputValues.lensType}
                        objectDistance={inputValues.objectDistance}
                        focalLength={inputValues.focalLength}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    if (activeTopic === 'image-formation') {
      return (
        <div className="topic-content">
          <h2>Image Formation</h2>
          <p>Image formation in optical systems occurs when light rays from an object are manipulated by lenses or mirrors to form an image. The properties of the image depend on the optical element and the object's position.</p>
          
          <div className="equation-box">
            <h3>Lens/Mirror Equation:</h3>
            <p className="equation">1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub></p>
            <p>where:</p>
            <ul>
              <li>f is the focal length</li>
              <li>d<sub>o</sub> is the object distance</li>
              <li>d<sub>i</sub> is the image distance</li>
            </ul>
          </div>

          <div className="equation-box">
            <h3>Magnification:</h3>
            <p className="equation">m = -d<sub>i</sub>/d<sub>o</sub> = h<sub>i</sub>/h<sub>o</sub></p>
            <p>where:</p>
            <ul>
              <li>m is the magnification</li>
              <li>h<sub>i</sub> is the image height</li>
              <li>h<sub>o</sub> is the object height</li>
            </ul>
            <p><strong>Sign convention:</strong></p>
            <ul>
              <li>Positive image distance: real image</li>
              <li>Negative image distance: virtual image</li>
              <li>Positive magnification: upright image</li>
              <li>Negative magnification: inverted image</li>
            </ul>
          </div>
          
          <div className="calculator">
            <h3>Image Formation Calculator</h3>
            <div className="input-group">
              <label>
                Optical Element:
                <select 
                  value={inputValues.opticalElement || ''} 
                  onChange={(e) => handleInputChange('opticalElement', e.target.value)}
                >
                  <option value="">Select element</option>
                  <option value="thin-lens">Thin Lens</option>
                  <option value="concave-mirror">Concave Mirror</option>
                  <option value="convex-mirror">Convex Mirror</option>
                </select>
              </label>
            </div>
            <div className="input-group">
              <label>
                Focal Length (cm):
                <input 
                  type="number" 
                  value={inputValues.imageFocalLength || ''} 
                  onChange={(e) => handleInputChange('imageFocalLength', e.target.value)} 
                  placeholder="e.g., 10 (positive for convex lens, negative for concave lens)"
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Object Distance (cm):
                <input 
                  type="number" 
                  value={inputValues.imageObjectDistance || ''} 
                  onChange={(e) => handleInputChange('imageObjectDistance', e.target.value)} 
                  placeholder="e.g., 20"
                />
              </label>
            </div>
            <button onClick={handleCalculate}>Calculate Image Properties</button>
            
            {result && (
              <div className="result">
                {result.error ? (
                  <p className="error">{result.error}</p>
                ) : (
                  <>
                    <h4>Result:</h4>
                    <p>Image Distance = {result.value} {result.unit}</p>
                    <p>Magnification = {result.magnification}×</p>
                    <p className="explanation">{result.explanation}</p>
                    
                    <div className="simulation">
                      <h4>Simulation:</h4>
                      <ImageFormationSimulation 
                        opticalElement={inputValues.opticalElement}
                        focalLength={inputValues.imageFocalLength}
                        objectDistance={inputValues.imageObjectDistance}
                        imageDistance={result.value}
                        magnification={result.magnification}
                        result={result}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return <div>Content for {activeTopic} will be added soon!</div>
  }

  return (
    <div className="app-container">
      <header>
        <h1>Physics Explorer</h1>
      </header>
      
      <nav className="main-nav">
        <ul>
          {topics.map(topic => (
            <li 
              key={topic.id} 
              className={activeTopic === topic.id ? 'active' : ''}
              onClick={() => {
                setActiveTopic(topic.id)
                setResult(null)
                setInputValues({})
              }}
            >
              {topic.label}
            </li>
          ))}
        </ul>
      </nav>
      
      <main className="content">
        {renderContent()}
      </main>
      
      <footer>
        <p>&copy; {new Date().getFullYear()} Physics Explorer - Educational Website</p>
      </footer>
    </div>
  )
}

export default App
