import Header from "@/components/Header";
import MonasteryCard from "@/components/MonasteryCard";
import FestivalCard from "@/components/FestivalCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Eye, Mountain, User, Clock } from "lucide-react";
import { Link } from "wouter";
// import { useAuth } from "@/hooks/useAuth"; // TODO: implement auth hook
import heroImage from '@assets/generated_images/Sikkim_monastery_hero_image_91581ecf.png'
import interiorImage from '@assets/generated_images/Monastery_interior_showcase_08244864.png'
import festivalImage from '@assets/generated_images/Festival_celebration_photo_2ceb16a8.png'

export default function Home() {
  // const { user } = useAuth(); // TODO: implement auth hook
  const user = { firstName: "Guest" }; // temporary placeholder

  //todo: remove mock functionality
  const recentlyViewed = [
    {
      id: "rumtek",
      name: "Rumtek Monastery",
      location: "Gangtok, East Sikkim",
      foundedYear: 1740,
      image: heroImage,
      description: "The largest monastery in Sikkim, also known as the Dharmachakra Centre.",
      rituals: ["Morning Prayers", "Butter Lamp Ceremony"],
      upcomingFestivals: [{ name: "Losar Festival", date: "Feb 12, 2024" }],
      has360Tour: true
    }
  ];

  const recommendedFestivals = [
    {
      id: "losar-2024",
      name: "Losar Festival",
      date: "February 12, 2024",
      monasteryName: "Rumtek Monastery",
      monasteryId: "rumtek",
      location: "Gangtok, East Sikkim",
      description: "The Tibetan New Year celebration featuring traditional dances and prayers.",
      image: festivalImage,
      duration: "3 days",
      significance: "Marks the beginning of the Tibetan lunar calendar year.",
      status: "upcoming" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />
      
      {/* Welcome Section */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Continue your spiritual journey through Sikkim's sacred monasteries.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" data-testid="button-my-profile">
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-sm text-muted-foreground">Monasteries Visited</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">2</div>
              <p className="text-sm text-muted-foreground">Virtual Tours Taken</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">5</div>
              <p className="text-sm text-muted-foreground">Festivals Attended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-sm text-muted-foreground">Days on Platform</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="py-8 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold">Recently Viewed</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/monasteries">View All</Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentlyViewed.map((monastery) => (
            <div key={monastery.id} className="relative">
              <Badge className="absolute top-3 left-3 z-10 bg-secondary text-secondary-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Recently Viewed
              </Badge>
              <MonasteryCard {...monastery} />
            </div>
          ))}
        </div>
      </section>

      {/* Recommended for You */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">Recommended Festivals</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/festivals">View Calendar</Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedFestivals.map((festival) => (
              <FestivalCard key={festival.id} {...festival} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="font-serif text-2xl font-bold mb-6">Quick Actions</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover-elevate transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Explore Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Discover monastery locations across Sikkim with interactive map features.
              </p>
              <Button asChild className="w-full">
                <Link href="/map">Open Map</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Virtual Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Take immersive 360° tours of monastery interiors and sacred spaces.
              </p>
              <Button asChild className="w-full">
                <Link href="/monastery/rumtek/tour">Start Tour</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Festival Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Stay updated with upcoming Buddhist festivals and cultural events.
              </p>
              <Button asChild className="w-full">
                <Link href="/festivals">View Calendar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}