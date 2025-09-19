import MonasteryMap from '../MonasteryMap'
import heroImage from '@assets/generated_images/Sikkim_monastery_hero_image_91581ecf.png'
import interiorImage from '@assets/generated_images/Monastery_interior_showcase_08244864.png'
import architectureImage from '@assets/generated_images/Monastery_architecture_detail_00f549cd.png'

export default function MonasteryMapExample() {
  //todo: remove mock functionality
  const sampleMonasteries = [
    {
      id: "rumtek",
      name: "Rumtek Monastery",
      location: "Gangtok, East Sikkim",
      coordinates: { lat: 27.4024, lng: 88.5731 },
      foundedYear: 1740,
      image: heroImage,
      description: "The largest monastery in Sikkim, also known as the Dharmachakra Centre. Famous for its golden stupa and traditional Tibetan architecture.",
      has360Tour: true
    },
    {
      id: "pemayangtse",
      name: "Pemayangtse Monastery",
      location: "Pelling, West Sikkim",
      coordinates: { lat: 27.2951, lng: 88.2314 },
      foundedYear: 1705,
      image: interiorImage,
      description: "One of the oldest and most important monasteries in Sikkim, offering stunning views of Kanchenjunga.",
      has360Tour: true
    },
    {
      id: "tashiding",
      name: "Tashiding Monastery",
      location: "Yuksom, West Sikkim",
      coordinates: { lat: 27.3617, lng: 88.1931 },
      foundedYear: 1641,
      image: architectureImage,
      description: "Sacred monastery on a hilltop with panoramic mountain views. Famous for its annual Bhumchu ceremony.",
      has360Tour: false
    },
    {
      id: "enchey",
      name: "Enchey Monastery",
      location: "Gangtok, East Sikkim",
      coordinates: { lat: 27.3389, lng: 88.6065 },
      foundedYear: 1909,
      image: heroImage,
      description: "Beautiful monastery overlooking Gangtok city, known for its peaceful environment and traditional rituals.",
      has360Tour: true
    }
  ]

  return <MonasteryMap monasteries={sampleMonasteries} />
}