import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import type { PredictionResponse, RiskWindow, SimilarCase } from "@shared/schema";

const timelineSegments = [
  { label: "6h", hours: 6 },
  { label: "24h", hours: 24 },
  { label: "48h", hours: 48 },
  { label: "72h", hours: 72 },
  { label: "7d", hours: 168 },
];

function QuantumOrb({ 
  isScanning, 
  hasResult, 
  riskLevel 
}: { 
  isScanning: boolean; 
  hasResult: boolean; 
  riskLevel: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orb: THREE.Mesh;
    particles: THREE.Points;
    time: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const orbGeometry = new THREE.IcosahedronGeometry(1.2, 4);
    const orbMaterial = new THREE.MeshPhongMaterial({
      color: 0x8855ff,
      emissive: 0x4400aa,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
      shininess: 100,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);

    const innerGeometry = new THREE.IcosahedronGeometry(0.8, 2);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xaa77ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const innerOrb = new THREE.Mesh(innerGeometry, innerMaterial);
    orb.add(innerOrb);

    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      colors[i * 3] = 0.6 + Math.random() * 0.4;
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.4;
      colors[i * 3 + 2] = 1;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0x6644aa, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8855ff, 2, 10);
    pointLight1.position.set(3, 2, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4488ff, 1.5, 10);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    sceneRef.current = { scene, camera, renderer, orb, particles, time: 0 };

    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    
    let animationId: number;
    
    const animate = () => {
      if (!sceneRef.current) return;
      
      const { scene, camera, renderer, orb, particles, time } = sceneRef.current;
      sceneRef.current.time = time + 0.01;
      
      const t = sceneRef.current.time;
      
      if (isScanning) {
        orb.rotation.x += 0.03;
        orb.rotation.y += 0.04;
        orb.scale.setScalar(0.8 + Math.sin(t * 5) * 0.3);
        (orb.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.6 + Math.sin(t * 8) * 0.4;
        particles.rotation.y += 0.02;
        particles.rotation.x += 0.01;
      } else {
        orb.rotation.x += 0.002;
        orb.rotation.y += 0.003;
        const pulseScale = 1 + Math.sin(t * 0.5) * 0.05;
        orb.scale.setScalar(pulseScale);
        
        if (hasResult) {
          const intensity = 0.4 + riskLevel * 0.4;
          (orb.material as THREE.MeshPhongMaterial).emissiveIntensity = intensity + Math.sin(t * 2) * 0.1;
          (orb.material as THREE.MeshPhongMaterial).color.setHSL(0.75 - riskLevel * 0.15, 0.8, 0.5);
        }
        
        particles.rotation.y += 0.001;
      }
      
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        const dist = Math.sqrt(x * x + y * y + z * z);
        const angle = t * 0.2 + dist * 0.1;
        positions[i] = x * Math.cos(0.001) - y * Math.sin(0.001);
        positions[i + 1] = x * Math.sin(0.001) + y * Math.cos(0.001);
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isScanning, hasResult, riskLevel]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute inset-0"
      style={{ touchAction: 'none' }}
    />
  );
}

function OrbitalChip({ 
  label, 
  value, 
  color, 
  baseAngle, 
  isActive,
  severity,
  orbitSpeed = 0.0003
}: { 
  label: string; 
  value: string; 
  color: string;
  baseAngle: number;
  isActive: boolean;
  severity: number;
  orbitSpeed?: number;
}) {
  const [currentAngle, setCurrentAngle] = useState(baseAngle);
  const radius = 180;
  
  useEffect(() => {
    if (!isActive) return;
    
    let animationId: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      setCurrentAngle(prev => prev + orbitSpeed * delta);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, orbitSpeed]);
  
  const x = Math.cos(currentAngle) * radius;
  const y = Math.sin(currentAngle) * radius;
  
  const glowIntensity = severity > 0.7 ? 'shadow-lg shadow-purple-500/50' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3, 
        scale: isActive ? 1 : 0.8,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`absolute left-1/2 top-1/2 pointer-events-auto ${glowIntensity}`}
      style={{ 
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <div 
        className={`bg-black/60 backdrop-blur-md border rounded-lg px-4 py-3 min-w-[140px] transition-all duration-300 hover:scale-110 cursor-pointer`}
        style={{ borderColor: `${color}40` }}
        data-testid={`chip-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">{label}</div>
        <div className="text-lg font-medium" style={{ color }}>{value}</div>
        {severity > 0.7 && (
          <motion.div 
            className="absolute inset-0 rounded-lg"
            style={{ 
              background: `linear-gradient(45deg, ${color}20, transparent)`,
              boxShadow: `0 0 20px ${color}40`
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

function TimelineRing({ 
  activeSegment, 
  onSegmentClick, 
  riskWindows,
  isActive
}: { 
  activeSegment: number;
  onSegmentClick: (index: number) => void;
  riskWindows: RiskWindow[];
  isActive: boolean;
}) {
  const radius = 240;
  
  const getRiskForSegment = (hours: number) => {
    return riskWindows.filter(r => r.timeHours <= hours).length > 0;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="-300 -300 600 600">
        <circle
          cx="0"
          cy="0"
          r={radius}
          fill="none"
          stroke="rgba(136, 85, 255, 0.1)"
          strokeWidth="2"
        />
        
        {timelineSegments.map((segment, index) => {
          const angle = (index / timelineSegments.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const hasRisk = getRiskForSegment(segment.hours);
          const isSelected = activeSegment === index;
          
          return (
            <g key={segment.label} className="pointer-events-auto cursor-pointer" onClick={() => onSegmentClick(index)}>
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 24 : 18}
                fill={isSelected ? "rgba(136, 85, 255, 0.3)" : "rgba(0, 0, 0, 0.5)"}
                stroke={hasRisk ? "#ff5555" : "#8855ff"}
                strokeWidth={isSelected ? 3 : 2}
                className="transition-all duration-300"
                data-testid={`timeline-${segment.label}`}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? "white" : "rgba(255,255,255,0.3)"}
                fontSize="11"
                fontFamily="monospace"
              >
                {segment.label}
              </text>
              {hasRisk && (
                <circle
                  cx={x}
                  cy={y - 28}
                  r="4"
                  fill="#ff5555"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function EventPanel({ 
  isOpen, 
  onClose, 
  riskWindow 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  riskWindow: RiskWindow | null;
}) {
  if (!riskWindow) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d1a]/95 backdrop-blur-xl border-t border-purple-500/30"
          data-testid="event-panel"
        >
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-red-400 text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  High Probability Event Detected
                </div>
                <div className="text-2xl font-light">
                  {riskWindow.timeHours} hours from now
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors p-2"
                data-testid="close-event-panel"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <div className="text-purple-300 text-sm mb-2">Detected Pattern:</div>
              <div className="text-white/80">{riskWindow.description}</div>
              <div className="mt-2 text-sm text-white/50">
                Confidence: {(riskWindow.confidence * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <button 
                className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 px-4 py-2 rounded-lg text-sm transition-colors"
                data-testid="add-to-watchlist"
              >
                Add to Watchlist
              </button>
              <button 
                className="bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                data-testid="send-alert"
              >
                Send Alert Notification
              </button>
              <button 
                className="bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                data-testid="view-similar-events"
              >
                View Similar Historical Events
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SimilarityExplorer({ 
  isOpen, 
  onClose, 
  cases 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  cases: SimilarCase[];
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-[#0d0d1a]/95 backdrop-blur-xl border-l border-purple-500/30 overflow-y-auto"
          data-testid="similarity-explorer"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light">Quantum Similarity Explorer</h3>
              <button 
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors p-2"
                data-testid="close-similarity-explorer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-white/50 text-sm mb-6">
              Historical behavior matches from the quantum prediction model
            </p>
            
            <div className="space-y-4">
              {cases.map((c, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/30 border border-white/10 rounded-lg p-4 hover:border-purple-500/30 transition-colors cursor-pointer"
                  data-testid={`similar-case-${index}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-purple-400 text-lg font-medium">
                      {(c.confidence * 100).toFixed(0)}% match
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      c.outcome === 'rug' ? 'bg-red-500/20 text-red-400' :
                      c.outcome === 'pump & dump' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {c.outcome}
                    </div>
                  </div>
                  <div className="text-white/50 text-sm">
                    Outcome within {c.timeframe}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="text-sm text-purple-300 mb-2">Pattern Analysis</div>
              <div className="text-white/60 text-sm">
                This address shows {cases.length} behavioral matches with historical events. 
                The quantum model suggests elevated monitoring is advised.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NebulaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: 0.1 + Math.random() * 0.3,
        opacity: 0.3 + Math.random() * 0.7
      });
    }
    
    let time = 0;
    let animationId: number;
    
    const animate = () => {
      time += 0.005;
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      gradient.addColorStop(0, '#1a0a2e');
      gradient.addColorStop(0.3, '#0d0d1a');
      gradient.addColorStop(0.6, '#050510');
      gradient.addColorStop(1, '#000005');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time) * 50,
        canvas.height * 0.4 + Math.cos(time * 0.7) * 30,
        0,
        canvas.width * 0.3,
        canvas.height * 0.4,
        300
      );
      nebulaGradient.addColorStop(0, 'rgba(136, 85, 255, 0.15)');
      nebulaGradient.addColorStop(0.5, 'rgba(68, 0, 170, 0.05)');
      nebulaGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const nebula2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(time * 0.5) * 40,
        canvas.height * 0.6 + Math.sin(time * 0.8) * 25,
        0,
        canvas.width * 0.7,
        canvas.height * 0.6,
        250
      );
      nebula2.addColorStop(0, 'rgba(68, 136, 255, 0.1)');
      nebula2.addColorStop(0.5, 'rgba(34, 68, 170, 0.03)');
      nebula2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
        
        const twinkle = Math.sin(time * 3 + star.x) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}

