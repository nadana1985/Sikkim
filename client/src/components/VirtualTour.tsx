import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info,
  Volume2,
  VolumeX,
  Home
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  type: "artifact" | "ritual" | "architecture" | "history";
}

interface VirtualTourProps {
  monasteryName: string;
  monasteryId: string;
  panoramicImage: string;
  hotspots: Hotspot[];
}

export default function VirtualTour({ 
  monasteryName, 
  monasteryId, 
  panoramicImage, 
  hotspots 
}: VirtualTourProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const getHotspotColor = (type: string) => {
    switch (type) {
      case "artifact": return "bg-primary";
      case "ritual": return "bg-accent";
      case "architecture": return "bg-secondary";
      case "history": return "bg-muted";
      default: return "bg-primary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Tour Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">
            Virtual Tour: {monasteryName}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">360° Experience</Badge>
            <Badge variant="secondary">Interactive Hotspots</Badge>
          </div>
        </div>
        <Button asChild variant="outline" data-testid="button-back-monastery">
          <Link href={`/monastery/${monasteryId}`}>
            <Home className="h-4 w-4 mr-2" />
            Back to Monastery
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* 360° Viewer */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className={`relative ${isFullscreen ? 'h-screen' : 'h-96'} overflow-hidden rounded-lg bg-black`}>
                {/* Panoramic Image Container */}
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${panoramicImage})`,
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: 'center'
                  }}
                >
                  {/* Interactive Hotspots */}
                  {hotspots.map((hotspot) => (
                    <button
                      key={hotspot.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`
                      }}
                      onClick={() => setSelectedHotspot(hotspot)}
                      data-testid={`hotspot-${hotspot.id}`}
                    >
                      <div className={`w-4 h-4 ${getHotspotColor(hotspot.type)} rounded-full border-2 border-white shadow-lg animate-pulse group-hover:animate-none group-hover:scale-125 transition-transform`}>
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {hotspot.title}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Tour Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                    onClick={() => setRotation(rotation - 15)}
                    data-testid="button-rotate-left"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                    onClick={() => setRotation(rotation + 15)}
                    data-testid="button-rotate-right"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-white/30 mx-1" />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    data-testid="button-zoom-out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    data-testid="button-zoom-in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-white/30 mx-1" />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    data-testid="button-audio-toggle"
                  >
                    {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    data-testid="button-fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Hotspot Legend */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Artifacts</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span>Rituals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span>Architecture</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotspot Information Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedHotspot ? (
                <div className="space-y-4">
                  <div>
                    <Badge className={getHotspotColor(selectedHotspot.type)} variant="default">
                      {selectedHotspot.type.charAt(0).toUpperCase() + selectedHotspot.type.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {selectedHotspot.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedHotspot.description}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedHotspot(null)}
                    className="w-full"
                  >
                    Close Details
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Click on any glowing hotspot in the 360° view to learn more about artifacts, rituals, and architectural features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}