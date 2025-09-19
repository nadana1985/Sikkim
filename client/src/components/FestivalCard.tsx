import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Link } from "wouter";

interface FestivalCardProps {
  id: string;
  name: string;
  date: string;
  monasteryName: string;
  monasteryId: string;
  location: string;
  description: string;
  image: string;
  duration: string;
  significance: string;
  status: "upcoming" | "ongoing" | "past";
}

export default function FestivalCard({
  id,
  name,
  date,
  monasteryName,
  monasteryId,
  location,
  description,
  image,
  duration,
  significance,
  status
}: FestivalCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "upcoming": return "bg-accent text-accent-foreground";
      case "ongoing": return "bg-primary text-primary-foreground";
      case "past": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300">
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-3 right-3 ${getStatusColor()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2" data-testid={`festival-name-${id}`}>
              {name}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="font-medium">{date}</span>
              <Clock className="h-4 w-4 ml-3 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-sm text-muted-foreground hover:text-primary"
                asChild
              >
                <Link href={`/monastery/${monasteryId}`}>
                  {monasteryName}, {location}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Significance */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Cultural Significance
          </h4>
          <p className="text-sm text-foreground line-clamp-2">
            {significance}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            asChild 
            variant="default" 
            size="sm" 
            className="flex-1"
            data-testid={`button-festival-details-${id}`}
          >
            <Link href={`/festival/${id}`}>
              <Users className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            data-testid={`button-monastery-${monasteryId}`}
          >
            <Link href={`/monastery/${monasteryId}`}>
              Visit Monastery
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}