import MonasteryCard from '../MonasteryCard'
import heroImage from '@assets/generated_images/Sikkim_monastery_hero_image_91581ecf.png'
import interiorImage from '@assets/generated_images/Monastery_interior_showcase_08244864.png'
import architectureImage from '@assets/generated_images/Monastery_architecture_detail_00f549cd.png'

export default function MonasteryCardExample() {
  //todo: remove mock functionality
  const sampleMonasteries = [
    {
      id: "rumtek",
      name: "Rumtek Monastery",
      location: "Gangtok, East Sikkim",
      foundedYear: 1740,
      image: heroImage,
      description: "The largest monastery in Sikkim, also known as the Dharmachakra Centre. Famous for its golden stupa and traditional Tibetan architecture.",
      rituals: ["Morning Prayers", "Butter Lamp Ceremony", "Cham Dance", "Meditation Sessions"],
      upcomingFestivals: [
        { name: "Losar Festival", date: "Feb 12, 2024" },
        { name: "Buddha Purnima", date: "May 23, 2024" }
      ],
      has360Tour: true
    },
    {
      id: "pemayangtse",
      name: "Pemayangtse Monastery",
      location: "Pelling, West Sikkim",
      foundedYear: 1705,
      image: interiorImage,
      description: "One of the oldest and most important monasteries in Sikkim, offering stunning views of Kanchenjunga. Known for its ancient murals and sculptures.",
      rituals: ["Tantric Rituals", "Chanting Sessions", "Prayer Wheel Spinning"],
      upcomingFestivals: [
        { name: "Saga Dawa", date: "Jun 15, 2024" }
      ],
      has360Tour: true
    },
    {
      id: "tashiding",
      name: "Tashiding Monastery",
      location: "Yuksom, West Sikkim",
      foundedYear: 1641,
      image: architectureImage,
      description: "Sacred monastery on a hilltop with panoramic mountain views. Famous for its annual Bhumchu ceremony and spiritual significance.",
      rituals: ["Bhumchu Ceremony", "Evening Prayers", "Sacred Text Reading"],
      upcomingFestivals: [],
      has360Tour: false
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sampleMonasteries.map((monastery) => (
        <MonasteryCard key={monastery.id} {...monastery} />
      ))}
    </div>
  )
}