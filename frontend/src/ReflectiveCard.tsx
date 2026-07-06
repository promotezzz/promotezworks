import React, { useEffect, useRef, useState } from 'react';
import './ReflectiveCard.css';
import { Fingerprint, Activity, Lock } from 'lucide-react';

interface ReflectiveCardProps {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: React.CSSProperties;
  /* custom content */
  badge?: string;
  title?: string;
  subtitle?: string;
  idLabel?: string;
  idValue?: string;
  imageUrl?: string;
}

const ReflectiveCard: React.FC<ReflectiveCardProps> = ({
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(255, 255, 255, 0.1)',
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  className = '',
  style = {},
  badge = 'SECURE ACCESS',
  title = 'PROMOTEZWORKS',
  subtitle = 'MOD DEVELOPMENT',
  idLabel = 'ID NUMBER',
  idValue = '0001-2345-6789',
  imageUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setStreamActive] = useState(false);

  useEffect(() => {
    if (imageUrl) return;

    let stream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    startWebcam();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, [imageUrl]);

  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation,
  } as React.CSSProperties;

  return (
    <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id={`metallic-displacement-${title.replace(/\s/g, '')}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacementStrength} xChannelSelector="R" yChannelSelector="G" result="rippled" />
            <feSpecularLighting in="noiseAlpha" surfaceScale={displacementStrength} specularConstant={specularConstant} specularExponent="20" lightingColor="#ffffff" result="light">
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="solidAlpha" />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap in="metallic-result" in2="glassMap" scale={glassDistortion} xChannelSelector="A" yChannelSelector="A" result="final" />
          </filter>
        </defs>
      </svg>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="reflective-video"
          style={{
            objectFit: 'cover',
            transform: 'none',
            filter: 'none',
            opacity: 0.95
          }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="reflective-video"
          style={{ filter: `saturate(${saturation}) contrast(120%) brightness(110%) blur(${blurStrength}px) url(#metallic-displacement-${title.replace(/\s/g, '')})` }}
        />
      )}

      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            <Lock size={14} className="security-icon" />
            <span>{badge}</span>
          </div>
          <Activity className="status-icon" size={20} />
        </div>

        <div className="card-body">
          <div className="user-info">
            <h2 className="user-name">{title}</h2>
            <p className="user-role">{subtitle}</p>
          </div>
        </div>

        {idLabel && (
          <div className="card-footer">
            <div className="id-section">
              <span className="label">{idLabel}</span>
              <span className="value">{idValue}</span>
            </div>
            <div className="fingerprint-section">
              <Fingerprint size={32} className="fingerprint-icon" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectiveCard;
