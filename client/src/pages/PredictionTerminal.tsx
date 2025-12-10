import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import "./terminal-card.css";

export default function PredictionTerminal() {
  const [progress, setProgress] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setLocation("/app");
          }, 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [setLocation]);

  return (
    <div className="pending-page" data-testid="prediction-terminal">
      <div className="island"></div>
      <div className="islandt"></div>
      <div className="hatch"></div>

      <svg height="0" width="0">
        <filter id="octave1">
          <feTurbulence type="fractalNoise" baseFrequency="0.0004" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0008" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0001" numOctaves={8} seed={4} result="o3"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0018" numOctaves={8} seed={4} result="o4"></feTurbulence>
          <feMerge result="finalIsland">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="finalIsland" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feTurbulence type="fractalNoise" baseFrequency="0.0008" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0016" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feMerge result="noiseo">
            <feMergeNode in="o2"></feMergeNode>
            <feMergeNode in="o4"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="noiseo" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feTurbulence type="fractalNoise" baseFrequency="0.0016" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.002" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feMerge result="noiseo">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="noiseo" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feDiffuseLighting in="noiseo" surfaceScale={12} diffuseConstant={1} lightingColor="#d7bb98" result="lit">
            <feDistantLight azimuth={90} elevation={0}></feDistantLight>
          </feDiffuseLighting>
          <feBlend in="lit" in2="SourceGraphic" mode="normal"></feBlend>
        </filter>

        <filter id="octave2">
          <feTurbulence type="fractalNoise" baseFrequency="0.0004" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0008" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0001" numOctaves={8} seed={4} result="o3"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0018" numOctaves={8} seed={4} result="o4"></feTurbulence>
          <feMerge result="finalIsland">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="finalIsland" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feTurbulence type="fractalNoise" baseFrequency="0.0008" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.0016" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feMerge result="noiseo">
            <feMergeNode in="o2"></feMergeNode>
            <feMergeNode in="o4"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="noiseo" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feTurbulence type="fractalNoise" baseFrequency="0.0016" numOctaves={8} seed={4} result="o1"></feTurbulence>
          <feTurbulence type="fractalNoise" baseFrequency="0.002" numOctaves={8} seed={4} result="o2"></feTurbulence>
          <feMerge result="noiseo">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>
          <feGaussianBlur in="noiseo" stdDeviation="5" result="noiseo"></feGaussianBlur>
          <feDiffuseLighting in="noiseo" surfaceScale={12} diffuseConstant={1} lightingColor="#d1bf96" result="lit">
            <feDistantLight azimuth={-90} elevation={0}></feDistantLight>
          </feDiffuseLighting>
          <feBlend in="lit" in2="SourceGraphic" mode="normal"></feBlend>
        </filter>
      </svg>
      
      <div className="pending-content">
        <div className="pending-wrapper">
          <img src="/logo.png" alt="SADS Logo" style={{ width: '50px', height: 'auto', marginBottom: '1rem' }} />
          
          <div className="loading-container">
            <div className="loading-label">Initializing SADS Protocol</div>
            <div className="loading-bar-wrapper">
              <div className="loading-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="loading-percent">{Math.floor(progress)}%</div>
          </div>
        </div>
      </div>
      
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
          <feColorMatrix
            values="1 0 0 0 0 
                    0 1 0 0 0 
                    0 0 1 0 0 
                    0 0 0 3 0"
          ></feColorMatrix>
        </filter>
      </svg>
    </div>
  );
}
