import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.06,
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            custom={0}
            variants={childVariants}
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-1.5 text-xs text-white/30"
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <svg
                    className="h-3 w-3 text-white/15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="transition-colors hover:text-white/60"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/50">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </motion.nav>
        )}

        <motion.h1
          custom={1}
          variants={childVariants}
          className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            custom={2}
            variants={childVariants}
            className="mt-1.5 max-w-2xl text-sm text-white/40 sm:text-base"
          >
            {description}
          </motion.p>
        )}
      </div>

      {actions && (
        <motion.div
          custom={3}
          variants={childVariants}
          className="flex shrink-0 items-center gap-3"
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  );
}