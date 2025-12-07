import "./terminal-card.css";

export default function PredictionTerminal() {
  return (
    <div className="pending-page" data-testid="prediction-terminal">
      <div className="island"></div>
      <div className="islandt"></div>
      <div className="hatch"></div>

      <svg height="0" width="0">
        <filter id="octave1">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0004"
            numOctaves={8}
            seed={4}
            result="o1"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0008"
            numOctaves={8}
            seed={4}
            result="o2"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0001"
            numOctaves={8}
            seed={4}
            result="o3"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0018"
            numOctaves={8}
            seed={4}
            result="o4"
          ></feTurbulence>

          <feMerge result="finalIsland">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
          </feMerge>

          <feGaussianBlur
            in="finalIsland"
            stdDeviation="5"
            result="noiseo"
          ></feGaussianBlur>

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0008"
            numOctaves={8}
            seed={4}
            result="o1"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0016"
            numOctaves={8}
            seed={4}
            result="o2"
          ></feTurbulence>

          <feMerge result="noiseo">
            <feMergeNode in="o2"></feMergeNode>
            <feMergeNode in="o4"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>

          <feGaussianBlur
            in="noiseo"
            stdDeviation="5"
            result="noiseo"
          ></feGaussianBlur>

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0016"
            numOctaves={8}
            seed={4}
            result="o1"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.002"
            numOctaves={8}
            seed={4}
            result="o2"
          ></feTurbulence>

          <feMerge result="noiseo">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>

          <feGaussianBlur
            in="noiseo"
            stdDeviation="5"
            result="noiseo"
          ></feGaussianBlur>

          <feDiffuseLighting
            in="noiseo"
            surfaceScale={12}
            diffuseConstant={1}
            lightingColor="#d7bb98"
            result="lit"
          >
            <feDistantLight azimuth={90} elevation={0}></feDistantLight>
          </feDiffuseLighting>

          <feBlend in="lit" in2="SourceGraphic" mode="normal"></feBlend>
        </filter>

        <filter id="octave2">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0004"
            numOctaves={8}
            seed={4}
            result="o1"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0008"
            numOctaves={8}
            seed={4}
            result="o2"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0001"
            numOctaves={8}
            seed={4}
            result="o3"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0018"
            numOctaves={8}
            seed={4}
            result="o4"
          ></feTurbulence>

          <feMerge result="finalIsland">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o3"></feMergeNode>
          </feMerge>

          <feGaussianBlur
            in="finalIsland"
            stdDeviation="5"
            result="noiseo"
          ></feGaussianBlur>

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0008"
            numOctaves={8}
            seed={4}
            result="o1"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0016"
            numOctaves={8}
            seed={4}
            result="o2"
          ></feTurbulence>

          <feMerge result="noiseo">
            <feMergeNode in="o2"></feMergeNode>
            <feMergeNode in="o4"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>

          <feGaussianBlur
            in="noiseo"
            stdDeviation="5"
            result="noiseo"
          ></feGaussianBlur>

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0016"
            numOctaves={8}
            seed={4}
            result="o1"
          ></feTurbulence>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.002"
            numOctaves={8}
            seed={4}
            result="o2"
          ></feTurbulence>

          <feMerge result="noiseo">
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="o1"></feMergeNode>
            <feMergeNode in="noiseo"></feMergeNode>
          </feMerge>

          <feGaussianBlur
            in="noiseo"
            stdDeviation="5"
            result="noiseo"
          ></feGaussianBlur>

          <feDiffuseLighting
            in="noiseo"
            surfaceScale={12}
            diffuseConstant={1}
            lightingColor="#d1bf96"
            result="lit"
          >
            <feDistantLight azimuth={-90} elevation={0}></feDistantLight>
          </feDiffuseLighting>

          <feBlend in="lit" in2="SourceGraphic" mode="normal"></feBlend>
        </filter>
      </svg>
      
      <div className="pending-content">
        <div className="card">
          <div className="wrap">
            <div className="terminal">
              <div className="head">
                <div className="title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" y1="19" x2="20" y2="19"></line>
                  </svg>
                  <span>terminal</span>
                </div>
              </div>
              <div className="body">
                <div className="pre">
                  <code>~ </code>
                  <code className="cmd" data-cmd="$sads launch pending"></code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
