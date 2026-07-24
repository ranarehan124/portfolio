import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ExperienceSection,
  ServicesSection,
  ProjectsSection,
  PhysicsSection,
  ContactSection,
  Footer,
} from '@/components/sections';

function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ServicesSection />
      <ProjectsSection />
      <PhysicsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

export default HomePage;