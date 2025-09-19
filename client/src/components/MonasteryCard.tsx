import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Eye, Clock } from "lucide-react";
import { Link } from "wouter";

interface MonasteryCardProps {
  id: string;
  name: string;
  location: string;
  foundedYear: number;
  image: string;
  description: string;
  rituals: string[];
  upcomingFestivals: Array<{
    name: string;
    date: string;
  }>;
  has360Tour: boolean;
}

export default function MonasteryCard({
  id,
  name,
  location,
  foundedYear,
  image,
  description,
  rituals,
  upcomingFestivals,
  has360Tour
}: MonasteryCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300">
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        {has360Tour && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            <Eye className="h-3 w-3 mr-1" />
            360° Tour
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-1" data-testid={`monastery-name-${id}`}>
              {name}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
              <Clock className="h-4 w-4 ml-3 mr-1" />
              <span>Founded {foundedYear}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Rituals */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Traditional Rituals
          </h4>
          <div className="flex flex-wrap gap-1">
            {rituals.slice(0, 3).map((ritual, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {ritual}
              </Badge>
            ))}
            {rituals.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{rituals.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Upcoming Festivals */}
        {upcomingFestivals.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Upcoming Festivals
            </h4>
            <div className="space-y-1">
              {upcomingFestivals.slice(0, 2).map((festival, index) => (
                <div key={index} className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="font-medium mr-2">{festival.name}</span>
                  <span>{festival.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild variant="default" size="sm" className="flex-1" data-testid={`button-explore-${id}`}>
            <Link href={`/monastery/${id}`}>
              Explore Monastery
            </Link>
          </Button>
          {has360Tour && (
            <Button asChild variant="outline" size="sm" data-testid={`button-tour-${id}`}>
              <Link href={`/monastery/${id}/tour`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}