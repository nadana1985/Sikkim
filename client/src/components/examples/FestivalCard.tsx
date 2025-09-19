import FestivalCard from '../FestivalCard'
import festivalImage from '@assets/generated_images/Festival_celebration_photo_2ceb16a8.png'
import heroImage from '@assets/generated_images/Sikkim_monastery_hero_image_91581ecf.png'

export default function FestivalCardExample() {
  //todo: remove mock functionality
  const sampleFestivals = [
    {
      id: "losar-2024",
      name: "Losar Festival",
      date: "February 12, 2024",
      monasteryName: "Rumtek Monastery",
      monasteryId: "rumtek",
      location: "Gangtok, East Sikkim",
      description: "The Tibetan New Year celebration featuring traditional dances, prayers, and community gatherings. Experience the vibrant Cham dances performed by monks in colorful masks.",
      image: festivalImage,
      duration: "3 days",
      significance: "Marks the beginning of the Tibetan lunar calendar year and celebrates the triumph of good over evil through ritual dances and prayers.",
      status: "upcoming" as const
    },
    {
      id: "saga-dawa-2024",
      name: "Saga Dawa Festival",
      date: "June 15, 2024",
      monasteryName: "Pemayangtse Monastery",
      monasteryId: "pemayangtse",
      location: "Pelling, West Sikkim",
      description: "Sacred month commemorating Buddha's birth, enlightenment, and nirvana. Pilgrims circumambulate the monastery and participate in merit-making activities.",
      image: heroImage,
      duration: "1 month",
      significance: "The most holy month in Buddhist calendar when merit from good deeds is multiplied many times over.",
      status: "ongoing" as const
    },
    {
      id: "bhumchu-2023",
      name: "Bhumchu Ceremony",
      date: "March 8, 2023",
      monasteryName: "Tashiding Monastery",
      monasteryId: "tashiding",
      location: "Yuksom, West Sikkim",
      description: "Sacred water ceremony where holy water is distributed to devotees. The water level in the pot is believed to predict the year's fortune.",
      image: festivalImage,
      duration: "1 day",
      significance: "Ancient ceremony that foretells the prosperity and challenges of the coming year through sacred water levels.",
      status: "past" as const
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sampleFestivals.map((festival) => (
        <FestivalCard key={festival.id} {...festival} />
      ))}
    </div>
  )
}