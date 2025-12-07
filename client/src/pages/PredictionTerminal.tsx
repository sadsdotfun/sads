import "./terminal-card.css";

export default function PredictionTerminal() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center" data-testid="prediction-terminal">
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
  );
}
