import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mountain, Navigation, Eye } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface Monastery {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  foundedYear: number;
  image: string;
  description: string;
  has360Tour: boolean;
}

interface MonasteryMapProps {
  monasteries: Monastery[];
}

export default function MonasteryMap({ monasteries }: MonasteryMapProps) {
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null);
  
  // Mock map view with clickable monastery markers
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Map Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mountain className="h-5 w-5 mr-2 text-primary" />
              Monastery Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock Map Interface */}
            <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg overflow-hidden">
              {/* Background Pattern to simulate map */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" className="text-muted-foreground">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Mountain Range Silhouette */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-300 to-transparent dark:from-gray-700" 
                   style={{clipPath: "polygon(0 100%, 15% 40%, 35% 60%, 50% 20%, 70% 45%, 85% 30%, 100% 50%, 100% 100%)"}} />
              
              {/* Monastery Markers */}
              {monasteries.map((monastery, index) => (
                <button
                  key={monastery.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 hover-elevate transition-all duration-200"
                  style={{
                    left: `${30 + (index * 15)}%`,
                    top: `${40 + (index % 2 * 20)}%`
                  }}
                  onClick={() => setSelectedMonastery(monastery)}
                  data-testid={`map-marker-${monastery.id}`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <Mountain className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {monastery.has360Tour && (
                      <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-accent text-accent-foreground">
                        <Eye className="h-2 w-2" />
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
              
              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="outline" className="bg-background/90 backdrop-blur-sm">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Map Legend */}
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <span>Monastery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded-full relative">
                    <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-accent">
                      <Eye className="h-1.5 w-1.5" />
                    </Badge>
                  </div>
                  <span>360° Tour Available</span>
                </div>
              </div>
              <span>Click markers to view details</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monastery Details Panel */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>
              {selectedMonastery ? "Monastery Details" : "Select a Monastery"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMonastery ? (
              <div className="space-y-4">
                <img 
                  src={selectedMonastery.image} 
                  alt={selectedMonastery.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-1">
                    {selectedMonastery.name}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedMonastery.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Founded in {selectedMonastery.foundedYear}
                  </p>
                  <p className="text-sm line-clamp-3 mb-4">
                    {selectedMonastery.description}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/monastery/${selectedMonastery.id}`}>
                      Explore
                    </Link>
                  </Button>
                  {selectedMonastery.has360Tour && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/monastery/${selectedMonastery.id}/tour`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Mountain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Click on any monastery marker on the map to view its details and explore options.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}