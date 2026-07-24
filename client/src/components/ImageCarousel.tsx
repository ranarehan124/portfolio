import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import photo1 from '@/assets/images/photo1.jpg';
import photo2 from '@/assets/images/photo2.jpg';
import photo3 from '@/assets/images/photo3.jpg';
import photo4 from '@/assets/images/photo4.jpg';
import photo5 from '@/assets/images/photo5.jpg';
import photo6 from '@/assets/images/photo6.jpg';

const IMAGES = [photo1, photo2, photo3, photo4, photo5, photo6];

export default function ImageCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black">   <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
           <motion.img
            src={IMAGES[index]}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-contain"
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom gradient for dots readability */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'bg-white w-6' : 'bg-white/40 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}