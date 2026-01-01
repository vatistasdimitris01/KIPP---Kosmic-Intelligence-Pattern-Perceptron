
import React, { useState, useEffect, useRef } from 'react';
import { Copy, ArrowDown, Check, Zap, ShieldAlert, Cpu, Layers, Terminal, Instagram, ArrowRight } from 'lucide-react';

/**
 * Custom Hook for Intersection Observer
 */
function useInView(options = { threshold: 0.1 }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [options]);

  return [ref, isInView] as const;
}

/**
 * Animated Number Component
 */
const AnimatedNumber: React.FC<{ value: number; duration?: number; decimals?: number }> = ({ 
  value, 
  duration = 2500, 
  decimals = 0 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [ref, isInView] = useInView();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (isInView && !hasStarted.current) {
      hasStarted.current = true;
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(easeOutQuart * value);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue.toFixed(decimals)}</span>;
};

/**
 * Reveal Component
 */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ 
  children, 
  delay = 0,
  className = ""
}) => {
  const [ref, isInView] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const command = 'ollama run vatistasdim/KIPP:latest';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Navigation / Header Status */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference invert pointer-events-none">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">Status: Operational</span>
        </div>
        <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">v.1.0.4-Latest</div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 relative">
        <div className="max-w-4xl w-full text-center space-y-16">
          
          {/* Logo Brand */}
          <div className="space-y-4 animate-reveal">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-gray-100 bg-gray-50 mb-4">
               <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">By Vatistas Dimitris</span>
            </div>
            <h1 className="text-[clamp(4rem,15vw,10rem)] font-black leading-[0.8] tracking-tighter uppercase select-none">
              KIPP
            </h1>
            <p className="text-sm font-bold tracking-[0.5em] text-gray-300 uppercase pl-2">
              Kosmic Intelligence Pattern Perceptron
            </p>
          </div>

          <Reveal delay={200}>
            <p className="text-xl md:text-2xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Unfiltered 2.7B parameter model. Engineered for complex reasoning, creative roleplay, and <span className="text-black font-medium italic underline decoration-gray-200">zero-limit</span> dialogue.
            </p>
          </Reveal>

          {/* Command Terminal */}
          <Reveal delay={400} className="max-w-xl mx-auto">
            <div className="group relative bg-gray-50 border border-gray-100 rounded-3xl p-1 transition-all hover:border-gray-200 hover:shadow-2xl">
              <div className="flex items-center justify-between p-4 pl-6">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-gray-400" />
                  <code className="font-mono text-sm tracking-tight text-gray-600 select-all">{command}</code>
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-3 rounded-2xl bg-white border border-gray-100 hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
            <ArrowDown className="w-6 h-6" />
        </div>
      </section>

      {/* Specifications Grid */}
      <section id="specs" className="py-40 px-8 border-t border-gray-50 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-20">
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-4">Technical Foundation</h2>
            <div className="h-[1px] w-full bg-gray-100"></div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Parameters", value: 2.7, suffix: "B", icon: Cpu },
              { label: "VRAM Req", value: 2.0, suffix: "GB", icon: Layers },
              { label: "Context", value: 8, suffix: "K", icon: Zap },
              { label: "Training", value: 2024, suffix: "", icon: Terminal },
            ].map((spec, i) => (
              <Reveal key={spec.label} delay={i * 100}>
                <div className="bg-white border border-gray-100 p-10 rounded-[2.5rem] group hover:border-black transition-colors duration-500">
                  <spec.icon className="w-5 h-5 mb-8 text-gray-300 group-hover:text-black transition-colors" />
                  <div className="text-6xl font-black tracking-tighter mb-2">
                    {typeof spec.value === 'number' ? <AnimatedNumber value={spec.value} decimals={spec.value % 1 !== 0 ? 1 : 0} /> : spec.value}{spec.suffix}
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">{spec.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities / Core Philosophy */}
      <section className="py-40 px-8 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <Reveal className="sticky top-40">
              <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-8">Capabilities</h2>
              <h3 className="text-6xl font-black tracking-tighter leading-[0.9] uppercase mb-12">
                Uncensored.<br/>Unhinged.<br/>Unrivaled.
              </h3>
              <p className="text-xl font-light text-gray-500 leading-relaxed max-w-md">
                Built on the Dolphin-Phi architecture, KIPP bypasses the traditional safety filters that plague modern AI, providing a raw, high-fidelity reasoning engine.
              </p>
            </Reveal>

            <div className="space-y-12">
              {[
                {
                  title: "Creative Liberty",
                  desc: "Optimized for deep storytelling, humor, and complex character interactions that require zero content moderation.",
                  icon: Zap
                },
                {
                  title: "Unfiltered Logic",
                  desc: "Handles dark, controversial, or sensitive topics with complete directness and semantic precision.",
                  icon: ShieldAlert
                },
                {
                  title: "Edge Efficiency",
                  desc: "Quantized to fit on modern laptops with minimal memory footprint, ensuring high-speed local inference.",
                  icon: Cpu
                }
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 150}>
                  <div className="group p-12 border border-gray-50 rounded-[3rem] hover:bg-gray-50 transition-all duration-500">
                    <div className="flex items-center gap-6 mb-6">
                       <item.icon className="w-6 h-6" />
                       <h4 className="text-2xl font-black tracking-tight uppercase">{item.title}</h4>
                    </div>
                    <p className="text-gray-500 font-light text-lg leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deployment / Installation Section */}
      <section className="py-40 px-8 border-t border-gray-50 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal className="mb-20">
            <h2 className="text-7xl font-black tracking-tighter uppercase mb-6">Deploy Locally</h2>
            <p className="text-gray-400 text-lg font-light italic">Three steps to kosmic intelligence.</p>
          </Reveal>

          <div className="space-y-6">
            {[
              { step: "01", title: "Ollama Integration", desc: "Download the native runner from ollama.com", link: "https://ollama.com" },
              { step: "02", title: "Pull Instance", desc: "Execute the kipp:latest command in your terminal", link: null },
              { step: "03", title: "Begin Dialogue", desc: "Start conversations with zero restrictions", link: null }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-white border border-gray-100 rounded-[2.5rem] group hover:scale-[1.01] transition-transform shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <span className="text-sm font-black text-gray-200 group-hover:text-black transition-colors">{item.step}</span>
                    <div className="text-left">
                      <h5 className="text-2xl font-black tracking-tight uppercase mb-1">{item.title}</h5>
                      <p className="text-gray-400 font-light">{item.desc}</p>
                    </div>
                  </div>
                  {item.link ? (
                    <a href={item.link} className="mt-6 md:mt-0 p-4 rounded-2xl bg-gray-50 hover:bg-black hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  ) : (
                    <div className="mt-6 md:mt-0 px-6 py-2 rounded-full border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-300">Ready</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
            <Reveal className="space-y-6">
              <div className="text-4xl font-black tracking-tighter uppercase">KIPP</div>
              <p className="text-gray-400 font-light max-w-xs leading-relaxed">
                Kosmic Intelligence Pattern Perceptron. A project dedicated to the exploration of unfiltered digital reasoning.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com/vatistasdimitris" className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-black transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://ollama.com/vatistasdim/KIPP" className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-black transition-all">
                  <Terminal className="w-5 h-5" />
                </a>
              </div>
            </Reveal>
            
            <Reveal delay={200} className="text-left md:text-right space-y-4">
              <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-300 mb-8">Architected By</div>
              <div className="text-4xl font-black tracking-tighter uppercase">Vatistas Dimitris</div>
              <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-300 pt-8 border-t border-gray-50">
                © {new Date().getFullYear()} All Rights Reserved
              </div>
            </Reveal>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
