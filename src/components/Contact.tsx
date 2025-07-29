  import React, { useState } from 'react';
  import { motion } from 'framer-motion';
  import { useInView } from 'react-intersection-observer';
  import { Send, Github, Linkedin, Instagram, Mail } from 'lucide-react';

  const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [sectionRef, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('submitting');
      
      // Simulate sending form data
      try {
        // In a real implementation, this would be a fetch call to an API endpoint
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset form status after 5 seconds
        setTimeout(() => {
          setFormStatus('idle');
        }, 5000);
      } catch (error) {
        setFormStatus('error');
        
        // Reset form status after 5 seconds
        setTimeout(() => {
          setFormStatus('idle');
        }, 5000);
      }
    };

    const socialLinks = [
      { platform: 'Github', icon: <Github />, url: 'https://github.com/yourusername' },
      { platform: 'LinkedIn', icon: <Linkedin />, url: 'https://linkedin.com/in/yourusername' },
      { platform: 'Instagram', icon: <Instagram />, url: 'https://instagram.com/yourusername' },
      { platform: 'Email', icon: <Mail />, url: 'mailto:your.email@example.com' },
    ];

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.4,
        },
      },
    };

    return (
      <section id="contact" className="section bg-bg-primary" ref={sectionRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="section-title text-center sm:text-left">Get In Touch</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mt-8 sm:mt-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <motion.h3 
                className="text-lg sm:text-xl font-bold mb-4 sm:mb-6"
                variants={itemVariants}
              >
                Let's Connect
              </motion.h3>
              
              <motion.p 
                className="text-sm sm:text-base text-text-muted mb-6 sm:mb-8"
                variants={itemVariants}
              >
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision. Feel free to reach out using the form or connect with me on social media.
              </motion.p>
              
              <motion.div 
                className="space-y-4"
                variants={itemVariants}
              >
                <a 
                  href="mailto:your.email@example.com"
                  className="flex items-center gap-3 text-text-muted hover:text-text-main transition-colors"
                >
                  <Mail size={20} />
                  <span className="text-sm sm:text-base">your.email@example.com</span>
                </a>
                
                <a 
                  href="https://linkedin.com/in/your-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-muted hover:text-text-main transition-colors"
                >
                  <Linkedin size={20} />
                  <span className="text-sm sm:text-base">linkedin.com/in/your-profile</span>
                </a>
                
                <a 
                  href="https://github.com/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-muted hover:text-text-main transition-colors"
                >
                  <Github size={20} />
                  <span className="text-sm sm:text-base">github.com/your-username</span>
                </a>
              </motion.div>
            </motion.div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <motion.h3 
                className="text-lg sm:text-xl font-bold mb-4 sm:mb-6"
                variants={itemVariants}
              >
                Send a Message
              </motion.h3>
              
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={itemVariants}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-text-muted mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-800 border-none text-sm sm:text-base text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-text-muted mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-800 border-none text-sm sm:text-base text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-text-muted mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-800 border-none text-sm sm:text-base text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-blue-500"
                    placeholder="Project Inquiry"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-text-muted mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-800 border-none text-sm sm:text-base text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base ${
                    formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
                
                {formStatus === 'success' && (
                  <div className="p-3 sm:p-4 rounded-lg bg-green-500/20 text-green-400 text-sm sm:text-base flex items-center justify-center">
                    Your message has been sent successfully!
                  </div>
                )}
                
                {formStatus === 'error' && (
                  <div className="p-3 sm:p-4 rounded-lg bg-red-500/20 text-red-400 text-sm sm:text-base flex items-center justify-center">
                    Something went wrong. Please try again later.
                  </div>
                )}
              </motion.form>
            </motion.div>
          </div>
        </div>
      </section>
    );
  };

  export default Contact;