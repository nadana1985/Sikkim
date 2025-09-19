import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MonasteryCard from "@/components/MonasteryCard";
import FestivalCard from "@/components/FestivalCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Eye, Mountain } from "lucide-react";
import { Link } from "wouter";
import heroImage from '@assets/generated_images/Sikkim_monastery_hero_image_91581ecf.png'
import interiorImage from '@assets/generated_images/Monastery_interior_showcase_08244864.png'
import architectureImage from '@assets/generated_images/Monastery_architecture_detail_00f549cd.png'
import festivalImage from '@assets/generated_images/Festival_celebration_photo_2ceb16a8.png'

export default function Landing() {
  //todo: remove mock functionality
  const featuredMonasteries = [
    {
      id: "rumtek",
      name: "Rumtek Monastery",
      location: "Gangtok, East Sikkim",
      foundedYear: 1740,
      image: heroImage,
      description: "The largest monastery in Sikkim, also known as the Dharmachakra Centre. Famous for its golden stupa and traditional Tibetan architecture.",
      rituals: ["Morning Prayers", "Butter Lamp Ceremony", "Cham Dance"],
      upcomingFestivals: [
        { name: "Losar Festival", date: "Feb 12, 2024" }
      ],
      has360Tour: true
    },
    {
      id: "pemayangtse",
      name: "Pemayangtse Monastery",
      location: "Pelling, West Sikkim",
      foundedYear: 1705,
      image: interiorImage,
      description: "One of the oldest and most important monasteries in Sikkim, offering stunning views of Kanchenjunga.",
      rituals: ["Tantric Rituals", "Chanting Sessions"],
      upcomingFestivals: [],
      has360Tour: true
    }
  ];

  const upcomingFestivals = [
    {
      id: "losar-2024",
      name: "Losar Festival",
      date: "February 12, 2024",
      monasteryName: "Rumtek Monastery",
      monasteryId: "rumtek",
      location: "Gangtok, East Sikkim",
      description: "The Tibetan New Year celebration featuring traditional dances, prayers, and community gatherings.",
      image: festivalImage,
      duration: "3 days",
      significance: "Marks the beginning of the Tibetan lunar calendar year and celebrates the triumph of good over evil.",
      status: "upcoming" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={false} />
      
      {/* Hero Section */}
      <HeroSection backgroundImage={heroImage} isAuthenticated={false} />
      
      {/* Featured Monasteries Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold mb-4">Featured Monasteries</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the most significant Buddhist monasteries in Sikkim, each with centuries of spiritual heritage and cultural treasures.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {featuredMonasteries.map((monastery) => (
            <MonasteryCard key={monastery.id} {...monastery} />
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" data-testid="button-view-all-monasteries">
            <Link href="/monasteries">
              <Mountain className="h-5 w-5 mr-2" />
              View All Monasteries
            </Link>
          </Button>
        </div>
      </section>

      {/* Upcoming Festivals Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">Upcoming Festivals</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the vibrant cultural celebrations and traditional Buddhist festivals throughout the year.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {upcomingFestivals.map((festival) => (
              <FestivalCard key={festival.id} {...festival} />
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg" data-testid="button-view-festival-calendar">
              <Link href="/festivals">
                <Calendar className="h-5 w-5 mr-2" />
                View Festival Calendar
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-4">
              Experience Sacred Heritage Digitally
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Join thousands of visitors exploring Sikkim's monasteries through our platform. 
              Discover spiritual traditions, plan your visits, and immerse yourself in 360° virtual tours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/map">
                  <MapPin className="h-5 w-5 mr-2" />
                  Explore Map
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/monastery/rumtek/tour">
                  <Eye className="h-5 w-5 mr-2" />
                  Virtual Tour Demo
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mountain className="h-5 w-5 mr-2 text-primary" />
                  47 Monasteries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive profiles of Buddhist monasteries across all four districts of Sikkim.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  360° Tours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Immersive virtual experiences with interactive hotspots and detailed information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}