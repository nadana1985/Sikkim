'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Home, Maximize, Minimize, Info, X, MapPin } from 'lucide-react';
import type { TourHotspot } from '@/types';

interface PanoramaViewerProps {
  imageUrl: string;
  hotspots?: TourHotspot[];
  onHotspotClick?: (hotspot: TourHotspot) => void;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export default function PanoramaViewer({ imageUrl, hotspots = [], onHotspotClick, onLoad, onError }: PanoramaViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  // Pointer state
  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0);

  // Inertia state (for momentum after release)
  const velocityLonRef = useRef(0);
  const velocityLatRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerYRef = useRef(0);
  const lastPointerTimeRef = useRef(0);

  // Pinch-to-zoom state
  const initialPinchDistanceRef = useRef(0);
  const initialFovRef = useRef(75);
  const isPinchingRef = useRef(false);

  // Double-tap state
  const lastTapTimeRef = useRef(0);
  const lastTapXRef = useRef(0);
  const lastTapYRef = useRef(0);

  // Hotspot refs — avoid React re-renders at 60fps
  const hotspotsRef = useRef<TourHotspot[]>(hotspots);
  const onHotspotClickRef = useRef(onHotspotClick);
  const hotspotContainerRef = useRef<HTMLDivElement>(null);
  const hotspotElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const hotspotPositionsRef = useRef<Map<string, { x: number; y: number; visible: boolean }>>(new Map());
  const projectionVecRef = useRef<THREE.Vector3 | null>(null);

  // Keep refs in sync with props
  hotspotsRef.current = hotspots;
  onHotspotClickRef.current = onHotspotClick;

