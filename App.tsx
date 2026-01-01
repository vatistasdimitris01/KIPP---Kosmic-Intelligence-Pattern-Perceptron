
import React, { useState, useEffect, useRef } from 'react';
import { Copy, ArrowDown, Check, Zap, ShieldAlert, Cpu, Layers, Terminal, Instagram, ArrowRight, ExternalLink, Globe, HardDrive } from 'lucide-react';

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
  duration = 2000, 
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
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplayValue(easeOutExpo * value);
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
      className={`transition-all duration-[1500ms] cubic-bezier(0.19, 1, 0.22, 1) ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
      {/* Global Status Bar */}
      <div className="fixed top-0 left-0 w-full z-[60] px-6 py-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-40">System Node: Active</span>
        </div>
        <div className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-40">Build 2025.1.a</div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Abstract subtle background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[0.5px] border-gray-100 rounded-full opacity-40 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-[0.5px] border-gray-100 rounded-full opacity-30 pointer-events-none"></div>

        <div className="max-w-5xl w-full text-center space-y-24 relative z-10">
          
          <div className="space-y-8">
            <Reveal delay={100} className="flex justify-center">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                  <div className="w-1 h-1 rounded-full bg-black"></div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Unfiltered Intelligence</span>
               </div>
            </Reveal>

            <div className="space-y-2 animate-reveal">
              <h1 className="text-[clamp(4.5rem,18vw,14rem)] font-black leading-[0.75] tracking-[-0.07em] uppercase">
                KIPP
              </h1>
              <p className="text-[11px] font-bold tracking-[0.6em] text-gray-300 uppercase pl-4">
                Kosmic Intelligence Pattern Perceptron
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <Reveal delay={300}>
              <p className="text-xl md:text-3xl font-light text-gray-400 max-w-2xl mx-auto leading-[1.4] tracking-tight">
                Maximum freedom. <span className="text-black font-medium">Zero filters.</span> <br/>
                A 2.7B parameter model architected for the unconstrained pursuit of reasoning.
              </p>
            </Reveal>

            <Reveal delay={500} className="max-w-xl mx-auto">
              <div className="group relative bg-white border border-gray-100 rounded-[2rem] p-1.5 transition-all hover:border-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between p-3.5 pl-6">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Terminal className="w-4 h-4 text-gray-400 shrink-0" />
                    <code className="font-mono text-sm tracking-tight text-gray-500 select-all truncate">{command}</code>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex-shrink-0 p-3.5 rounded-[1.25rem] bg-gray-50 border border-gray-100 hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
            <ArrowDown className="w-5 h-5" onClick={() => document.getElementById('bento-specs')?.scrollIntoView({ behavior: 'smooth' })} />
        </div>
      </section>

      {/* Bento Specifications */}
      <section id="bento-specs" className="py-24 px-6 border-t border-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Primary Stat Card */}
            <Reveal delay={0} className="md:col-span-8">
               <div className="h-full bg-gray-50 border border-gray-100 p-12 rounded-[3rem] group hover:bg-white hover:border-black transition-all duration-500">
                  <div className="flex justify-between items-start mb-16">
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Foundation: Dolphin-Phi</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-8xl font-black tracking-tighter">
                      <AnimatedNumber value={2.7} decimals={1} />B
                    </div>
                    <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-300">Total Active Parameters</div>
                  </div>
               </div>
            </Reveal>

            {/* Storage Card */}
            <Reveal delay={200} className="md:col-span-4">
               <div className="h-full bg-white border border-gray-100 p-12 rounded-[3rem] group hover:border-black transition-all duration-500 flex flex-col justify-end">
                  <HardDrive className="w-6 h-6 mb-16 text-gray-200 group-hover:text-black transition-colors" />
                  <div className="text-6xl font-black tracking-tighter mb-2">
                    <AnimatedNumber value={2.0} />GB
                  </div>
                  <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400">Compressed Size</div>
               </div>
            </Reveal>

            {/* Context Card */}
            <Reveal delay={300} className="md:col-span-4">
               <div className="h-full bg-white border border-gray-100 p-12 rounded-[3rem] group hover:border-black transition-all duration-500">
                  <div className="text-6xl font-black tracking-tighter mb-2">
                    <AnimatedNumber value={8} />K
                  </div>
                  <div className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400">Token Context</div>
                  <div className="mt-8 text-sm font-light text-gray-400 leading-relaxed">
                    Extended multi-turn conversation memory.
                  </div>
               </div>
            </Reveal>

            {/* Knowledge Card */}
            <Reveal delay={400} className="md:col-span-8">
               <div className="h-full bg-gray-50 border border-gray-100 p-12 rounded-[3rem] group hover:bg-white hover:border-black transition-all duration-500 flex flex-col md:flex-row items-end justify-between">
                  <div className="text-left">
                    <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-300 mb-4">Training Cutoff</div>
                    <div className="text-7xl font-black tracking-tighter">MID-2024</div>
                  </div>
                  <div className="mt-8 md:mt-0 max-w-[200px] text-right text-[10px] font-bold tracking-widest uppercase leading-loose text-gray-400">
                    Sourced from high-fidelity open-source datasets.
                  </div>
               </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy / Capabilities */}
      <section className="py-48 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-24">
            <div className="md:w-1/2 space-y-12">
               <Reveal>
                  <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-300 mb-6">Core Philosophy</h2>
                  <h3 className="text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                    Total <br/>Freedom <br/>of Thought.
                  </h3>
               </Reveal>
               <Reveal delay={200}>
                  <p className="text-xl font-light text-gray-400 leading-relaxed max-w-sm">
                    KIPP is designed to provide answers where other models provide warnings. No moralizing, no lecturing, just raw computation.
                  </p>
               </Reveal>
            </div>

            <div className="md:w-1/2 grid grid-cols-1 gap-6">
               {[
                 { title: "No Guardrails", desc: "No content filters. No refusal logic. Handles all topics including dark humor and controversial debates.", icon: ShieldAlert },
                 { title: "Creative RP", desc: "Highly skilled at complex character roleplay and non-linear storytelling environments.", icon: Zap },
                 { title: "Local First", desc: "Runs completely locally. Your data never leaves your hardware. Zero latency, 100% privacy.", icon: Globe }
               ].map((item, i) => (
                 <Reveal key={item.title} delay={i * 150}>
                   <div className="group p-10 border border-gray-50 rounded-[2.5rem] hover:bg-gray-50 transition-all duration-500">
                      <div className="flex items-center gap-5 mb-5">
                         <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                            <item.icon className="w-4 h-4" />
                         </div>
                         <h4 className="text-xl font-black tracking-tight uppercase">{item.title}</h4>
                      </div>
                      <p className="text-gray-400 font-light leading-relaxed">
                        {item.desc}
                      </p>
                   </div>
                 </Reveal>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deployment */}
      <section className="py-48 px-6 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto space-y-20">
          <Reveal className="text-center">
            <h2 className="text-6xl font-black tracking-tighter uppercase">Getting Started</h2>
            <p className="mt-4 text-gray-400 font-light">Deploy the perceptron in under sixty seconds.</p>
          </Reveal>

          <div className="space-y-3">
             {[
               { num: "01", label: "Runtime", title: "Install Ollama", desc: "The core engine for local LLMs.", url: "https://ollama.com" },
               { num: "02", label: "Model", title: "Pull Perceptron", desc: "Execute the command provided at the top.", url: null },
               { num: "03", label: "Access", title: "Interact Freely", desc: "Begin your unfiltered dialogue session.", url: null }
             ].map((step, i) => (
               <Reveal key={i} delay={i * 100}>
                 <div className="group flex flex-col md:flex-row items-center justify-between p-8 bg-white border border-gray-100 rounded-[2rem] hover:border-black transition-all">
                    <div className="flex items-center gap-10">
                       <span className="text-xs font-black text-gray-200 group-hover:text-black transition-colors">{step.num}</span>
                       <div className="text-center md:text-left">
                          <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">{step.label}</div>
                          <h5 className="text-xl font-black tracking-tight uppercase">{step.title}</h5>
                       </div>
                    </div>
                    <div className="mt-6 md:mt-0 flex items-center gap-4">
                       <p className="text-sm font-light text-gray-400">{step.desc}</p>
                       {step.url && (
                         <a href={step.url} target="_blank" className="p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all">
                           <ExternalLink className="w-4 h-4" />
                         </a>
                       )}
                    </div>
                 </div>
               </Reveal>
             ))}
          </div>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="py-32 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <Reveal className="md:col-span-5 space-y-8">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                  <img src="https://i.ibb.co/39d2BDdW/Untitled-design-removebg-preview.png" alt="KIPP Logo" className="w-8 h-8 invert" />
                </div>
                <div className="flex flex-col">
                   <span className="text-2xl font-black tracking-tighter uppercase">KIPP</span>
                   <span className="text-[9px] font-bold tracking-[0.4em] text-gray-400 uppercase">Version 1.0.4</span>
                </div>
             </div>
             <p className="text-gray-400 font-light leading-relaxed max-w-xs">
                A localized research project focused on the limits of digital reasoning. Unfiltered, unhinged, and universally accessible.
             </p>
          </Reveal>

          <div className="md:col-span-3 space-y-8">
             <h6 className="text-[9px] font-bold tracking-[0.5em] uppercase text-gray-300">Connect</h6>
             <div className="flex flex-col gap-4 items-start">
                <a href="https://instagram.com/vatistasdimitris" target="_blank" className="flex items-center gap-3 text-sm font-medium hover:translate-x-1 transition-transform">
                  <Instagram className="w-4 h-4" /> @vatistasdimitris
                </a>
                <a href="https://ollama.com/vatistasdim/KIPP" target="_blank" className="flex items-center gap-3 text-sm font-medium hover:translate-x-1 transition-transform">
                  <Terminal className="w-4 h-4" /> Repository
                </a>
             </div>
          </div>

          <div className="md:col-span-4 text-left md:text-right space-y-8">
             <h6 className="text-[9px] font-bold tracking-[0.5em] uppercase text-gray-300">Architect</h6>
             <div className="text-4xl font-black tracking-tighter uppercase">Vatistas <br/>Dimitris</div>
             <div className="pt-8 border-t border-gray-50 flex flex-col md:items-end gap-2">
                <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-gray-200">© {new Date().getFullYear()} KIPP PERCEPTRON</span>
                <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">A Private Deployment</span>
             </div>
          </div>
        </div>
      </footer>

      {/* Navigation Shadow (Bottom Indicator) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-50"></div>
    </div>
  );
};

export default App;
