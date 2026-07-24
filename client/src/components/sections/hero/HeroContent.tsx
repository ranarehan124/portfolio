import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiArrowRight, FiDownload, FiSend } from 'react-icons/fi';
import { Button, MagneticWrapper } from '@ui';
import { HERO_DATA } from '@/data';
import { SOCIALS } from '@/constants';
import { useMouse } from '@/hooks';
import {
  heroGreetingVariants,
  heroNameVariants,
  heroTitleVariants,
  heroDescriptionVariants,
  heroButtonsVariants,
  heroSocialsVariants,
} from '@/animations';

function HeroContent() {
  const { normalizedX, normalizedY } = useMouse();

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.style.transform = `translate(${normalizedX * -8}px, ${normalizedY * -5}px)`;
  }, [normalizedX, normalizedY]);

  const socialIcons = [
    { icon: <FiGithub size={18} />, href: SOCIALS.github, label: 'GitHub' },
    { icon: <FiLinkedin size={18} />, href: SOCIALS.linkedin, label: 'LinkedIn' },
    { icon: <FiInstagram size={18} />, href: SOCIALS.instagram, label: 'Instagram' },
  ];

  return (
    <div className="relative z-10 h-full flex items-center">
      <div ref={contentRef} className="w-full max-w-2xl">
        {/* Greeting */}
        <motion.p
          className="font-mono text-sm md:text-base text-primary/80 tracking-wider mb-4"
          variants={heroGreetingVariants}
          initial="hidden"
          animate="visible"
        >
          {HERO_DATA.greeting}
        </motion.p>

        {/* Name */}
        <motion.h1
          className="text-hero-lg md:text-hero-xl font-bold text-white leading-[0.95] tracking-tighter mb-6 pt-1"
          variants={heroNameVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-gradient uppercase">{HERO_DATA.name}</span>
        </motion.h1>

        {/* Titles with typing effect */}
        <div className="flex flex-col gap-2 mb-8">
          {HERO_DATA.titles.map((title, i) => (
            <motion.p
              key={title}
              className="text-lg md:text-xl lg:text-2xl text-white/60 font-medium"
              custom={i}
              variants={heroTitleVariants}
              initial="hidden"
              animate="visible"
            >
              {title}
            </motion.p>
          ))}
        </div>

        {/* Description */}
        <motion.p
          className="text-base md:text-body-md text-white/40 max-w-xl leading-relaxed mb-10"
          variants={heroDescriptionVariants}
          initial="hidden"
          animate="visible"
        >
          {HERO_DATA.description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mb-12"
          variants={heroButtonsVariants}
          initial="hidden"
          animate="visible"
        >
          <Button
            variant="primary"
            size="lg"
            href={HERO_DATA.cta.primary.href}
            icon={<FiArrowRight size={16} />}
            iconPosition="right"
          >
            {HERO_DATA.cta.primary.label}
          </Button>

          <Button
            variant="premium"
            size="lg"
            href={HERO_DATA.cta.secondary.href}
            icon={<FiDownload size={16} />}
            iconPosition="left"
            className="px-9 py-4.5 text-base"
          >
            {HERO_DATA.cta.secondary.label}
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            href={HERO_DATA.cta.tertiary.href}
            icon={<FiSend size={16} />}
            iconPosition="left"
          >
            {HERO_DATA.cta.tertiary.label}
          </Button>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          className="flex items-center gap-4"
          variants={heroSocialsVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-xs font-mono text-white/20 tracking-wider mr-2">
            FIND ME ON
          </span>
          {socialIcons.map((social) => (
            <MagneticWrapper key={social.label} strength={0.4} radius={60}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] text-white/40 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            </MagneticWrapper>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default HeroContent;