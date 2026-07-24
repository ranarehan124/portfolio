import { motion } from 'framer-motion';
import { SectionHeading } from '@ui';
import { fadeInUp } from '@/animations';
import ImageCarousel from '@/components/ImageCarousel';

function PhysicsSection() {
  return (
    <section id="physics" className="relative py-section-lg overflow-hidden">
      <div className="section-container mb-8">
        <SectionHeading
          label="Gallery"
          title="Beyond The Code"
          description="A glimpse into who I am outside the screen — moments, moods, and the person behind the projects."
        />
      </div>

      <motion.div
        className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] mx-auto max-w-6xl rounded-3xl overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Glass border frame */}
      
        <ImageCarousel />
      </motion.div>
    </section>
  );
}

export default PhysicsSection;