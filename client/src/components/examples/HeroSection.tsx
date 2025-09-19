import HeroSection from '../HeroSection'
import heroImage from '@assets/generated_images/Sikkim_monastery_hero_image_91581ecf.png'

export default function HeroSectionExample() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">With Background Image</h3>
        <HeroSection backgroundImage={heroImage} isAuthenticated={false} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4 mt-12">Gradient Fallback</h3>
        <HeroSection isAuthenticated={true} />
      </div>
    </div>
  )
}