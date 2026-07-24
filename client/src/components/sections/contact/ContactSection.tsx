import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCheck, FiAlertCircle, FiMail, FiUser, FiMessageSquare, FiLoader } from 'react-icons/fi';
import { SectionHeading, Button } from '@ui';
import { MagneticWrapper } from '@ui';
import { contactApi } from '@/api';
import { fadeInUp, staggerContainer, popIn, scaleIn } from '@/animations';
import { cn } from '@/utils/helpers';
import type { ContactFormData } from '@/types';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function InputField({
  label,
  name,
  error,
  register,
  icon,
  type = 'text',
  placeholder,
  disabled,
}: {
  label: string;
  name: 'name' | 'email' | 'subject' | 'message';
  error?: string;
  register: ReturnType<typeof useForm<ContactFormValues>>['register'];
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  disabled?: boolean;
}) {
  const isTextarea = name === 'message';

  return (
    <motion.div className="relative" variants={fadeInUp}>
      <label
        htmlFor={name}
        className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2.5 ml-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors duration-300 peer-focus:text-primary/60">
          {icon}
        </div>
        {isTextarea ? (
          <textarea
            id={name}
            rows={6}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4 resize-none',
              'text-white/80 placeholder:text-white/15 text-sm leading-relaxed',
              'transition-all duration-300 focus:outline-none',
              'focus:bg-white/[0.05] focus:border-primary/40 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]',
              error
                ? 'border-red-400/50 focus:border-red-400/70'
                : 'border-white/[0.06] hover:border-white/[0.12]',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            {...register(name)}
          />
        ) : (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full bg-white/[0.03] border rounded-xl py-3.5 pl-12 pr-4',
              'text-white/80 placeholder:text-white/15 text-sm',
              'transition-all duration-300 focus:outline-none',
              'focus:bg-white/[0.05] focus:border-primary/40 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]',
              error
                ? 'border-red-400/50 focus:border-red-400/70'
                : 'border-white/[0.06] hover:border-white/[0.12]',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            {...register(name)}
          />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-400/80 text-xs mt-2 ml-1 flex items-center gap-1.5"
          >
            <FiAlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SuccessAnimation() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 text-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6"
        variants={scaleIn}
      >
        <motion.div
          variants={popIn}
          className="text-emerald-400"
        >
          <FiCheck size={32} />
        </motion.div>
      </motion.div>
      <motion.h3
        className="text-xl sm:text-2xl font-bold text-white mb-3"
        variants={fadeInUp}
      >
        Message Sent!
      </motion.h3>
      <motion.p
        className="text-white/40 text-sm max-w-md"
        variants={fadeInUp}
      >
        Thank you for reaching out. I will get back to you within 24 hours.
      </motion.p>
    </motion.div>
  );
}

function ErrorAnimation({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 text-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6"
        variants={scaleIn}
      >
        <motion.div variants={popIn} className="text-red-400">
          <FiAlertCircle size={32} />
        </motion.div>
      </motion.div>
      <motion.h3
        className="text-xl sm:text-2xl font-bold text-white mb-3"
        variants={fadeInUp}
      >
        Something Went Wrong
      </motion.h3>
      <motion.p
        className="text-white/40 text-sm max-w-md mb-6"
        variants={fadeInUp}
      >
        {message || 'An error occurred while sending your message. Please try again.'}
      </motion.p>
      <motion.div variants={fadeInUp}>
        <Button variant="secondary" size="md" onClick={onRetry} magnetic={false}>
          Try Again
        </Button>
      </motion.div>
    </motion.div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      setStatus('submitting');
      setErrorMessage('');

      try {
        const response = await contactApi.submit(data);
        if (response.data.success) {
          setStatus('success');
          reset();
        } else {
          setStatus('error');
          setErrorMessage(response.data.message ?? 'Failed to send message.');
        }
      } catch (err) {
        setStatus('error');
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          setErrorMessage(axiosErr.response?.data?.message ?? 'Network error. Please try again.');
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      }
    },
    [reset],
  );

  const handleRetry = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
  }, []);

  if (status === 'success') {
    return (
      <div className="glass rounded-2xl p-8 sm:p-10 border border-white/[0.06]">
        <SuccessAnimation />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="glass rounded-2xl p-8 sm:p-10 border border-white/[0.06]">
        <ErrorAnimation message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8 sm:p-10 border border-white/[0.06]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Your Name"
            name="name"
            register={register}
            error={errors.name?.message}
            icon={<FiUser size={16} />}
            placeholder="John Doe"
            disabled={status === 'submitting'}
          />
          <InputField
            label="Your Email"
            name="email"
            type="email"
            register={register}
            error={errors.email?.message}
            icon={<FiMail size={16} />}
            placeholder="john@example.com"
            disabled={status === 'submitting'}
          />
        </div>

        <InputField
          label="Subject"
          name="subject"
          register={register}
          error={errors.subject?.message}
          icon={<FiMessageSquare size={16} />}
          placeholder="Let's collaborate on a project"
          disabled={status === 'submitting'}
        />

        <InputField
          label="Message"
          name="message"
          register={register}
          error={errors.message?.message}
          icon={<FiMessageSquare size={16} />}
          placeholder="Tell me about your project, idea, or just say hello..."
          disabled={status === 'submitting'}
        />

        <motion.div
          className="pt-2"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Button
            variant="primary"
            size="lg"
            magnetic
            glow
            className={cn('w-full sm:w-auto', status === 'submitting' && 'pointer-events-none opacity-70')}
            icon={
              status === 'submitting' ? (
                <FiLoader size={18} className="animate-spin" />
              ) : (
                <FiSend size={18} />
              )
            }
            iconPosition="right"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

const SOCIAL_CONTACT = [
  {
    platform: 'GitHub',
    url: 'https://github.com/ranarehan124',
    handle: '@ranarehan124',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/rehan-tahir-39496a370/',
    handle: 'Rehan Tahir',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    platform: 'Instagram',
    url: 'https://instagram.com/ranarehan_77',
    handle: '@ranarehan_77',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    platform: 'WhatsApp',
    url: 'https://wa.me/923707918962',
    handle: '+92 370 7918962',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.001 2C6.478 2 2 6.477 2 12c0 1.85.505 3.585 1.383 5.083L2.062 22l5.05-1.325A9.949 9.949 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    platform: 'Email',
    url: 'mailto:mt858625@gmail.com',
    handle: 'mt858625@gmail.com',
    icon: <FiMail size={20} />,
  },
];

function ContactSection() {
  return (
    <section id="contact" className="relative py-section-lg overflow-hidden">
      <div className="section-container">
        <SectionHeading
          label="Contact"
          title="Let's Build Something Together"
          description="Have a project in mind, a question, or just want to connect? I am always open to discussing new opportunities and creative ideas."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 max-w-6xl mx-auto">
          {/* Left — Social links and info */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div variants={fadeInUp}>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                Whether you need a premium website, an interactive 3D experience, or an AI-powered web application, I would love to hear about your project. Drop me a message and I will respond as soon as possible.
              </p>
            </motion.div>

            <motion.div className="space-y-4" variants={staggerContainer}>
              {SOCIAL_CONTACT.map((social) => (
                <MagneticWrapper key={social.platform} strength={0.15}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500"
                  >
                    <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary/70 group-hover:text-primary group-hover:bg-primary/15 group-hover:border-primary/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-500 flex-shrink-0">
                      {social.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">
                        {social.platform}
                      </p>
                      <p className="text-xs text-white/30 font-mono truncate">
                        {social.handle}
                      </p>
                    </div>
                  </a>
                </MagneticWrapper>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Contact form */}
          <motion.div
            className="lg:col-span-3"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;