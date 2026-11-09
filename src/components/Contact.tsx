import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2, Github, Linkedin, Loader2, Mail, Phone, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import IronFilings from './effects/IronFilings';
import { analytics } from '../utils/analytics';

type Field = 'name' | 'email' | 'subject' | 'message';
type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<Record<Field, string>>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const [sectionRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const validate = (values: Record<Field, string>) => {
    const e: Partial<Record<Field, string>> = {};
    (['name', 'email', 'subject', 'message'] as Field[]).forEach((f) => {
      if (!values[f].trim()) e[f] = t('contact.form.required');
    });
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) e.email = t('contact.form.invalidEmail');
    if (values.message.trim() && values.message.trim().length < 10) e.message = t('contact.form.tooShort');
    return e;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (errors[name as Field]) setErrors((prev) => ({ ...prev, [name]: validate(next)[name as Field] }));
    if (status === 'error') setStatus('idle');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }
    setStatus('submitting');
    try {
      await emailjs.send(
        'service_s7h9p86',
        'template_8bweweu',
        { name: form.name, email: form.email, title: form.subject, message: form.message, to_email: 'brandon@landaetta.dev' },
        'vq0ytfCOtRLG1-Ec7'
      );
      setStatus('success');
      analytics.contactFormSubmit();
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const err = error as { status?: number; text?: string };
      console.error('EmailJS error', err?.status, err?.text);
      setStatus('error');
    }
  };

  const field = (name: Field) => ({
    id: name,
    name,
    value: form[name],
    onChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `w-full rounded-xl border bg-night-800/70 px-4 py-3 text-[15px] text-white placeholder:text-white/35 transition-colors focus:outline-none focus:ring-2 ${
      errors[name] ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/30' : 'border-white/10 hover:border-white/20 focus:border-glow/60 focus:ring-glow/25'
    }`,
  });

  const label = (name: Field, text: string) => (
    <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-white/80">
      {text}
    </label>
  );

  const errorText = (name: Field) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-300">
        <AlertCircle size={14} aria-hidden="true" />
        {errors[name]}
      </p>
    ) : null;

  const links = [
    { href: 'mailto:brandon@landaetta.dev', icon: Mail, text: 'brandon@landaetta.dev' },
    { href: 'https://wa.me/573006361659', icon: Phone, text: '+57 300 636 1659', external: true },
    { href: 'https://www.linkedin.com/in/brandon-landaetta-70340ba2/', icon: Linkedin, text: 'linkedin.com/in/brandon-landaetta', external: true },
    { href: 'https://github.com/landaettadev', icon: Github, text: 'github.com/landaettadev', external: true },
  ];

  const reveal = {
    initial: { opacity: 0, y: 12 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <section id="contact" className="section isolate overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_85%)]">
        <IronFilings />
      </div>
      <div className="container mx-auto px-5 sm:px-6 lg:px-12">
        <h2 className="section-title">{t('contact.title')}</h2>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <motion.div {...reveal}>
            <h3 className="font-display text-xl font-semibold text-white">{t('contact.subtitle')}</h3>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-text-muted">{t('contact.description')}</p>
            <ul className="mt-8 space-y-2">
              {links.map(({ href, icon: Icon, text, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group inline-flex min-h-[44px] items-center gap-3 rounded-xl pr-3 text-white/80 transition-colors hover:text-white"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-glow transition-colors group-hover:border-glow/40">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="break-all text-[15px]">{text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.08 }}>
            <div className="rounded-3xl border border-white/10 bg-night-900/80 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,.9)] sm:p-8">
              <h3 className="font-display text-xl font-semibold text-white">{t('contact.sendMessage')}</h3>
              <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 space-y-5" aria-busy={status === 'submitting'}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    {label('name', t('contact.form.name'))}
                    <input type="text" autoComplete="name" placeholder={t('contact.form.namePlaceholder')} {...field('name')} />
                    {errorText('name')}
                  </div>
                  <div>
                    {label('email', t('contact.form.email'))}
                    <input type="email" autoComplete="email" inputMode="email" placeholder={t('contact.form.emailPlaceholder')} {...field('email')} />
                    {errorText('email')}
                  </div>
                </div>
                <div>
                  {label('subject', t('contact.form.subject'))}
                  <input type="text" placeholder={t('contact.form.subjectPlaceholder')} {...field('subject')} />
                  {errorText('subject')}
                </div>
                <div>
                  {label('message', t('contact.form.message'))}
                  <textarea rows={5} placeholder={t('contact.form.messagePlaceholder')} {...field('message')} className={`${field('message').className} resize-y min-h-[132px]`} />
                  {errorText('message')}
                </div>

                <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      {t('contact.form.sendButton')}
                      <Send size={17} aria-hidden="true" />
                    </>
                  )}
                </button>

                <div aria-live="polite" role="status">
                  {status === 'success' && (
                    <p className="flex items-start gap-2.5 rounded-xl border border-leaf/30 bg-leaf/10 p-4 text-[15px] text-emerald-200">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {t('contact.form.success')}
                    </p>
                  )}
                </div>
                <div aria-live="assertive" role="alert">
                  {status === 'error' && (
                    <p className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-[15px] text-red-200">
                      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {t('contact.form.error')}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
