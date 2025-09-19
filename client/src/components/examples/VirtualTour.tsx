import VirtualTour from '../VirtualTour'
import interiorImage from '@assets/generated_images/Monastery_interior_showcase_08244864.png'

export default function VirtualTourExample() {
  //todo: remove mock functionality
  const sampleHotspots = [
    {
      id: "golden-buddha",
      x: 50,
      y: 40,
      title: "Golden Buddha Statue",
      description: "This magnificent 15th-century golden Buddha statue represents Sakyamuni Buddha in the earth-touching mudra, symbolizing enlightenment. The statue is crafted from bronze and covered in gold leaf, with intricate details depicting Buddhist iconography.",
      type: "artifact" as const
    },
    {
      id: "prayer-wheels",
      x: 25,
      y: 60,
      title: "Prayer Wheels",
      description: "These traditional Tibetan prayer wheels contain sacred mantras written on paper. When spun, they are believed to spread spiritual blessings and generate merit for the practitioner and all beings.",
      type: "ritual" as const
    },
    {
      id: "murals",
      x: 75,
      y: 35,
      title: "Ancient Murals",
      description: "These 300-year-old murals depict scenes from Buddha's life and teachings. Created by Tibetan master artists, they showcase the traditional thangka painting style with natural mineral pigments.",
      type: "architecture" as const
    },
    {
      id: "altar",
      x: 50,
      y: 70,
      title: "Main Altar",
      description: "The central altar where daily prayers and offerings are made. It houses sacred texts, ritual objects, and offerings of butter lamps, incense, and blessed water.",
      type: "ritual" as const
    },
    {
      id: "roof-beams",
      x: 50,
      y: 15,
      title: "Traditional Roof Structure",
      description: "The monastery's roof follows traditional Tibetan architecture with wooden beams arranged in specific patterns. The construction techniques have been passed down for generations.",
      type: "architecture" as const
    }
  ]

  return (
    <VirtualTour 
      monasteryName="Rumtek Monastery"
      monasteryId="rumtek"
      panoramicImage={interiorImage}
      hotspots={sampleHotspots}
    />
  )
}