export default function PredictiveConsole() {
  const [address, setAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTimelineSegment, setActiveTimelineSegment] = useState(1);
  const [showEventPanel, setShowEventPanel] = useState(false);
  const [selectedRiskWindow, setSelectedRiskWindow] = useState<RiskWindow | null>(null);
  const [showSimilarityExplorer, setShowSimilarityExplorer] = useState(false);

  const handleScan = useCallback(async () => {
    if (!address.trim() || address.length < 32) {
      setError("Please enter a valid Solana address");
      return;
    }
    
    setIsScanning(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() })
      });
      
      if (!response.ok) {
        throw new Error('Prediction analysis failed');
      }
      
      const data = await response.json();
      setResult(data);
      
      if (data.riskWindows.length > 0) {
        setSelectedRiskWindow(data.riskWindows[0]);
      }
    } catch (err) {
      setError("Failed to analyze address. Please try again.");
    } finally {
      setIsScanning(false);
    }
  }, [address]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isScanning) {
      handleScan();
    }
  };

  const chipData = result ? [
    { 
      label: "Temporal Fragility", 
      value: `${(result.TFI * 100).toFixed(0)}%`, 
      color: result.TFI > 0.7 ? "#ff5555" : result.TFI > 0.5 ? "#ffaa55" : "#55ff88",
      severity: result.TFI
    },
    { 
      label: "Quantum Similarity", 
      value: `${(result.QSS * 100).toFixed(0)}%`, 
      color: result.QSS > 0.7 ? "#ff5555" : result.QSS > 0.5 ? "#ffaa55" : "#55ff88",
      severity: result.QSS
    },
    { 
      label: "Liquidity Safety", 
      value: `${(result.liquiditySafety * 100).toFixed(0)}%`, 
      color: result.liquiditySafety < 0.3 ? "#ff5555" : result.liquiditySafety < 0.5 ? "#ffaa55" : "#55ff88",
      severity: 1 - result.liquiditySafety
    },
    { 
      label: "Holder Symmetry", 
      value: result.holderSymmetry < 0.4 ? "Imbalanced" : result.holderSymmetry < 0.6 ? "Moderate" : "Balanced", 
      color: result.holderSymmetry < 0.4 ? "#ff5555" : result.holderSymmetry < 0.6 ? "#ffaa55" : "#55ff88",
      severity: 1 - result.holderSymmetry
    },
  ] : [];

  return (
    <div className="min-h-screen text-white font-mono overflow-hidden relative">
      <NebulaBackground />
      
      <div className="relative z-10">
        <div className="fixed top-6 left-6 z-30">
          <Link href="/" className="text-sm opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2" data-testid="back-to-nexus">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Nexus
          </Link>
        </div>

        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4">
          <motion.div 
            className="relative"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-1 shadow-2xl shadow-purple-500/20">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter wallet or token address..."
                    className="w-full bg-transparent border-none px-5 py-4 text-white placeholder-white/30 focus:outline-none font-mono text-sm"
                    disabled={isScanning}
                    data-testid="address-input"
                  />
                  {address && (
                    <motion.div 
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
                <button
                  onClick={handleScan}
                  disabled={isScanning || !address.trim()}
                  className="bg-purple-600/80 hover:bg-purple-500 disabled:bg-purple-900/50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-medium text-sm uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
                  data-testid="scan-button"
                >
                  {isScanning ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Run Prediction Scan"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-red-400 text-sm"
              data-testid="error-message"
            >
              {error}
            </motion.div>
          )}
        </div>

        <div className="h-screen flex items-center justify-center">
          <div className="relative w-[600px] h-[600px]">
            <QuantumOrb 
              isScanning={isScanning} 
              hasResult={!!result} 
              riskLevel={result?.TFI ?? 0} 
            />
            
            <TimelineRing
              activeSegment={activeTimelineSegment}
              onSegmentClick={(index) => {
                setActiveTimelineSegment(index);
                if (result?.riskWindows.length) {
                  const segment = timelineSegments[index];
                  const relevantRisk = result.riskWindows.find(r => r.timeHours <= segment.hours);
                  if (relevantRisk) {
                    setSelectedRiskWindow(relevantRisk);
                    setShowEventPanel(true);
                  }
                }
              }}
              riskWindows={result?.riskWindows ?? []}
              isActive={!!result}
            />
            
            {chipData.map((chip, index) => (
              <OrbitalChip
                key={chip.label}
                label={chip.label}
                value={chip.value}
                color={chip.color}
                baseAngle={(index / chipData.length) * Math.PI * 2 - Math.PI / 2}
                isActive={!!result}
                severity={chip.severity}
              />
            ))}
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 flex gap-4 z-20"
          >
            <button
              onClick={() => setShowEventPanel(true)}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-5 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
              data-testid="view-risk-events"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {result.riskWindows.length} Risk Events Detected
            </button>
            <button
              onClick={() => setShowSimilarityExplorer(true)}
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 px-5 py-3 rounded-xl text-sm transition-colors"
              data-testid="view-similar-cases"
            >
              View {result.similarPastCases.length} Similar Cases
            </button>
          </motion.div>
        )}

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex gap-6 text-xs opacity-40">
            <Link href="/orbiverse" className="hover:opacity-100 transition-opacity" data-testid="nav-orbiverse">Orbiverse</Link>
            <Link href="/docs" className="hover:opacity-100 transition-opacity" data-testid="nav-docs">Docs</Link>
            <Link href="/roadmap" className="hover:opacity-100 transition-opacity" data-testid="nav-roadmap">Roadmap</Link>
            <Link href="/contact" className="hover:opacity-100 transition-opacity" data-testid="nav-contact">Contact</Link>
          </div>
        </div>
      </div>

      <EventPanel
        isOpen={showEventPanel}
        onClose={() => setShowEventPanel(false)}
        riskWindow={selectedRiskWindow}
      />
      
      <SimilarityExplorer
        isOpen={showSimilarityExplorer}
        onClose={() => setShowSimilarityExplorer(false)}
        cases={result?.similarPastCases ?? []}
      />
    </div>
  );
}
