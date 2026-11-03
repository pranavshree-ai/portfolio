import React, { useState, useEffect, useRef } from 'react';

export default function LoadingScreen({ onStartReveal, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('INITIALIZING ARCHITECTURE');
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onStartRevealRef = useRef(onStartReveal);
  onStartRevealRef.current = onStartReveal;

  useEffect(() => {
    // Attempt smooth autoplay of video
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {});
    }

    let animId;
    let startTimestamp = null;
    const duration = 4200; // Increased to 4.2s for a luxurious, complete infinity loop presentation

    const step = (timestamp) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const elapsed = timestamp - startTimestamp;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(pct);

      if (pct < 22) {
        setPhaseText('INITIALIZING ARCHITECTURE');
      } else if (pct < 45) {
        setPhaseText('LOADING NEURAL WEIGHTS');
      } else if (pct < 70) {
        setPhaseText('OPTIMIZING PRODUCTION ML RUNTIME');
      } else if (pct < 90) {
        setPhaseText('CALIBRATING VECTOR REASONING');
      } else if (pct < 100) {
        setPhaseText('SYSTEMS SYNCHRONIZED');
      } else {
        setPhaseText('EXPERIENCE READY');
      }

      if (elapsed < duration) {
        animId = requestAnimationFrame(step);
      } else {
        // Finished: Hold at 100% briefly so "EXPERIENCE READY" is seen, then trigger cinematic exit
        setTimeout(() => {
          setIsExiting(true);
          // Trigger portrait entrance and typing intro simultaneously as loader dissolves
          if (onStartRevealRef.current) {
            onStartRevealRef.current();
          }
          setTimeout(() => {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 850);
        }, 280);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Click anywhere to fast-skip after 0.8s
  const handleSkip = () => {
    if (progress > 20 && !isExiting) {
      setProgress(100);
      setPhaseText('EXPERIENCE READY');
      setIsExiting(true);
      if (onStartRevealRef.current) {
        onStartRevealRef.current();
      }
      setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
      }, 700);
    }
  };

  return (
    <div 
      className={`yaros-loader-overlay ${isExiting ? 'yaros-loader-exit' : ''}`}
      onClick={handleSkip}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Loading portfolio experience"
    >
      <div className="yaros-loader-center">
        
        {/* Ambient atmospheric backdrop glow */}
        <div className="yaros-loader-ambient-glow" aria-hidden="true"></div>

        {/* Glowing Infinity Shape Animation from Pinterest reference */}
        <div className="yaros-loader-infinity-wrap">
          <video
            ref={videoRef}
            className="yaros-loader-infinity-video"
            src="/videos/loading_infinity.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>

        {/* Sleek Metadata & Progress Tracking */}
        <div className="yaros-loader-meta">
          <div className="yaros-loader-brand">
            Pranav Jadhav
          </div>

          <div className="yaros-loader-track">
            <div 
              className="yaros-loader-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="yaros-loader-status-row">
            <span className="yaros-loader-status-text">{phaseText}</span>
            <span className="yaros-loader-percent">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Subtle bottom hint */}
      <div className="yaros-loader-hint">
        {progress > 40 && !isExiting ? 'CLICK ANYWHERE TO SKIP' : ''}
      </div>
    </div>
  );
}