  // Clean up stale positions when hotspots change (runs once per change, not at 60fps)
  useEffect(() => {
    const currentIds = new Set(hotspots.map(h => h.id));
    for (const key of hotspotPositionsRef.current.keys()) {
      if (!currentIds.has(key)) {
        hotspotPositionsRef.current.delete(key);
      }
    }
  }, [hotspots]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  // Detect WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        setIsLoading(false);
        onError?.('WebGL is not supported on this device');
      }
    } catch {
      setWebglSupported(false);
      setIsLoading(false);
      onError?.('WebGL detection failed');
    }
  }, [onError]);

  // Fullscreen change listener
  const handleFullscreenChange = useCallback(() => {
    const fullscreenElement = document.fullscreenElement;
    setIsFullscreen(!!fullscreenElement);

    // Trigger resize after fullscreen change to update renderer
    if (rendererRef.current && cameraRef.current && mountRef.current) {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
        return;
      }

      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      switch (event.key) {
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case 'ArrowLeft':
          rotateLeft();
          break;
        case 'ArrowRight':
          rotateRight();
          break;
        case 'r':
        case 'R':
          resetView();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'h':
        case 'H':
          setShowHelp(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mountRef.current || !webglSupported) return;

    // Lazy-init the reusable projection vector (avoids Three.js import at component level)
    if (!projectionVecRef.current) {
      projectionVecRef.current = new THREE.Vector3();
    }
    const projectionVec = projectionVecRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      1,
      1100
    );
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Sphere geometry for panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the geometry on the x-axis so that all the faces point inward

    // Load texture
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        sphereRef.current = sphere;
        setIsLoading(false);
        onLoad?.();
      },
      undefined,
      (err) => {
        console.error('Error loading panorama texture:', err);
        setError('Failed to load panorama image');
        setIsLoading(false);
        onError?.('Failed to load panorama image');
      }
    );

    // Track pointer state for inertia calculation
    const trackVelocity = (clientX: number, clientY: number) => {
      const now = performance.now();
      const dt = now - lastPointerTimeRef.current;
      if (dt > 0 && dt < 100) {
        const dx = clientX - lastPointerXRef.current;
        const dy = clientY - lastPointerYRef.current;
        velocityLonRef.current = -dx * 0.1 / (dt / 16);
        velocityLatRef.current = dy * 0.1 / (dt / 16);
      }
      lastPointerXRef.current = clientX;
      lastPointerYRef.current = clientY;
      lastPointerTimeRef.current = now;
    };

    // Calculate distance between two touch points
    const getTouchDistance = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Event handlers
    const onPointerDown = (event: PointerEvent) => {
      if (isPinchingRef.current) return;
      event.preventDefault();
      isUserInteractingRef.current = true;
      onPointerDownPointerXRef.current = event.clientX;
      onPointerDownPointerYRef.current = event.clientY;
      onPointerDownLonRef.current = lonRef.current;
      onPointerDownLatRef.current = latRef.current;
      lastPointerXRef.current = event.clientX;
      lastPointerYRef.current = event.clientY;
      lastPointerTimeRef.current = performance.now();
      velocityLonRef.current = 0;
      velocityLatRef.current = 0;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (isPinchingRef.current) return;
      if (!isUserInteractingRef.current) return;

      lonRef.current = (onPointerDownPointerXRef.current - event.clientX) * 0.1 + onPointerDownLonRef.current;
      latRef.current = (event.clientY - onPointerDownPointerYRef.current) * 0.1 + onPointerDownLatRef.current;

      trackVelocity(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      event.preventDefault();
      isUserInteractingRef.current = false;
      isPinchingRef.current = false;
      renderer.domElement.releasePointerCapture(event.pointerId);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.fov += event.deltaY * 0.05;
      camera.fov = Math.max(10, Math.min(75, camera.fov));
      camera.updateProjectionMatrix();
    };

    // Touch event handlers for pinch-to-zoom and double-tap
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        isPinchingRef.current = true;
        isUserInteractingRef.current = false;
        initialPinchDistanceRef.current = getTouchDistance(event.touches);
        initialFovRef.current = camera.fov;
        event.preventDefault();
      } else if (event.touches.length === 1) {
        const now = performance.now();
        const tapX = event.touches[0].clientX;
        const tapY = event.touches[0].clientY;
        const timeSinceLastTap = now - lastTapTimeRef.current;
        const distFromLastTap = Math.sqrt(
          Math.pow(tapX - lastTapXRef.current, 2) + Math.pow(tapY - lastTapYRef.current, 2)
        );

        if (timeSinceLastTap < 300 && distFromLastTap < 30) {
          if (camera.fov > 40) {
            camera.fov = Math.max(10, camera.fov - 30);
          } else {
            camera.fov = 75;
          }
          camera.updateProjectionMatrix();
          lastTapTimeRef.current = 0;
          event.preventDefault();
        } else {
          lastTapTimeRef.current = now;
          lastTapXRef.current = tapX;
          lastTapYRef.current = tapY;
        }
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2 && isPinchingRef.current) {
        const currentDistance = getTouchDistance(event.touches);
        const scale = initialPinchDistanceRef.current / currentDistance;
        camera.fov = Math.max(10, Math.min(75, initialFovRef.current * scale));
        camera.updateProjectionMatrix();
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) {
        isPinchingRef.current = false;
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // Animation loop with inertia
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isUserInteractingRef.current) {
        if (Math.abs(velocityLonRef.current) > 0.01 || Math.abs(velocityLatRef.current) > 0.01) {
          lonRef.current += velocityLonRef.current;
          latRef.current += velocityLatRef.current;
          velocityLonRef.current *= 0.95;
          velocityLatRef.current *= 0.95;
        } else {
          lonRef.current += 0.1;
          velocityLonRef.current = 0;
          velocityLatRef.current = 0;
        }
      }

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      camera.position.x = 100 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      camera.position.y = 100 * Math.cos(phiRef.current);
      camera.position.z = 100 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);

      // Project hotspots to 2D — update DOM directly to avoid React re-renders at 60fps
      const hsList = hotspotsRef.current;
      if (hsList.length > 0 && mountRef.current && hotspotContainerRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;          const vec = projectionVec;

        for (const hs of hsList) {
          const hsPhi = THREE.MathUtils.degToRad(90 - hs.position.lat);
          const hsTheta = THREE.MathUtils.degToRad(hs.position.lon);
          vec.set(
            100 * Math.sin(hsPhi) * Math.cos(hsTheta),
            100 * Math.cos(hsPhi),
            100 * Math.sin(hsPhi) * Math.sin(hsTheta),
          );
          vec.project(camera);

          const screenX = ((vec.x + 1) / 2) * width;
          const screenY = ((-vec.y + 1) / 2) * height;
          const visible = vec.z < 1 && screenX > -50 && screenX < width + 50 && screenY > -50 && screenY < height + 50;

          // Update DOM position directly — no React state update
          const el = hotspotElementsRef.current.get(hs.id);
          if (el) {
            const prev = hotspotPositionsRef.current.get(hs.id);
            const moved = !prev || Math.abs(prev.x - screenX) > 0.5 || Math.abs(prev.y - screenY) > 0.5 || prev.visible !== visible;
            if (moved) {
              el.style.left = `${screenX}px`;
              el.style.top = `${screenY}px`;
              el.style.display = visible ? 'block' : 'none';
              hotspotPositionsRef.current.set(hs.id, { x: screenX, y: screenY, visible });
            }
          }
        }
      }
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;

      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [imageUrl, onLoad, onError, webglSupported]);

  const resetView = () => {
    lonRef.current = 0;
    latRef.current = 0;
    if (cameraRef.current) {
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.max(10, cameraRef.current.fov - 5);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.min(75, cameraRef.current.fov + 5);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const rotateLeft = () => {
    lonRef.current -= 10;
  };

  const rotateRight = () => {
    lonRef.current += 10;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as HTMLDivElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
        (container as HTMLDivElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as Document & { webkitExitFullscreen?: () => void }).webkitExitFullscreen) {
        (document as Document & { webkitExitFullscreen: () => void }).webkitExitFullscreen();
      }
    }
  };

  // WebGL not supported fallback
  if (!webglSupported) {
    return (
      <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Maximize className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            3D View Not Available
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your device doesn&apos;t support WebGL, which is required for 360° virtual tours.
            Please try using a modern browser on a desktop or mobile device with GPU acceleration enabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black overflow-hidden touch-none select-none ${
        isFullscreen ? 'rounded-none' : 'rounded-lg'
      }`}
    >
      <div ref={mountRef} className="w-full h-full" />

      {/* Hotspot markers — rendered once, positioned via refs in animation loop */}
      <div ref={hotspotContainerRef} className="absolute inset-0 pointer-events-none z-20">
        {hotspots.map((hs) => (
          <button
            key={hs.id}
            ref={(el) => {
              if (el) hotspotElementsRef.current.set(hs.id, el);
              else hotspotElementsRef.current.delete(hs.id);
            }}
            className="absolute pointer-events-auto group"
            style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)', display: 'none' }}
            onClick={(e) => {
              e.stopPropagation();
              onHotspotClickRef.current?.(hs);
            }}
            aria-label={`Navigate to: ${hs.label}`}
            title={hs.label}
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping" aria-hidden="true" />
            {/* Marker dot */}
            <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white shadow-lg border-2 border-white/80 hover:bg-orange-500 hover:scale-110 transition-all">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            {/* Tooltip label */}
            <span className="absolute left-1/2 -translate-x-1/2 -top-10 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {hs.label}
            </span>
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading 360° experience...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      {!isLoading && !error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-lg p-2 pointer-events-auto">
          <button
            onClick={rotateLeft}
            className="p-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-white/10"
            title="Rotate Left (←)"
            aria-label="Rotate left"
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <button
            onClick={rotateRight}
            className="p-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-white/10"
            title="Rotate Right (→)"
            aria-label="Rotate right"
          >
            <RotateCw className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <div className="w-px h-6 bg-white/20 mx-1" />
          
          <button
            onClick={zoomIn}
            className="p-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-white/10"
            title="Zoom In (+)"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <button
            onClick={zoomOut}
            className="p-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-white/10"
            title="Zoom Out (-)"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <div className="w-px h-6 bg-white/20 mx-1" />
          
          <button
            onClick={resetView}
            className="p-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-white/10"
            title="Reset View (R)"
            aria-label="Reset view"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:text-orange-400 transition-colors rounded-md hover:bg-white/10"
            title={isFullscreen ? 'Exit Fullscreen (F / Esc)' : 'Fullscreen (F)'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Maximize className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <div className="w-px h-6 bg-white/20 mx-1" />
          
          <button
            onClick={() => setShowHelp(prev => !prev)}
            className={`p-2 transition-colors rounded-md ${
              showHelp ? 'text-orange-400 bg-white/10' : 'text-white hover:text-orange-400 hover:bg-white/10'
            }`}
            title="Keyboard Shortcuts (H)"
            aria-label="Toggle help"
          >
            <Info className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Help overlay */}
      {showHelp && !isLoading && !error && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg text-sm max-w-xs z-10 pointer-events-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Controls</h4>
            <button
              onClick={() => setShowHelp(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-white/80">
            <p><span className="text-orange-400 font-mono text-xs">Drag</span> — Look around</p>
            <p><span className="text-orange-400 font-mono text-xs">Scroll</span> — Zoom in/out</p>
            <p><span className="text-orange-400 font-mono text-xs">← →</span> — Rotate</p>
            <p><span className="text-orange-400 font-mono text-xs">+ -</span> — Zoom</p>
            <p><span className="text-orange-400 font-mono text-xs">R</span> — Reset view</p>
            <p><span className="text-orange-400 font-mono text-xs">F</span> — Toggle fullscreen</p>
            <p><span className="text-orange-400 font-mono text-xs">Esc</span> — Exit fullscreen</p>
            <p><span className="text-orange-400 font-mono text-xs">H</span> — Toggle this help</p>
            <div className="border-t border-white/20 pt-2 mt-2">
              <p className="text-xs text-white/50 mb-1">Mobile:</p>
              <p><span className="text-orange-400 font-mono text-xs">Pinch</span> — Zoom in/out</p>
              <p><span className="text-orange-400 font-mono text-xs">Double-tap</span> — Toggle zoom</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isLoading && !error && !showHelp && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg text-sm max-w-xs animate-pulse pointer-events-none">
          <p className="mb-1">🖱️ Drag to look around</p>
          <p className="mb-1">🖲️ Scroll to zoom</p>
          <p className="mb-1 sm:hidden">📱 Pinch to zoom • Double-tap to toggle</p>
          <p>Press <span className="text-orange-400 font-mono">H</span> for all shortcuts</p>
        </div>
      )}
    </div>
  );
}
