import "./terminal-card.css";

export default function PredictionTerminal() {
  return (
    <div className="pending-page" data-testid="prediction-terminal">
      <svg style={{ display: 'none' }}>
        <filter id="octave1">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" seed="1" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="octave2">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" seed="2" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      
      <div className="island"></div>
      <div className="islandt"></div>
      
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
