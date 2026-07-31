import Hero from './sections/Hero'
import { Statistics, Features, HowItWorks, ArchitectureSection } from './sections/FeaturesAndStats'
import { Testimonials, Faqs, Contact } from './sections/TestimonialsFaqContact'

export default function Landing() {
  return (
    <>
      <Hero />
      <Statistics />
      <Features />
      <HowItWorks />
      <ArchitectureSection />
      <Testimonials />
      <Faqs />
      <Contact />
    </>
  )
}
