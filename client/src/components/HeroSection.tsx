import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, MapPin, Calendar, Eye } from "lucide-react";
import { Link } from "wouter";

interface HeroSectionProps {
  backgroundImage?: string;
  isAuthenticated?: boolean;
}

export default function HeroSection({ 
  backgroundImage,
  isAuthenticated = false 
}: HeroSectionProps) {
  return (
    <div className="relative">
      {/* Hero Background */}
      <div 
        className="relative h-[70vh] min-h-[500px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <Badge className="mb-4 bg-primary/90 text-primary-foreground" data-testid="hero-badge">
              Discover Sacred Heritage
            </Badge>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Explore Sikkim's
              <br />
              <span className="text-primary-foreground">Ancient Monasteries</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Journey through centuries of Buddhist tradition with immersive 360° virtual tours, 
              detailed monastery profiles, and cultural festival calendars.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary border-primary-border text-primary-foreground hover:bg-primary/90"
                asChild
                data-testid="button-start-exploring"
              >
                <Link href="/monasteries">
                  <Play className="h-5 w-5 mr-2" />
                  Start Exploring
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                asChild
                data-testid="button-virtual-tour"
              >
                <Link href="/monastery/rumtek/tour">
                  <Eye className="h-5 w-5 mr-2" />
                  Take Virtual Tour
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative -mt-16 container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card/95 backdrop-blur-sm border-card-border hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Interactive Map</h3>
              <p className="text-muted-foreground text-sm">
                Discover monastery locations across Sikkim with detailed information and directions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm border-card-border hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">360° Virtual Tours</h3>
              <p className="text-muted-foreground text-sm">
                Experience monastery interiors with immersive panoramic views and interactive hotspots.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm border-card-border hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Festival Calendar</h3>
              <p className="text-muted-foreground text-sm">
                Stay updated with traditional Buddhist festivals and cultural celebrations throughout the year.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}