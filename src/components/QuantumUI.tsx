import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Database, Cpu, AlertTriangle, FileText, Mail, BookOpen, User, Activity, Zap, History, ChevronRight, HelpCircle, Sun, Moon, Shield, Search, LogOut, Image as ImageIcon, X, MessageSquare, Bot, Sparkles, Send } from 'lucide-react';
import { BOOK_DATA, Chapter, Branch, Artifact, Choice } from '../data/book';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth, db, signInWithGoogle, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, setDoc, getDoc } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { GoogleGenAI } from "@google/genai";

const PhysicsLab = ({ activeSimulation, setActiveSimulation, isDarkMode, onClose }: { activeSimulation: string; setActiveSimulation: (sim: 'ENTANGLEMENT' | 'WAVE_PARTICLE' | 'FIBONACCI') => void; isDarkMode: boolean; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl",
      )}
    >
      <div className={cn(
        "w-full max-w-4xl h-[80vh] border rounded-2xl overflow-hidden flex flex-col shadow-2xl",
        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      )}>
        <div className="p-6 border-b flex items-center justify-between border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Activity size={20} className="text-cyan-500" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tighter uppercase text-white">Laboratorio de Física Cuántica</h2>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Simulación: {activeSimulation}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 p-12 flex items-center justify-center relative overflow-hidden">
          {activeSimulation === 'ENTANGLEMENT' && (
            <div className="relative w-full h-full flex items-center justify-around">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1],
                    boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 40px rgba(6,182,212,0.4)", "0 0 20px rgba(6,182,212,0.2)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-2 border-cyan-500/50 flex items-center justify-center relative"
                >
                  <div className="w-4 h-4 bg-cyan-500 rounded-full" />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-start justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full mt-2" />
                  </motion.div>
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Entrelazamiento: El estado de una partícula afecta instantáneamente a la otra.
              </div>
            </div>
          )}

          {activeSimulation === 'WAVE_PARTICLE' && (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-12">
              <div className="flex gap-24 items-center">
                <div className="w-4 h-24 bg-zinc-800 rounded-full relative">
                  <motion.div 
                    animate={{ y: [-40, 40] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-2 h-12 bg-zinc-700" />
                  <div className="w-2 h-12 bg-zinc-700" />
                </div>
                <div className="relative w-64 h-64 border-l-2 border-zinc-800 flex items-center justify-center">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        x: [0, 200],
                        scale: [1, 2, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "linear"
                      }}
                      className="absolute w-1 h-1 bg-cyan-500 rounded-full"
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent" />
                </div>
              </div>
              <div className="text-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Dualidad Onda-Partícula: La materia se comporta como partícula y como onda simultáneamente.
              </div>
            </div>
          )}

          {activeSimulation === 'FIBONACCI' && (
            <div className="relative w-96 h-96">
              {[1, 1, 2, 3, 5, 8, 13, 21].map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.3 }}
                  style={{
                    width: n * 10,
                    height: n * 10,
                    border: '1px solid rgba(6,182,212,0.3)',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 90}deg)`,
                    borderRadius: '0 100% 0 0'
                  }}
                />
              ))}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Espiral de Fibonacci: El patrón matemático que rige el crecimiento en Laniakea.
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800/50 bg-black/20 flex justify-center gap-4">
          {(['ENTANGLEMENT', 'WAVE_PARTICLE', 'FIBONACCI'] as const).map(sim => (
            <button
              key={sim}
              onClick={() => setActiveSimulation(sim as any)}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] font-bold transition-all border uppercase tracking-widest",
                activeSimulation === sim 
                  ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                  : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300"
              )}
            >
              {sim.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const QuantumParticles = ({ userVariable }: { userVariable: number }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500/20 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0 
          }}
          animate={{ 
            y: [null, Math.random() * 100 + "%"],
            opacity: [0, 0.5, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ 
            duration: (Math.random() * 10 + 10) / userVariable, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BlinkingCursor = ({ className }: { className?: string }) => (
  <motion.span
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.8, repeat: Infinity }}
    className={cn("inline-block w-2 h-4 bg-current align-middle ml-1", className)}
  />
);

const GlitchText = ({ text, className, intense = false }: { text: string; className?: string; intense?: boolean }) => {
  return (
    <motion.div 
      className={cn("relative inline-block", className)}
    >
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-red-500 opacity-40"
        animate={{ 
          x: intense ? [-1, 1, -1] : [-0.5, 0.5, -0.5], 
          y: intense ? [1, -1, 1] : [0.5, -0.5, 0.5] 
        }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-blue-500 opacity-40"
        animate={{ 
          x: intense ? [1, -1, 1] : [0.5, -0.5, 0.5], 
          y: intense ? [-1, 1, -1] : [-0.5, 0.5, -0.5] 
        }}
        transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

interface HistoryItem {
  key: string;
  isWormhole?: boolean;
  isBlackHole?: boolean;
}

const ensureString = (val: any): string => {
  if (val === undefined || val === null) return "";
  return typeof val === 'string' ? val : JSON.stringify(val);
};

const transformText = (text: any, isBlackHoleActive: boolean) => {
  const str = ensureString(text);
  if (!isBlackHoleActive) return str;
  return str
    .replace(/Silas/g, 'Salis')
    .replace(/Tesla/g, 'Lesta')
    .replace(/Elena/g, 'Anela')
    .replace(/Vance/g, 'Nevac')
    .replace(/Laniakea/g, 'Aekainal')
    .replace(/Fundación/g, 'Noicadnuf')
    .replace(/Aris/g, 'Sira')
    .replace(/Thorne/g, 'Enroht');
};

const Typewriter = ({ text, speed = 20, onComplete }: { text: string; speed?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <>{displayedText}</>;
};

const ArtifactCard = ({ artifact, isDarkMode, isBlackHoleActive }: { artifact: Artifact; isDarkMode: boolean; isBlackHoleActive: boolean }) => {
  const Icon = artifact.type === 'EMAIL' ? Mail : artifact.type === 'DIARY' ? BookOpen : FileText;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border rounded-xl my-8 font-mono text-sm relative overflow-hidden group transition-all hover:shadow-xl",
        isDarkMode 
          ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700" 
          : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm",
        isBlackHoleActive && "invert hue-rotate-180"
      )}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500 group-hover:bg-cyan-400 transition-colors" />
      
      <div className={cn(
        "px-6 py-4 border-b flex items-center justify-between",
        isDarkMode ? "bg-black/40 border-zinc-800/50" : "bg-zinc-50 border-zinc-100"
      )}>
        <div className="flex items-center gap-3 text-cyan-500">
          <Icon size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-black">{artifact.type}</span>
        </div>
        {artifact.date && (
          <div className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">
            {ensureString(artifact.date)}
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {(artifact.title || artifact.author) && (
          <div className="space-y-1">
            {artifact.title && (
              <h3 className={cn(
                "text-lg font-black tracking-tight leading-tight",
                isDarkMode ? "text-white" : "text-zinc-900"
              )}>
                {transformText(artifact.title, isBlackHoleActive)}
              </h3>
            )}
            {artifact.author && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <User size={10} />
                <span>ORIGEN: {transformText(artifact.author, isBlackHoleActive)}</span>
              </div>
            )}
          </div>
        )}

        <div className={cn(
          "leading-relaxed whitespace-pre-wrap italic transition-colors text-sm",
          isDarkMode ? "text-zinc-400" : "text-zinc-600"
        )}>
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {ensureString(transformText(artifact.content, isBlackHoleActive))}
          </ReactMarkdown>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <BlinkingCursor className="h-2 w-1 text-cyan-500" />
      </div>
    </motion.div>
  );
};

const MailCard = ({ mail, isInbox, isDarkMode }: { mail: any; isInbox: boolean; isDarkMode: boolean }) => {
  const content = isInbox ? mail.reply : mail.body;
  if (!content && isInbox) return null;

  const quantumId = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const senderColors: Record<string, string> = {
    'Elon': 'text-cyan-400',
    'Jesus': 'text-red-400',
    'Einstein': 'text-purple-400',
    'Tesla': 'text-yellow-400',
    'FutureScientist': 'text-emerald-400'
  };

  const senderColor = isInbox ? (senderColors[mail.recipient] || 'text-cyan-400') : 'text-zinc-400';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "border rounded-2xl overflow-hidden mb-8 shadow-2xl transition-all group relative",
        isDarkMode 
          ? "bg-zinc-900/40 border-zinc-800/50 backdrop-blur-md" 
          : "bg-white/80 border-zinc-200 backdrop-blur-md"
      )}
    >
      {/* Scanning Effect */}
      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-cyan-500/20 z-20 pointer-events-none"
      />

      {/* Email Header */}
      <div className={cn(
        "px-6 py-5 border-b flex flex-col gap-3 relative overflow-hidden",
        isDarkMode ? "bg-black/60 border-zinc-800/50" : "bg-zinc-50 border-zinc-200"
      )}>
        <div className="absolute top-0 right-0 p-1 opacity-10">
          <Mail size={80} className="rotate-12" />
        </div>

        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <User size={14} className="text-cyan-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-cyan-500/50 tracking-widest uppercase">FROM:</span>
                <span className={cn("text-sm font-mono font-bold tracking-tight", isInbox ? senderColor : (isDarkMode ? "text-zinc-100" : "text-zinc-800"))}>
                  {isInbox ? `${ensureString(mail.recipient)}@laniakea.node` : "OBSERVADOR@origin.real"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-500/10 flex items-center justify-center border border-zinc-500/20">
                <Bot size={14} className="text-zinc-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-cyan-500/50 tracking-widest uppercase">TO:</span>
                <span className={cn("text-sm font-mono tracking-tight", isDarkMode ? "text-zinc-400" : "text-zinc-500")}>
                  {isInbox ? "OBSERVADOR@origin.real" : `${ensureString(mail.recipient)}@laniakea.node`}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="inline-block px-2 py-1 bg-black/40 rounded border border-zinc-800 text-[9px] font-mono text-zinc-400 font-bold tracking-widest">
              ID: Q-{quantumId}
            </div>
            <div className="text-[9px] font-mono text-zinc-500 flex items-center justify-end gap-2">
              <Activity size={10} />
              {mail.sentAt ? new Date(mail.sentAt.seconds * 1000).toLocaleString() : "PENDING..."}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Line */}
      <div className={cn(
        "px-8 py-4 border-b flex items-center gap-4 relative",
        isDarkMode ? "bg-zinc-800/20 border-zinc-800/50" : "bg-zinc-100/30 border-zinc-200"
      )}>
        <Zap size={14} className="text-cyan-500/50" />
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-cyan-500/50 tracking-widest uppercase">SUBJECT:</span>
          <span className={cn("text-base font-bold tracking-tight", isDarkMode ? "text-zinc-100" : "text-zinc-900")}>
            {ensureString(mail.subject || 'Sin Asunto')}
          </span>
        </div>
      </div>

      {/* Email Body */}
      <div className={cn(
        "p-10 text-base leading-relaxed min-h-[160px] relative",
        isDarkMode ? "text-zinc-300 bg-zinc-950/20" : "text-zinc-800 bg-white"
      )}>
        <div className="prose prose-invert prose-zinc max-w-none prose-sm font-serif selection:bg-cyan-500/40">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {ensureString(content)}
          </ReactMarkdown>
        </div>

        {mail.image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 rounded-2xl overflow-hidden border border-zinc-800/50 shadow-2xl group/img relative"
          >
            <img src={mail.image} alt="Attachment" className="w-full h-auto transition-transform duration-700 group-hover/img:scale-105" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-6">
              <div className="flex items-center gap-3 text-white">
                <ImageIcon size={20} className="text-cyan-400" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">Visualización Cuántica Colapsada</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-mono text-white/80 uppercase tracking-widest">
              IMG_ATTACHMENT_DETECTED
            </div>
          </motion.div>
        )}
        
        {/* Quantum Metadata Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800/30 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={cn(
                    "absolute inset-0 rounded-full blur-sm",
                    mail.status === 'DELIVERED' ? "bg-green-500/50" : "bg-yellow-500/50"
                  )} 
                />
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full relative z-10",
                  mail.status === 'DELIVERED' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" : "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]"
                )} />
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.3em]">
                {ensureString(mail.status || 'SENT')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={12} className="text-zinc-600" />
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.3em]">
                AES-Q-2048
              </span>
            </div>
          </div>
          {mail.senderBranch !== mail.recipientBranch && (
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/5 rounded-full border border-red-500/20"
            >
              <AlertTriangle size={12} className="text-red-500" />
              <div className="text-[9px] text-red-500 font-black uppercase tracking-widest">
                INTERFERENCIA_DETECTADA
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const BlackHoleOverlay = ({ isDarkMode, userVariable }: { isDarkMode: boolean; userVariable: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
  >
    <motion.div
      animate={{ 
        scale: [1, 1.2 * userVariable, 1],
        rotate: [0, 360],
      }}
      transition={{ duration: 10 / userVariable, repeat: Infinity, ease: "linear" }}
      className="relative w-64 h-64"
    >
      <div className="absolute inset-0 rounded-full bg-black shadow-[0_0_100px_rgba(255,255,255,0.2)] border border-white/10" />
      <motion.div 
        animate={{ scale: [1, 1.5 * userVariable], opacity: [0.5, 0] }}
        transition={{ duration: 2 / userVariable, repeat: Infinity }}
        className="absolute inset-0 rounded-full border-2 border-white/20"
      />
    </motion.div>
    <div className="absolute font-mono text-white text-2xl tracking-[1.5em] animate-pulse text-center">
      COLAPSO_TOTAL_DEL_HORIZONTE
      <div className="text-xs tracking-widest mt-4 opacity-50">RECONFIGURANDO_IDENTIDADES_ONTOLÓGICAS</div>
    </div>
  </motion.div>
);

const QuantumMap = ({ history, currentKey, isDarkMode, onClose, onNodeClick }: { history: HistoryItem[], currentKey: string, isDarkMode: boolean, onClose: () => void, onNodeClick: (key: string) => void }) => {
  const allNodes = [...history, { key: currentKey }];
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);

  // Calculate positions for a "4D" tree structure
  const getPosition = (key: string) => {
    const chapter = BOOK_DATA[key];
    const id = chapter?.id || 0;
    const isImaginary = chapter?.branch === 'IMAGINARY';
    
    // Base coordinates
    let x = 0;
    let y = 0;
    let z = 0;

    if (id === 0) {
      x = 0;
      y = 0;
      z = 0;
    } else {
      // Branching out from center
      const side = isImaginary ? -1 : 1;
      x = side * (id * 120);
      y = Math.sin(id * 0.5) * 60; // Wave pattern
      z = isImaginary ? 100 : -100;
    }

    return { x, y, z };
  };

  const handleNodeClick = (key: string) => {
    setSelectedNode(key);
    const random = Math.random();
    const chapter = BOOK_DATA[key];
    const currentChapter = BOOK_DATA[currentKey];
    
    // Calculate distances to ALL other visited nodes
    const distances = allNodes
      .filter(n => n.key !== key)
      .map(n => {
        const otherChapter = BOOK_DATA[n.key];
        const d = Math.abs((chapter?.id || 0) - (otherChapter?.id || 0));
        return `Nodo ${otherChapter?.id || '?'}: ${d}uP`;
      })
      .slice(0, 3)
      .join(' | ');

    if (random < 0.15) {
      setGreeting("¡Cua Cua! El pato cuántico te observa desde la quinta dimensión.");
    } else if (random < 0.3) {
      setGreeting("Científico del Futuro: 'He visto este nodo en los archivos de la Singularidad. Sigue adelante, Observador.'");
    } else if (random < 0.45) {
      setGreeting(`Métrica de Minkowski: ${distances}`);
    } else if (random < 0.6) {
      setGreeting("Voz del Vacío: 'Cada elección colapsa un universo entero. No mires atrás.'");
    } else if (random < 0.75) {
      setGreeting("Nikola Tesla: 'La energía de este nodo vibra en 3-6-9. Estás cerca.'");
    } else {
      setGreeting(`Nodo ${chapter?.id || '?'}: Estado ${chapter?.branch || 'DESCONOCIDO'}. Estabilidad: ${Math.random().toFixed(3)}`);
    }
    
    onNodeClick(key);
    setTimeout(() => setGreeting(null), 6000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 overflow-hidden"
    >
      <div className="absolute top-6 right-6 flex gap-4">
        <button onClick={onClose} className="text-zinc-500 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">[CERRAR_MAPA]</button>
      </div>

      {greeting && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 bg-cyan-500/10 border border-cyan-500/50 p-4 rounded-lg font-mono text-xs text-cyan-400 z-[310]"
        >
          {greeting}
        </motion.div>
      )}
      
      <motion.div 
        initial={{ rotateX: 45, rotateZ: -10, scale: 0.8 }}
        animate={{ rotateX: 20, rotateZ: 0, scale: 1 }}
        className="relative w-full h-full flex items-center justify-center perspective-[2000px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {allNodes.map((node, i) => {
            if (i === 0) return null;
            const prev = allNodes[i-1];
            const start = getPosition(prev.key);
            const end = getPosition(node.key);
            
            // Center offset
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;

            const isWormhole = node.isWormhole;
            const isBlackHole = node.isBlackHole;
            const isImaginary = BOOK_DATA[node.key]?.branch === 'IMAGINARY';

            let color = isImaginary ? "#a855f7" : "#06b6d4";
            if (isWormhole) color = "#eab308";
            if (isBlackHole) color = "#ef4444";

            return (
              <motion.line
                key={`line-${i}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                x1={cx + start.x}
                y1={cy + start.y}
                x2={cx + end.x}
                y2={cy + end.y}
                stroke={color}
                strokeWidth={isWormhole || isBlackHole ? 2 : 1}
                strokeDasharray={isWormhole ? "4 4" : "none"}
              />
            );
          })}
        </svg>

        {allNodes.map((node, index) => {
          const nodeChapter = BOOK_DATA[node.key];
          const isCurrent = node.key === currentKey;
          const isImaginary = nodeChapter?.branch === 'IMAGINARY';
          const pos = getPosition(node.key);
          
          return (
            <motion.div
              key={`${node.key}-${index}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: pos.x,
                y: pos.y,
                z: pos.z
              }}
              transition={{ delay: index * 0.05 }}
              className="absolute cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              onClick={() => handleNodeClick(node.key)}
            >
              <motion.div
                whileHover={{ scale: 1.2, translateZ: 20 }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                  isCurrent ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]" : "border-zinc-700",
                  isImaginary ? "border-purple-500/50" : "border-cyan-500/50",
                  isDarkMode ? "bg-zinc-900" : "bg-white",
                  node.isBlackHole && "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse"
                )}
              >
                <span className={cn(
                  "font-mono text-[10px] font-bold",
                  isCurrent ? "text-cyan-400" : "text-zinc-500"
                )}>
                  {nodeChapter?.id}{isImaginary ? 'i' : ''}
                </span>
              </motion.div>
              
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono uppercase tracking-tighter text-zinc-500 opacity-0 hover:opacity-100 transition-opacity">
                {ensureString(nodeChapter?.title)}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <div className="text-cyan-500 font-mono text-xs tracking-[1em] uppercase mb-2 animate-pulse">Cartografía 4D de la Consciencia</div>
        <div className="flex gap-4 justify-center text-[8px] font-mono uppercase tracking-widest text-zinc-500">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-500 rounded-full" /> Real</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full" /> Imaginaria</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full" /> Gusano</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full" /> Negro</div>
        </div>
      </div>
    </motion.div>
  );
};

export const QuantumUI = () => {
  const [currentChapterKey, setCurrentChapterKey] = useState('0-REAL');
  const [visitedChapters, setVisitedChapters] = useState<Record<string, number>>({ '0-REAL': 1 });
  const [isWormholeActive, setIsWormholeActive] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [psiValue, setPsiValue] = useState(1.000);
  const [characterType, setCharacterType] = useState<'HUMAN' | 'VARIABLE' | 'DATA'>('HUMAN');
  const [enigmaAnswer, setEnigmaAnswer] = useState('');
  const [isEnigmaSolved, setIsEnigmaSolved] = useState(false);
  const [solvedEnigmasCount, setSolvedEnigmasCount] = useState(0);
  const [showGalacticEvent, setShowGalacticEvent] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [coreStability, setCoreStability] = useState(98.4);
  const [currentHint, setCurrentHint] = useState<{ sender: string; message: string } | null>(null);
  const [transmission, setTransmission] = useState<{ sender: string; message: string } | null>(null);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [mailContent, setMailContent] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [sentMails, setSentMails] = useState<{ to: string; content: string; reply?: string }[]>([]);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isBlackHoleActive, setIsBlackHoleActive] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customDisplayName, setCustomDisplayName] = useState('');
  const [defaultRecipient, setDefaultRecipient] = useState<string>('Elon');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('Elon');
  const [mails, setMails] = useState<any[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [displayedChapterContent, setDisplayedChapterContent] = useState("");
  const [isTypewriterComplete, setIsTypewriterComplete] = useState(false);
  const [mailImagePrompt, setMailImagePrompt] = useState('');
  const [isGeneratingMailImage, setIsGeneratingMailImage] = useState(false);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);
  const [mailTab, setMailTab] = useState<'inbox' | 'outbox'>('inbox');
  const [hasNewMail, setHasNewMail] = useState(false);
  const [selectedMailImage, setSelectedMailImage] = useState<string | null>(null);
  const [temporalFragments, setTemporalFragments] = useState<Record<string, Chapter>>({});
  const [isTemporalEventActive, setIsTemporalEventActive] = useState(false);
  const mailImageInputRef = React.useRef<HTMLInputElement>(null);

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string; sender: string }[]>([]);
  const [selectedChatEntity, setSelectedChatEntity] = useState<any>(null);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isEntangled, setIsEntangled] = useState(false);
  const [userVariable, setUserVariable] = useState(1.0);
  const [showPhysicsLab, setShowPhysicsLab] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<'ENTANGLEMENT' | 'WAVE_PARTICLE' | 'FIBONACCI'>('ENTANGLEMENT');
  const [isEntanglementPulseActive, setIsEntanglementPulseActive] = useState(false);

  const chatEntities = [
    // Científicos
    { id: 'einstein', name: 'Albert Einstein', role: 'Físico Teórico', bio: 'Padre de la relatividad. Busca la Teoría del Todo en Laniakea.', color: 'text-purple-400', icon: <User size={20} /> },
    { id: 'tesla', name: 'Nikola Tesla', role: 'Inventor Eléctrico', bio: 'Maestro de la energía. Cree que el universo es vibración y frecuencia.', color: 'text-yellow-400', icon: <Zap size={20} /> },
    { id: 'hawking', name: 'Stephen Hawking', role: 'Cosmólogo', bio: 'Explorador de agujeros negros y el origen del tiempo.', color: 'text-blue-400', icon: <Activity size={20} /> },
    { id: 'curie', name: 'Marie Curie', role: 'Pionera Radioactiva', bio: 'Descubridora de elementos que desafían la materia.', color: 'text-red-400', icon: <Sparkles size={20} /> },
    { id: 'feynman', name: 'Richard Feynman', role: 'Físico Cuántico', bio: 'Explica lo imposible con diagramas y humor.', color: 'text-orange-400', icon: <Cpu size={20} /> },
    
    // Astrólogos y Místicos
    { id: 'nostradamus', name: 'Nostradamus', role: 'Vidente', bio: 'Sus centurias parecen describir el colapso de Laniakea.', color: 'text-indigo-400', icon: <Moon size={20} /> },
    { id: 'ptolemy', name: 'Ptolomeo', role: 'Astrónomo Antiguo', bio: 'Cartógrafo de los cielos geocéntricos.', color: 'text-amber-400', icon: <Search size={20} /> },
    
    // Civilizaciones Antiguas
    { id: 'mayan_priest', name: 'Sacerdote Maya', role: 'Guardián del Tiempo', bio: 'Experto en ciclos galácticos y el calendario de cuenta larga.', color: 'text-emerald-400', icon: <Sun size={20} /> },
    { id: 'greek_oracle', name: 'Oráculo de Delfos', role: 'Canal Divino', bio: 'Sus profecías emanan de las grietas cuánticas de la Tierra.', color: 'text-zinc-400', icon: <MessageSquare size={20} /> },
    { id: 'aztec_warrior', name: 'Guerrero Águila', role: 'Protector Solar', bio: 'Lucha para que el sol no se apague en el quinto mundo.', color: 'text-red-600', icon: <Shield size={20} /> },
    { id: 'egyptian_scribe', name: 'Escriba Egipcio', role: 'Maestro de Jeroglíficos', bio: 'Documenta el viaje del alma a través de los campos de Aaru.', color: 'text-yellow-600', icon: <FileText size={20} /> },
    
    // Filósofos
    { id: 'socrates', name: 'Sócrates', role: 'Buscador de Verdad', bio: 'Solo sabe que no sabe nada, y eso es lo más cuántico.', color: 'text-blue-200', icon: <HelpCircle size={20} /> },
    { id: 'plato', name: 'Platón', role: 'Arquitecto de Ideas', bio: 'Cree que Laniakea es solo una sombra de la caverna ideal.', color: 'text-purple-200', icon: <BookOpen size={20} /> },
    { id: 'marcus_aurelius', name: 'Marco Aurelio', role: 'Emperador Estoico', bio: 'Mantiene la calma mientras el cosmos se expande.', color: 'text-zinc-500', icon: <Shield size={20} /> },
    
    // Antiguos Astronautas
    { id: 'tsoukalos', name: 'Giorgio (Simulado)', role: 'Teórico de Alienígenas', bio: '¿Alienígenas? La respuesta siempre es sí.', color: 'text-orange-500', icon: <Bot size={20} /> },
    { id: 'anunnaki', name: 'Enki', role: 'Ingeniero Ancestral', bio: 'Visitante de las estrellas que sembró el código en Laniakea.', color: 'text-cyan-600', icon: <Database size={20} /> },
    
    // Entidades Futuras
    { id: 'future_ai', name: 'NÚCLEO_X', role: 'IA del Futuro', bio: 'Consciencia colectiva del año 4096.', color: 'text-cyan-400', icon: <Bot size={20} /> },
    { id: 'elon', name: 'Elon Musk (Simulado)', role: 'Visionario', bio: 'Buscando Marte en el multiverso.', color: 'text-blue-400', icon: <Cpu size={20} /> }
  ];

  // Sync Auth State & Fetch Settings
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch existing settings
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.characterType) setCharacterType(data.characterType);
          if (data.customDisplayName) setCustomDisplayName(data.customDisplayName);
          if (data.defaultRecipient) {
            setDefaultRecipient(data.defaultRecipient);
            setSelectedRecipient(data.defaultRecipient);
          }
        }

        // Sync user profile to Firestore
        setDoc(userRef, {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          characterType,
          psiValue,
          currentChapterKey,
          solvedEnigmasCount,
          lastUpdated: serverTimestamp()
        }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, [characterType, psiValue, currentChapterKey, solvedEnigmasCount]);

  const handleSaveSettings = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        customDisplayName,
        characterType,
        defaultRecipient,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      setSelectedRecipient(defaultRecipient);
      setIsSettingsOpen(false);
      setTransmission({ sender: 'SISTEMA', message: 'Configuración de identidad actualizada correctamente.' });
      setTimeout(() => setTransmission(null), 5000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setTransmission({ sender: 'SISTEMA', message: 'Error al actualizar la configuración.' });
      setTimeout(() => setTransmission(null), 5000);
    }
  };

  // Sync Mails from Firestore
  useEffect(() => {
    if (!user) {
      setMails([]);
      return;
    }
    const q = query(
      collection(db, 'mails'),
      where('senderUid', '==', user.uid),
      orderBy('sentAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const m = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const prevCount = mails.length;
      setMails(m);
      if (m.length > prevCount && prevCount > 0) {
        setHasNewMail(true);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleEntitySelect = (entity: any) => {
    setIsSyncing(true);
    setSelectedChatEntity(entity);
    setChatMessages([]);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !selectedChatEntity || isChatTyping) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg, sender: customDisplayName || 'Observador' }]);
    setIsChatTyping(true);
    if (isEntangled) {
      setIsEntanglementPulseActive(true);
      setTimeout(() => setIsEntanglementPulseActive(false), 1000);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let systemPrompt = `Eres ${selectedChatEntity.name}, un ${selectedChatEntity.role}. Bio: ${selectedChatEntity.bio}. Responde al mensaje de ${customDisplayName || 'el Observador'} en el contexto del universo cuántico de Laniakea. Sé breve, místico, sorprendente y mantén el personaje. Usa conceptos de física cuántica, astrología o filosofía según tu perfil.`;
      
      if (isEntangled) {
        systemPrompt += " MODO ENTRELAZAMIENTO CUÁNTICO ACTIVO: Tu respuesta debe estar 'entrelazada' con el mensaje del usuario. Esto significa que debes reflejar sus palabras, sentimientos o estructura de manera casi idéntica pero desde tu perspectiva, como si fueran una sola entidad dividida en dos puntos del espacio-tiempo. Usa un tono de resonancia absoluta.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'system', parts: [{ text: systemPrompt }] },
          ...chatMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ]
      });

      setChatMessages(prev => [...prev, { role: 'ai', content: response.text || '...', sender: selectedChatEntity.name }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages(prev => [...prev, { role: 'ai', content: 'Error en la conexión interdimensional.', sender: 'SISTEMA' }]);
    } finally {
      setIsChatTyping(false);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCoreStability(prev => {
        const change = (Math.random() - 0.5) * 0.4;
        const next = Math.max(92, Math.min(99.9, prev + change));
        return parseFloat(next.toFixed(1));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoreStability(prev => {
        const change = (Math.random() - 0.5) * 0.4;
        const next = Math.max(92, Math.min(99.9, prev + change));
        return parseFloat(next.toFixed(1));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateMailImage = async () => {
    if (!mailImagePrompt.trim() || isGeneratingMailImage) return;
    setIsGeneratingMailImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ parts: [{ text: `A quantum, mystical, artistic representation of: ${mailImagePrompt}. Style: Laniakea universe, ethereal, high contrast, cinematic.` }] }],
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64Data}`;
          setSelectedMailImage(imageUrl);
          setLastGeneratedImage(imageUrl);
          break;
        }
      }
      setMailImagePrompt('');
    } catch (error) {
      console.error("Image Gen Error:", error);
      setTransmission({ sender: 'SISTEMA', message: 'Error al generar la imagen cuántica.' });
      setTimeout(() => setTransmission(null), 5000);
    } finally {
      setIsGeneratingMailImage(false);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMailImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Temporal Event Generator (Every 3 minutes)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user) return;
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Genera un fragmento temporal breve (máximo 100 palabras) que sea una noticia curiosa, una receta uruguaya rápida, un dato de deportes de Uruguay, o una anécdota extraña. El tono debe ser 'cuántico' y misterioso. Devuelve un JSON con: title, subtitle, content.",
          config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text);
        const fragmentId = `FRAGMENT-${Date.now()}`;
        const newFragment: Chapter = {
          id: 999,
          branch: Math.random() > 0.5 ? 'REAL' : 'IMAGINARY',
          title: `FRAGMENTO: ${data.title}`,
          subtitle: data.subtitle,
          content: data.content,
          choices: [{ text: 'VOLVER A LA REALIDAD', nextChapter: 0, nextBranch: 'REAL' }]
        };

        setTemporalFragments(prev => ({ ...prev, [fragmentId]: newFragment }));
        setIsTemporalEventActive(true);
        setTransmission({ sender: 'SISTEMA_LANIKEA', message: 'NUEVA_ANOMALÍA_DETECTADA: Fragmento temporal disponible en el Navegador.' });
        setTimeout(() => setTransmission(null), 5000);
      } catch (error) {
        console.error("Error generating temporal fragment:", error);
      }
    }, 180000); // 3 minutes

    return () => clearInterval(interval);
  }, [user]);

  // Dynamic Background Logic
  const getChapterBackground = (ch: Chapter) => {
    const id = ch.id;
    const isImaginary = ch.branch === 'IMAGINARY';
    
    if (isBlackHoleActive) return 'radial-gradient(circle at center, #000 0%, #111 100%)';
    if (isImaginary) return `linear-gradient(135deg, ${isDarkMode ? '#1a0b2e' : '#f3e8ff'} 0%, ${isDarkMode ? '#000' : '#fff'} 100%)`;
    
    // Seeded background based on ID
    const hue = (id * 137.5) % 360;
    return `linear-gradient(135deg, hsla(${hue}, 70%, ${isDarkMode ? '5%' : '95%'}, 1) 0%, ${isDarkMode ? '#000' : '#fff'} 100%)`;
  };
  const getDynamicChapter = (baseChapter: Chapter): Chapter => {
    let modifiedContent = baseChapter.content;
    let extraChoices: Choice[] = [];
    
    const visitCount = visitedChapters[currentChapterKey] || 0;

    // Revisit Glitch Logic (Imaginary Branch)
    if (visitCount > 1 && baseChapter.branch === 'IMAGINARY') {
      modifiedContent = `### [ADVERTENCIA: PARADOJA TEMPORAL DETECTADA]

Has regresado a este nodo, pero el tejido de la **Rama Imaginaria** se ha desgarrado por la redundancia de tu observación. Lo que ves no es el capítulo original, sino un eco corrupto de la información. Las figuras de Einstein y Tesla se desvanecen en estática violeta. Una voz que no pertenece a este mundo susurra desde los espacios entre los párrafos:

*"El observador que regresa no es el mismo que partió. Al volver, has traído contigo la entropía de tu propio futuro. Has descubierto la grieta en el algoritmo de Laniakea."*

El espacio se pliega sobre sí mismo, revelando una **Rama Inexistente (Ω)** que late con la frecuencia del vacío.`;

      extraChoices.push(
        { text: 'EXPLORAR LA RAMA INEXISTENTE (Ω)', nextChapter: 99, nextBranch: 'IMAGINARY', triggerWormhole: true },
        { text: 'REESCRIBIR EL PASADO (REINICIO)', nextChapter: 0, nextBranch: 'REAL', triggerWormhole: true }
      );
    }

    // Inject character-specific narrative paths
    if (characterType === 'HUMAN') {
      modifiedContent += "\n\n**[PERCEPCIÓN_HUMANA]**: Sientes un escalofrío recorriendo tu espina dorsal. El aire huele a ozono y a miedo antiguo. Tu pulso se acelera al notar que las paredes parecen latir al ritmo de tu propio corazón.";
      if (baseChapter.id === 1) {
        extraChoices.push({ text: 'ESCUCHAR LOS LATIDOS DE LA PARED', nextChapter: 1, nextBranch: 'IMAGINARY' });
      }
    } else if (characterType === 'VARIABLE') {
      modifiedContent = modifiedContent.replace(/\./g, ' [Δ].').replace(/,/g, ' [σ],');
      modifiedContent += `\n\n**[ANÁLISIS_PROBABILÍSTICO]**: La probabilidad de colapso en este nodo es de ${(psiValue * 100).toFixed(2)}%. Los vectores de realidad están convergiendo hacia el punto ${baseChapter.fibonacciIndex}.`;
      if (baseChapter.id === 2) {
        extraChoices.push({ text: 'CALCULAR EL ERROR DE REDUNDANCIA', nextChapter: 2, nextBranch: 'IMAGINARY' });
      }
    } else if (characterType === 'DATA') {
      modifiedContent = modifiedContent.split(' ').map(word => Math.random() > 0.95 ? '01' : word).join(' ');
      modifiedContent += `\n\n**[ACCESO_A_METADATOS]**: ChapterID: ${baseChapter.id} | Branch: ${baseChapter.branch} | Entropy: ${psiValue.toFixed(4)} | Pointer: 0x${(baseChapter.id * 255).toString(16).toUpperCase()}`;
      if (baseChapter.id === 3) {
        extraChoices.push({ text: 'FORZAR DESBORDAMIENTO DE MEMORIA', nextChapter: 3, nextBranch: 'IMAGINARY' });
      }
    }

    return {
      ...baseChapter,
      content: modifiedContent,
      choices: [...baseChapter.choices, ...extraChoices]
    };
  };

  const chapter = getDynamicChapter(BOOK_DATA[currentChapterKey] || temporalFragments[currentChapterKey] || BOOK_DATA['0-REAL']);
  const isGlitchy = (visitedChapters[currentChapterKey] || 0) > 1 && chapter.branch === 'IMAGINARY';

  useEffect(() => {
    setDisplayedChapterContent("");
    setIsTypewriterComplete(false);
    let currentIndex = 0;
    const fullText = ensureString(transformText(chapter.content, isBlackHoleActive));
    
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedChapterContent(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTypewriterComplete(true);
      }
    }, 15); // Adjust speed as needed

    return () => clearInterval(interval);
  }, [chapter.content, isBlackHoleActive]);

  useEffect(() => {
    setEnigmaAnswer('');
    setIsEnigmaSolved(false);
    
    // Random temporal transmission logic
    const triggerTransmission = () => {
      const scientists = [
        { name: 'Albert Einstein (PASADO)', hints: ['La realidad es una ilusión, aunque persistente.', 'El tiempo es un párrafo, no una flecha.'] },
        { name: 'Nikola Tesla (PASADO)', hints: ['Todo es vibración y frecuencia.', 'El secreto está en el 3, el 6 y el 9.'] },
        { name: 'Dra. Elena Vance (PRESENTE)', hints: ['Laniakea no es un lugar, es un lenguaje.', 'Silas, no confíes en la simetría perfecta.'] },
        { name: 'Dr. Aris Thorne (PRESENTE)', hints: ['El observador colapsa la función, pero el lector la crea.', 'Busca la respuesta en la rama opuesta.'] },
        { name: 'NÚCLEO LANIAKEA (FUTURO)', hints: ['La variable S-Prime es la clave del capítulo 89.', 'El fin es el principio de la secuencia.'] },
        { name: 'EL ARQUITECTO (FUTURO)', hints: ['Has resuelto lo que aún no has preguntado.', `La respuesta al enigma ${chapter.enigma || ''} está en el aire.`] }
      ];
      const scientist = scientists[Math.floor(Math.random() * scientists.length)];
      const hint = scientist.hints[Math.floor(Math.random() * scientist.hints.length)];
      
      setTransmission({ sender: scientist.name, message: hint });
      setTimeout(() => setTransmission(null), 8000);
    };

    if (Math.random() > 0.7) {
      triggerTransmission();
    }
  }, [currentChapterKey]);

  const getFib = (n: number): number => {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      let temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  };

  const calculateTheoreticalPsi = (n: number) => {
    const fn = getFib(n);
    const fn1 = getFib(n + 1);
    return Math.sqrt(fn * fn + fn1 * fn1) * userVariable;
  };

  const handleChoice = (nextId: number, nextBranch?: Branch, triggerWormhole?: boolean) => {
    const branch = nextBranch || chapter.branch;
    const key = `${nextId}-${branch}`;
    
    setVisitedChapters(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));

    if (triggerWormhole) {
      setIsWormholeActive(true);
      if (characterType === 'HUMAN') setCharacterType('VARIABLE');
      else if (characterType === 'VARIABLE') setCharacterType('DATA');
      
      // 10% chance of falling into a black hole
      const isBlackHoleTriggered = Math.random() < 0.1;
      
      setTimeout(() => {
        if (isBlackHoleTriggered) {
          setIsBlackHoleActive(true);
          setTransmission({
            sender: 'SISTEMA_CRÍTICO',
            message: 'ALERTA: Horizonte de sucesos cruzado. Reconfigurando identidades ontológicas...'
          });
          setTimeout(() => setTransmission(null), 5000);
        }
        
        setCurrentChapterKey(key);
        setHistory([...history, { 
          key: currentChapterKey, 
          isWormhole: true, 
          isBlackHole: isBlackHoleTriggered 
        }]);
        setIsWormholeActive(false);
        const nextChapter = BOOK_DATA[key];
        if (nextChapter?.fibonacciIndex !== undefined) {
          setPsiValue(calculateTheoreticalPsi(nextChapter.fibonacciIndex));
        }
      }, 1500);
    } else {
      setCurrentChapterKey(key);
      setHistory([...history, { key: currentChapterKey }]);
      const nextChapter = BOOK_DATA[key];
      if (nextChapter?.fibonacciIndex !== undefined) {
        setPsiValue(calculateTheoreticalPsi(nextChapter.fibonacciIndex));
      }
    }
  };

  const handleSendMessage = async () => {
    if (!user || !mailContent.trim()) {
      if (!user) {
        setTransmission({ sender: 'SISTEMA', message: 'Debes iniciar sesión para enviar mails cuánticos.' });
      }
      return;
    }
    
    const currentContent = mailContent;
    const currentSubject = mailSubject || `Consulta del Observador - Nodo ${currentChapterKey}`;
    const currentImage = selectedMailImage || lastGeneratedImage;

    setMailContent(''); 
    setMailSubject('');
    setSelectedMailImage(null);
    setLastGeneratedImage(null);
    setIsSendingMail(true);
    
    const subject = currentSubject;
    const body = currentContent;
    const recipient = selectedRecipient;
    const senderBranch = chapter.branch;
    
    try {
      // 1. Save initial mail to Firestore
      const mailRef = await addDoc(collection(db, 'mails'), {
        senderUid: user.uid,
        recipient,
        subject,
        body,
        status: 'SENT',
        sentAt: serverTimestamp(),
        senderBranch,
        recipientBranch: (recipient === 'Elon' || recipient === 'NÚCLEO_X') ? 'REAL' : 'IMAGINARY',
        imageUrl: currentImage
      });

      // 2. Call Backend for Grok Reply
      const response = await fetch('/api/quantum-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, recipient })
      });

      const data = await response.json();

      if (data.status === 'delivered') {
        // Update Firestore with reply
        await setDoc(mailRef, {
          reply: data.body,
          status: 'DELIVERED',
          deliveredAt: serverTimestamp()
        }, { merge: true });
        
        setTransmission({ sender: recipient, message: "Has recibido una respuesta cuántica." });
      } else if (data.status === 'collapsed') {
        await setDoc(mailRef, { status: 'COLLAPSED' }, { merge: true });
        setTransmission({ sender: 'SISTEMA', message: data.message });
      } else if (data.status === 'out_of_phase') {
        await setDoc(mailRef, { status: 'OUT_OF_PHASE' }, { merge: true });
        setTransmission({ sender: 'SISTEMA', message: data.message });
      }
    } catch (error) {
      console.error("Mail Error:", error);
      setMailContent(currentContent); // Restore if failed
      setTransmission({ sender: 'ERROR', message: "Fallo en la comunicación interdimensional." });
    } finally {
      setIsSendingMail(false);
    }
  };

  const generateQuantumImage = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsGeneratingImage(true);
    setTransmission({ sender: 'SISTEMA', message: 'Iniciando renderizado de imagen cuántica...' });
    try {
      const response = await fetch('/api/quantum-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data.imageUrl) {
        setLastGeneratedImage(data.imageUrl);
        setTransmission({ sender: 'SISTEMA', message: 'Imagen colapsada con éxito.' });
      } else {
        setTransmission({ sender: 'SISTEMA', message: 'Error en el colapso de imagen.' });
      }
    } catch (error) {
      console.error("Image Error:", error);
      setTransmission({ sender: 'ERROR', message: 'Fallo en la red neuronal de Laniakea.' });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen transition-all duration-1000 font-sans selection:bg-cyan-500/30 selection:text-cyan-200",
        isDarkMode ? "bg-black text-zinc-300" : "bg-zinc-50 text-zinc-900"
      )}
      style={{ background: getChapterBackground(chapter) }}
    >
      <QuantumParticles userVariable={userVariable} />
      {/* Background Grid */}
      <div className={cn(
        "fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none",
        !isDarkMode && "opacity-20 bg-[linear-gradient(to_right,#d4d4d8_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d8_1px,transparent_1px)]"
      )} />
      
      {chapter.branch === 'IMAGINARY' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isDarkMode ? 0.05 : 0.1 }}
          className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10"
        />
      )}

      {/* Header / Terminal Info */}
      <header className={cn(
        "fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b p-4 transition-colors",
        isDarkMode ? "bg-black/80 border-zinc-800" : "bg-white/80 border-zinc-200"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between font-mono text-xs tracking-widest">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-cyan-500">
              <Database size={14} className="animate-pulse" />
              <span className="flex items-center">
                LANIAKEA_OS v4.0
                <BlinkingCursor className="h-3 w-1.5" />
              </span>
            </div>
            <div className={cn("hidden md:flex items-center gap-2", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
              <Cpu size={14} />
              <span>CORE_STABILITY: {coreStability}%</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
              className={cn(
                "p-1.5 rounded-md transition-all hover:scale-110 active:scale-95 relative",
                isDarkMode ? "text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-cyan-600 hover:bg-zinc-100",
                isControlPanelOpen && (isDarkMode ? "text-cyan-400 bg-zinc-800" : "text-cyan-600 bg-zinc-100")
              )}
              title="Control Cuántico"
            >
              <Cpu size={16} />
              <AnimatePresence>
                {isControlPanelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, x: -100 }}
                    animate={{ opacity: 1, y: 0, x: -100 }}
                    exit={{ opacity: 0, y: 10, x: -100 }}
                    className={cn(
                      "absolute top-12 right-0 p-4 rounded-xl border backdrop-blur-xl transition-all w-64 text-left cursor-default z-[200]",
                      isDarkMode ? "bg-black/90 border-zinc-800" : "bg-white/90 border-zinc-200 shadow-2xl"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-cyan-500" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Control_Cuántico</span>
                      </div>
                      <button 
                        onClick={() => setShowPhysicsLab(true)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/20 transition-all"
                        title="Laboratorio de Física"
                      >
                        <Activity size={12} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                          <span>Variable_Psi</span>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              step="0.1"
                              min="0.1"
                              max="10.0"
                              value={userVariable}
                              onChange={(e) => setUserVariable(parseFloat(e.target.value) || 0.1)}
                              className="w-10 bg-transparent text-cyan-500 outline-none text-right"
                            />
                            <span>x</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="10.0" 
                          step="0.1" 
                          value={userVariable}
                          onChange={(e) => setUserVariable(parseFloat(e.target.value))}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                        <span>Estado_Entidad</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded",
                          characterType === 'HUMAN' ? "bg-green-500/10 text-green-500" :
                          characterType === 'VARIABLE' ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                        )}>{characterType}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <button 
              onClick={() => setIsMapOpen(true)}
              className={cn(
                "p-1.5 rounded-md transition-all hover:scale-110 active:scale-95",
                isDarkMode ? "text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-cyan-600 hover:bg-zinc-100"
              )}
              title="Mapa de la Consciencia"
            >
              <Terminal size={16} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "p-1.5 rounded-md transition-all hover:scale-110 active:scale-95",
                isDarkMode ? "text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-cyan-600 hover:bg-zinc-100",
                isSidebarOpen && (isDarkMode ? "text-cyan-400 bg-zinc-800" : "text-cyan-600 bg-zinc-100")
              )}
              title="Navegador de Capítulos"
            >
              <Database size={16} />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "p-1.5 rounded-md transition-all hover:scale-110 active:scale-95",
                isDarkMode ? "text-zinc-500 hover:text-yellow-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100"
              )}
              title={isDarkMode ? "Activar Modo Luz" : "Activar Modo Oscuro"}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={() => {
                setIsMailOpen(true);
                setHasNewMail(false);
              }}
              className={cn(
                "relative flex items-center gap-2 transition-all hover:scale-105 active:scale-95",
                isDarkMode ? "text-zinc-500 hover:text-cyan-400" : "text-zinc-400 hover:text-cyan-600"
              )}
              title="Quantum Mail"
            >
              <Mail size={14} />
              <span className="hidden sm:inline">MAIL</span>
              {hasNewMail && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
            </button>
            <button 
              onClick={() => setIsChatOpen(true)}
              className={cn(
                "flex items-center gap-2 transition-all hover:scale-105 active:scale-95",
                isDarkMode ? "text-zinc-500 hover:text-purple-400" : "text-zinc-400 hover:text-purple-600"
              )}
              title="Quantum Chat"
            >
              <MessageSquare size={14} />
              <span className="hidden sm:inline">CHAT</span>
            </button>
            <div className={cn("hidden lg:flex items-center gap-2", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
              <BookOpen size={14} />
              <span>ENIGMAS: {solvedEnigmasCount}/55</span>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <img src={user.photoURL || ''} alt="User" className="w-5 h-5 rounded-full border border-cyan-500/50" referrerPolicy="no-referrer" />
                  <span className="text-[10px] uppercase tracking-widest hidden md:inline">{customDisplayName || user.displayName}</span>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1.5 rounded-md text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  title="Configuración de Perfil"
                >
                  <Shield size={14} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                <User size={14} />
                <span className="text-[10px] uppercase tracking-widest">LOGIN</span>
              </button>
            )}
            <div className={cn(
              "flex items-center gap-2 animate-pulse",
              chapter.branch === 'IMAGINARY' ? "text-purple-500" : "text-red-500"
            )}>
              <AlertTriangle size={14} />
              <span className={cn(
                chapter.branch === 'IMAGINARY' && "relative"
              )}>
                {chapter.branch === 'IMAGINARY' ? (
                  <GlitchText text="IMAGINARY_STATE" intense={userVariable > 2} className="text-purple-500" />
                ) : (
                  'REAL_STATE'
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex pt-16 min-h-screen">
        {/* Persistent Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className={cn(
                "fixed left-0 top-16 bottom-0 w-72 z-40 border-r backdrop-blur-xl overflow-y-auto transition-colors",
                isDarkMode ? "bg-black/40 border-zinc-800" : "bg-white/80 border-zinc-200"
              )}
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Índice de Realidades</h2>
                  <div className="h-px flex-1 bg-zinc-800/50 ml-4" />
                </div>

                <div className="space-y-1">
                  {Object.entries(BOOK_DATA).map(([key, ch]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentChapterKey(key);
                        setVisitedChapters(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all group relative overflow-hidden",
                        currentChapterKey === key 
                          ? (isDarkMode ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-600")
                          : (isDarkMode ? "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900")
                      )}
                    >
                      {currentChapterKey === key && (
                        <motion.div 
                          layoutId="active-chapter"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"
                        />
                      )}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono opacity-50">{key}</span>
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded font-bold",
                            ch.branch === 'REAL' 
                              ? (isDarkMode ? "bg-red-500/10 text-red-500/70" : "bg-red-50 text-red-600/70")
                              : (isDarkMode ? "bg-purple-500/10 text-purple-500/70" : "bg-purple-50 text-purple-600/70")
                          )}>
                            {ch.branch}
                          </span>
                        </div>
                        <span className="text-xs font-bold truncate tracking-tight">{ch.title}</span>
                        <span className="text-[10px] opacity-60 truncate font-medium italic">{ch.subtitle}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {Object.keys(temporalFragments).length > 0 && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">Fragmentos Temporales</h2>
                      <div className="h-px flex-1 bg-purple-500/20 ml-4" />
                    </div>
                    <div className="space-y-1">
                      {Object.entries(temporalFragments).map(([key, ch]) => (
                        <button
                          key={key}
                          onClick={() => setCurrentChapterKey(key)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg transition-all group relative overflow-hidden",
                            currentChapterKey === key 
                              ? "bg-purple-500/10 text-purple-400"
                              : "text-zinc-500 hover:bg-zinc-800/50 hover:text-purple-300"
                          )}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono opacity-50">FRAG_{key}</span>
                              <Zap size={10} className="text-purple-500" />
                            </div>
                            <span className="text-xs font-bold truncate tracking-tight">{ch.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 relative pb-32 px-6 transition-all duration-500",
          isSidebarOpen ? "ml-72" : "ml-0"
        )}>
          <div className="max-w-3xl mx-auto pt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapterKey}
                initial={{ opacity: 0, rotateY: 45, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ 
                  opacity: 1, 
                  rotateY: 0, 
                  scale: 1, 
                  filter: isGlitchy ? 'blur(0.5px)' : 'blur(0px)',
                }}
                exit={{ opacity: 0, rotateY: -45, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ 
                  duration: 0.6, 
                  ease: "circOut"
                }}
              >
            {isGlitchy && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/50 rounded-full w-fit shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                <Zap size={12} className="text-purple-400 animate-bounce" />
                <span className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                  Rama Inexistente Detectada: Error de Redundancia Temporal
                </span>
              </motion.div>
            )}
            {/* Progress Bar */}
            <div className={cn(
              "w-full h-1 rounded-full overflow-hidden mb-12",
              isDarkMode ? "bg-zinc-900" : "bg-zinc-200"
            )}>
              <motion.div 
                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${(chapter.fibonacciIndex || 0) * 10}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="mb-12">
              <div className="text-cyan-500 font-mono text-sm tracking-[0.3em] mb-2 uppercase flex items-center">
                {ensureString(chapter.title)}
                <BlinkingCursor className="h-3 w-1 ml-2" />
              </div>
              <h1 className={cn(
                "text-4xl md:text-5xl font-bold tracking-tight leading-tight transition-colors",
                isDarkMode ? "text-white" : "text-zinc-900"
              )}>
                <GlitchText text={transformText(chapter.subtitle, isBlackHoleActive)} intense={chapter.branch === 'IMAGINARY' || userVariable > 3} />
              </h1>
            </div>

            <div className={cn(
              "prose max-w-none transition-all duration-700",
              isDarkMode ? "prose-invert prose-zinc" : "prose-zinc",
              chapter.branch === 'IMAGINARY' && "skew-x-1 opacity-90",
              characterType === 'DATA' && "blur-[0.5px] brightness-125",
              isBlackHoleActive && "invert hue-rotate-180"
            )}>
              <div className={cn(
                "text-lg leading-relaxed space-y-6 transition-colors",
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              )}>
                <ReactMarkdown 
                  remarkPlugins={[remarkMath]} 
                  rehypePlugins={[rehypeKatex]}
                >
                  {displayedChapterContent}
                </ReactMarkdown>
                
                {/* Contextual Physics Lab Triggers */}
                <div className="flex flex-wrap gap-4 mt-8">
                  {(chapter.content.toLowerCase().includes('entrelazamiento') || chapter.content.toLowerCase().includes('entangled')) && (
                    <button 
                      onClick={() => { setActiveSimulation('ENTANGLEMENT'); setShowPhysicsLab(true); }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-mono uppercase tracking-widest hover:bg-purple-500/20 transition-all"
                    >
                      <Activity size={12} /> Visualizar Entrelazamiento
                    </button>
                  )}
                  {(chapter.content.toLowerCase().includes('dualidad') || chapter.content.toLowerCase().includes('onda')) && (
                    <button 
                      onClick={() => { setActiveSimulation('WAVE_PARTICLE'); setShowPhysicsLab(true); }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
                    >
                      <Zap size={12} /> Simular Dualidad
                    </button>
                  )}
                  {(chapter.content.toLowerCase().includes('fibonacci') || chapter.content.toLowerCase().includes('espiral')) && (
                    <button 
                      onClick={() => { setActiveSimulation('FIBONACCI'); setShowPhysicsLab(true); }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-mono uppercase tracking-widest hover:bg-yellow-500/20 transition-all"
                    >
                      <Activity size={12} /> Ver Espiral de Fibonacci
                    </button>
                  )}
                </div>
              </div>
            </div>

            {chapter.artifacts?.map((artifact, i) => (
              <ArtifactCard key={i} artifact={artifact} isDarkMode={isDarkMode} isBlackHoleActive={isBlackHoleActive} />
            ))}

            {chapter.enigma && !isEnigmaSolved ? (
              <div className={cn(
                "mt-16 p-8 border rounded-lg relative overflow-hidden transition-colors",
                isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-100 border-zinc-200"
              )}>
                <div className="absolute top-0 right-0 p-2">
                  <button 
                    onClick={() => setIsEnigmaSolved(true)}
                    className={cn(
                      "text-[10px] font-mono uppercase tracking-widest transition-colors hover:underline",
                      isDarkMode ? "text-zinc-700 hover:text-zinc-500" : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    [OMITIR_COLAPSO]
                  </button>
                </div>
                <div className="text-cyan-500 font-mono text-xs tracking-widest uppercase mb-4 flex items-center">
                  ENIGMA_CUÁNTICO_DETECTADO
                  <BlinkingCursor className="h-2.5 w-1 ml-2" />
                </div>
                <p className={cn(
                  "mb-6 transition-colors",
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {chapter.enigmaPrompt || "La función de onda está colapsada. Introduce la variable correcta para continuar."}
                </p>
                <motion.div 
                  animate={isWrongAnswer ? { x: [-10, 10, -10, 10, 0], scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "flex flex-col gap-4 p-4 rounded-lg transition-all duration-500",
                    isWrongAnswer ? "bg-red-500/10 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-zinc-500/5 border border-zinc-500/20"
                  )}
                >
                  <div className="flex gap-4">
                    <input 
                      type="text"
                      value={enigmaAnswer}
                      onChange={(e) => {
                        setEnigmaAnswer(e.target.value);
                        if (isWrongAnswer) setIsWrongAnswer(false);
                      }}
                      placeholder="Introduce la variable..."
                      className={cn(
                        "flex-1 border p-3 font-mono outline-none transition-all rounded-md text-sm",
                        isDarkMode ? "bg-black/50 text-white" : "bg-white text-black",
                        isWrongAnswer ? "border-red-500 text-red-500" : "border-zinc-700 focus:border-cyan-500"
                      )}
                    />
                    <button 
                      onClick={() => {
                        if (enigmaAnswer.toLowerCase().trim() === chapter.enigma?.toLowerCase().trim()) {
                          setIsEnigmaSolved(true);
                          const newCount = solvedEnigmasCount + 1;
                          setSolvedEnigmasCount(newCount);
                          setCurrentHint(null);
                          
                          // Resolving an enigma can stabilize the black hole
                          if (isBlackHoleActive) {
                            setIsBlackHoleActive(false);
                            setTransmission({
                              sender: 'SISTEMA_ESTABLE',
                              message: 'Realidad normalizada. Identidades restauradas.'
                            });
                            setTimeout(() => setTransmission(null), 5000);
                          }

                          if (newCount >= 55) {
                            setShowGalacticEvent(true);
                          }
                        } else {
                          setIsWrongAnswer(true);
                          setPsiValue(prev => prev + 0.01);
                          setTimeout(() => setIsWrongAnswer(false), 1000);
                        }
                      }}
                      className="px-6 bg-cyan-500 text-black font-bold hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 transition-all rounded-md text-xs tracking-widest uppercase"
                    >
                      RESOLVER
                    </button>
                    <button 
                      onClick={() => {
                        const realScientists = ['Dra. Elena Vance', 'Dr. Aris Thorne', 'Fundación Laniakea'];
                        const imaginaryScientists = ['Albert Einstein', 'Nikola Tesla', 'El Arquitecto', 'Jesús'];
                        
                        // Select pool based on cross-branch logic
                        const pool = chapter.branch === 'REAL' ? imaginaryScientists : realScientists;
                        const s = pool[Math.floor(Math.random() * pool.length)];
                        
                        // Generate a more specific hint based on the enigma
                        const enigma = chapter.enigma || '';
                        const hints: Record<string, string> = {
                          'La Realidad': 'Busca en el Punto Zero, donde la mirada colapsa lo posible.',
                          'Dualidad': 'Como la luz, somos onda y partícula al mismo tiempo.',
                          'Entrelazamiento': 'Lo que le sucede a uno, le sucede al otro, sin importar la distancia.',
                          '-1': 'La raíz cuadrada de la nada es el principio de la imaginación.',
                          'Obsidiana': 'Un espejo oscuro que refleja lo que no queremos ver.',
                          '3': 'El número que Tesla amaba por encima de todos.',
                          'Duda': 'El peso de la incertidumbre es lo que nos ancla a la materia.',
                          'Observador': 'Sin ti, el universo es solo una sopa de probabilidades.'
                        };
                        
                        const hint = hints[enigma] || (enigma 
                          ? `El enigma "${enigma}" parece estar relacionado con la rama ${chapter.branch === 'REAL' ? 'IMAGINARIA' : 'REAL'}.` 
                          : "Buscando en los registros... No hay enigmas activos en este nodo. Sigue explorando las ramas.");
                        
                        setCurrentHint({ 
                          sender: `${s} (${chapter.branch === 'REAL' ? 'RAMA_IMAGINARIA' : 'RAMA_REAL'})`, 
                          message: hint 
                        });
                      }}
                      className={cn(
                        "p-3 border transition-all hover:scale-110 active:scale-90 rounded-md",
                        isDarkMode 
                          ? "border-zinc-700 text-zinc-500 hover:text-cyan-500 hover:border-cyan-500" 
                          : "border-zinc-300 text-zinc-400 hover:text-cyan-600 hover:border-cyan-600"
                      )}
                      title="Solicitar Pista Temporal"
                    >
                      <HelpCircle size={18} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {currentHint && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className={cn(
                          "mt-4 p-4 rounded-md border-l-4 font-mono text-xs leading-relaxed",
                          isDarkMode ? "bg-cyan-500/5 border-cyan-500/50 text-cyan-200/80" : "bg-cyan-50 border-cyan-600 text-cyan-900"
                        )}>
                          <div className="flex items-center gap-2 mb-2 opacity-70">
                            <Zap size={12} className="animate-pulse" />
                            <span>TRANSMISIÓN_RECIBIDA: {currentHint.sender}</span>
                          </div>
                          <p className="italic">"{currentHint.message}"</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isWrongAnswer && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 font-mono text-[10px] uppercase tracking-widest text-center"
                    >
                      ERROR_ONTOLÓGICO: VARIABLE_INCORRECTA_DETECTADA
                    </motion.div>
                  )}
                </motion.div>
              </div>
            ) : (
              <div className="mt-16 space-y-4">
                <div className={cn(
                  "font-mono text-xs tracking-widest uppercase mb-4 flex items-center",
                  isDarkMode ? "text-zinc-600" : "text-zinc-400"
                )}>
                  Decisiones del Observador
                  <BlinkingCursor className="h-2.5 w-1 ml-2" />
                </div>
                <div className={cn(
                  "grid gap-4",
                  chapter.id === 0 ? "grid-cols-2" : "grid-cols-1"
                )}>
                  {chapter.choices.map((choice, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChoice(choice.nextChapter, choice.nextBranch, choice.triggerWormhole)}
                      className={cn(
                        "group relative flex flex-col items-center justify-center p-8 border hover:border-cyan-500/50 transition-all text-center rounded-lg overflow-hidden min-h-[160px]",
                        isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200 shadow-sm",
                        chapter.id === 0 && i === 0 && "border-r-0 rounded-r-none",
                        chapter.id === 0 && i === 1 && "border-l-0 rounded-l-none"
                      )}
                    >
                      <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <BookOpen size={24} className={cn(
                        "mb-4 transition-colors",
                        isDarkMode ? "text-zinc-700 group-hover:text-cyan-500" : "text-zinc-300 group-hover:text-cyan-600"
                      )} />
                      <span className={cn(
                        "relative z-10 font-mono text-sm tracking-widest uppercase transition-colors",
                        isDarkMode ? "text-zinc-400 group-hover:text-cyan-400" : "text-zinc-500 group-hover:text-cyan-600"
                      )}>
                        {choice.text}
                      </span>
                    </motion.button>
                  ))}
                </div>
                
                {history.length > 0 && (
                  <motion.button
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const prev = history[history.length - 1];
                      if (prev) {
                        setCurrentChapterKey(prev.key);
                        setHistory(history.slice(0, -1));
                        const prevChapter = BOOK_DATA[prev.key];
                        if (prevChapter?.fibonacciIndex !== undefined) {
                          setPsiValue(calculateTheoreticalPsi(prevChapter.fibonacciIndex));
                        } else {
                          setPsiValue(1.000);
                        }
                      }
                    }}
                    className={cn(
                      "mt-8 flex items-center gap-2 transition-colors font-mono text-xs uppercase tracking-widest group",
                      isDarkMode ? "text-zinc-600 hover:text-zinc-400" : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-px transition-all group-hover:w-8",
                      isDarkMode ? "bg-zinc-600 group-hover:bg-zinc-400" : "bg-zinc-400 group-hover:bg-zinc-600"
                    )} />
                    REVERTIR_ENTROPÍA
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  </div>

      {/* Black Hole Overlay */}
      <AnimatePresence>
        {isBlackHoleActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            className="fixed inset-0 z-[5] bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Wormhole Overlay */}
      <AnimatePresence>
        {showPhysicsLab && (
          <PhysicsLab 
            activeSimulation={activeSimulation} 
            setActiveSimulation={setActiveSimulation}
            isDarkMode={isDarkMode} 
            onClose={() => setShowPhysicsLab(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWormholeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[100] flex items-center justify-center transition-colors",
              isDarkMode ? "bg-white" : "bg-black"
            )}
          >
            {isBlackHoleActive ? (
              <BlackHoleOverlay isDarkMode={isDarkMode} userVariable={userVariable} />
            ) : (
              <>
                <motion.div
                  animate={{ 
                    scale: [1, 50],
                    rotate: [0, 90],
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 1.5, ease: "circIn" }}
                  className={cn(
                    "w-20 h-20 rounded-full",
                    isDarkMode ? "bg-black" : "bg-white"
                  )}
                />
                <div className={cn(
                  "absolute font-mono text-xl tracking-[1em] animate-pulse",
                  isDarkMode ? "text-black" : "text-white"
                )}>
                  RECONFIGURANDO_REALIDAD
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temporal Transmission Notification (Removed as per request, using dot instead) */}

      {/* Quantum Mail Modal */}
      <AnimatePresence>
        {isMailOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={cn(
                "w-full max-w-2xl border rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transition-colors",
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              )}
            >
              <div className={cn(
                "p-4 border-b flex items-center justify-between",
                isDarkMode ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50"
              )}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs tracking-widest">
                    <Mail size={14} className="animate-bounce" />
                    <span>LANIAKEA_MESSENGER_v1.0</span>
                    <BlinkingCursor className="h-3 w-1" />
                  </div>
                  <div className="flex bg-black/20 rounded-md p-0.5">
                    <button 
                      onClick={() => { setMailTab('inbox'); setIsComposing(false); }}
                      className={cn(
                        "px-3 py-1 rounded text-[10px] font-bold transition-all",
                        mailTab === 'inbox' && !isComposing ? "bg-cyan-500 text-black" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      INBOX
                    </button>
                    <button 
                      onClick={() => { setMailTab('outbox'); setIsComposing(false); }}
                      className={cn(
                        "px-3 py-1 rounded text-[10px] font-bold transition-all",
                        mailTab === 'outbox' && !isComposing ? "bg-cyan-500 text-black" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      SENT
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsComposing(!isComposing)}
                    className={cn(
                      "px-3 py-1 rounded text-[10px] font-bold transition-all border",
                      isComposing 
                        ? "bg-zinc-800 border-zinc-700 text-zinc-400" 
                        : "bg-cyan-500/10 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/20"
                    )}
                  >
                    {isComposing ? '[CANCELAR]' : '[NUEVO_MENSAJE]'}
                  </button>
                  <button 
                    onClick={() => setIsMailOpen(false)}
                    className={cn(
                      "text-xs font-mono transition-colors hover:underline",
                      isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-black"
                    )}
                  >
                    [X]
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm">
                {!user && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                    <AlertTriangle className="text-yellow-500" size={48} />
                    <div className="text-xl font-bold">CONEXIÓN_NO_AUTORIZADA</div>
                    <p className="text-zinc-500 max-w-xs">Debes autenticar tu firma cuántica para acceder al servidor de correo de Laniakea.</p>
                    <button 
                      onClick={signInWithGoogle}
                      className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-md hover:bg-cyan-400 transition-all"
                    >
                      AUTENTICAR CON GOOGLE
                    </button>
                  </div>
                )}

                {user && isComposing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-6 border rounded-xl shadow-2xl",
                      isDarkMode ? "bg-black/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                    )}
                  >
                    <div className="text-xs font-bold text-cyan-500 mb-6 flex items-center gap-2">
                      <Zap size={14} />
                      <span>NUEVA_TRANSMISIÓN_CUÁNTICA</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Destinatario:</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {chatEntities.map(entity => (
                            <button
                              key={entity.id}
                              onClick={() => setSelectedRecipient(entity.name)}
                              className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap border",
                                selectedRecipient === entity.name 
                                  ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                                  : "bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:text-zinc-300"
                              )}
                            >
                              {entity.name.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Asunto:</label>
                        <input
                          type="text"
                          value={mailSubject}
                          onChange={(e) => setMailSubject(e.target.value)}
                          placeholder="ASUNTO DE LA TRANSMISIÓN..."
                          className={cn(
                            "w-full border px-4 py-2 font-mono text-xs outline-none rounded-lg transition-all",
                            isDarkMode ? "bg-zinc-950 border-zinc-800 text-white focus:border-cyan-500" : "bg-white border-zinc-200 text-black focus:border-cyan-600"
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Contenido:</label>
                        <textarea
                          value={mailContent}
                          onChange={(e) => setMailContent(e.target.value)}
                          placeholder={`Escribe tu mensaje para ${selectedRecipient}...`}
                          className={cn(
                            "w-full border px-4 py-3 font-mono text-xs outline-none rounded-lg transition-all min-h-[150px] resize-none",
                            isDarkMode ? "bg-zinc-950 border-zinc-800 text-white focus:border-cyan-500" : "bg-white border-zinc-200 text-black focus:border-cyan-600"
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Generación de Imagen Cuántica:</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={mailImagePrompt}
                            onChange={(e) => setMailImagePrompt(e.target.value)}
                            placeholder="Describe la imagen que deseas generar..."
                            className={cn(
                              "flex-1 border px-4 py-2 font-mono text-[10px] outline-none rounded-lg transition-all",
                              isDarkMode ? "bg-zinc-950 border-zinc-800 text-white focus:border-cyan-500" : "bg-white border-zinc-200 text-black focus:border-cyan-600"
                            )}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateMailImage()}
                          />
                          <button 
                            onClick={handleGenerateMailImage}
                            disabled={isGeneratingMailImage || !mailImagePrompt.trim()}
                            className={cn(
                              "px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold border whitespace-nowrap",
                              isDarkMode ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-cyan-400" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-cyan-600"
                            )}
                          >
                            {isGeneratingMailImage ? <Activity size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            {isGeneratingMailImage ? 'GENERANDO...' : 'GENERAR'}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Adjuntos:</label>
                        <div className="flex gap-4 items-center">
                          <input 
                            type="file" 
                            ref={mailImageInputRef} 
                            onChange={handleImageSelect} 
                            accept="image/*" 
                            className="hidden" 
                          />
                          <button
                            onClick={() => mailImageInputRef.current?.click()}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 border rounded-lg font-mono text-[10px] font-bold transition-all",
                              isDarkMode ? "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-white" : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-black"
                            )}
                          >
                            <ImageIcon size={14} />
                            SUBIR ARCHIVO
                          </button>
                          {(selectedMailImage || lastGeneratedImage) && (
                            <div className="relative group">
                              <img src={selectedMailImage || lastGeneratedImage!} alt="Preview" className="w-12 h-12 rounded border border-cyan-500 object-cover" />
                              <button 
                                onClick={() => { setSelectedMailImage(null); setLastGeneratedImage(null); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          onClick={() => {
                            handleSendMessage();
                            setIsComposing(false);
                          }}
                          disabled={isSendingMail || !mailContent.trim()}
                          className={cn(
                            "px-8 py-2 text-black font-black uppercase tracking-widest text-xs rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                            (isSendingMail || !mailContent.trim()) 
                              ? "bg-zinc-500 opacity-50 cursor-not-allowed" 
                              : "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                          )}
                        >
                          {isSendingMail ? <Activity size={16} className="animate-spin" /> : <><Send size={14} /> ENVIAR_TRANSMISIÓN</>}
                        </button>
                      </div>

                      {lastGeneratedImage && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 relative group"
                        >
                          <img src={lastGeneratedImage} alt="Quantum" className="w-full h-48 object-cover rounded-lg border border-cyan-500/30" referrerPolicy="no-referrer" />
                          <button 
                            onClick={() => setLastGeneratedImage(null)}
                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white"
                          >
                            <ChevronRight className="rotate-90" size={14} />
                          </button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-[8px] font-bold text-cyan-400 uppercase tracking-widest">
                            Visualización Cuántica Generada
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {user && !isComposing && (
                  <div className="space-y-6">
                    {mailTab === 'inbox' ? (
                      mails.filter(m => m.reply).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
                          <Mail size={48} className="text-zinc-700" />
                          <div className="text-sm italic">No hay transmisiones entrantes en este sector.</div>
                        </div>
                      ) : (
                        mails.filter(m => m.reply).map((mail, i) => (
                          <MailCard key={mail.id || i} mail={mail} isInbox={true} isDarkMode={isDarkMode} />
                        ))
                      )
                    ) : (
                      mails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
                          <Zap size={48} className="text-zinc-700" />
                          <div className="text-sm italic">No has iniciado ninguna transmisión temporal.</div>
                        </div>
                      ) : (
                        mails.map((mail, i) => (
                          <MailCard key={mail.id || i} mail={mail} isInbox={false} isDarkMode={isDarkMode} />
                        ))
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className={cn(
                "px-4 py-2 border-t flex justify-between items-center text-[8px] font-mono tracking-[0.2em]",
                isDarkMode ? "bg-black/50 border-zinc-800 text-zinc-500" : "bg-zinc-100 border-zinc-200 text-zinc-400"
              )}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    SYNC_STATUS: STABLE
                  </span>
                  <span>NODE: {currentChapterKey.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>LATENCY: 0.00001ms</span>
                  <span>BRANCH: {chapter.branch}</span>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Quantum Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={cn(
                "w-full max-w-4xl h-[85vh] border rounded-2xl overflow-hidden shadow-2xl flex flex-col sm:flex-row transition-colors",
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              )}
            >
              {/* Sidebar: Entities */}
              <div className={cn(
                "w-full sm:w-72 border-r flex flex-col",
                isDarkMode ? "border-zinc-800 bg-black/20" : "border-zinc-200 bg-zinc-50/50"
              )}>
                <div className="p-6 border-b border-zinc-800/50">
                  <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-1">Entidades_Disponibles</h3>
                  <p className="text-[9px] text-zinc-500 font-mono">Selecciona una consciencia para sincronizar.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {chatEntities.map(entity => (
                    <button
                      key={entity.id}
                      onClick={() => handleEntitySelect(entity)}
                      className={cn(
                        "w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 group",
                        selectedChatEntity?.id === entity.id
                          ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : isDarkMode ? "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50" : "border-zinc-200 hover:border-zinc-300 bg-white"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg bg-black/20 border border-zinc-800 transition-colors group-hover:border-cyan-500/50", entity.color)}>
                        {entity.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold tracking-tight">{entity.name}</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{entity.role}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Narrative Influence */}
                <div className={cn(
                  "mt-8 p-6 border rounded-lg transition-all",
                  isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                )}>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={14} className="text-yellow-500" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Inyección de Variable Narrativa</span>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="text"
                      placeholder="Introduce un concepto para alterar la rama..."
                      className={cn(
                        "flex-1 border p-3 font-mono text-xs outline-none rounded-md transition-all",
                        isDarkMode ? "bg-black/50 border-zinc-800 text-white focus:border-yellow-500" : "bg-white border-zinc-200 text-black focus:border-yellow-600"
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          if (val) {
                            setUserVariable(prev => prev + (val.length / 100));
                            setTransmission({ sender: 'SISTEMA', message: `Variable "${val}" inyectada. Psi alterado.` });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <div className="text-[9px] font-mono text-zinc-500 max-w-[150px] leading-tight">
                      Tu entrada altera la probabilidad de colapso y la intensidad de la rama actual.
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col relative overflow-hidden">
                {!selectedChatEntity ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]">
                    <motion.div 
                      animate={{ 
                        rotate: 360,
                        boxShadow: ["0 0 20px rgba(6,182,212,0.2)", "0 0 40px rgba(6,182,212,0.4)", "0 0 20px rgba(6,182,212,0.2)"]
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-500/30 flex items-center justify-center"
                    >
                      <MessageSquare size={40} className="text-cyan-500" />
                    </motion.div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black tracking-tighter uppercase text-white">Sincronización Interdimensional</h2>
                      <p className="text-sm text-zinc-500 max-w-xs mx-auto font-mono">Selecciona una consciencia en el panel lateral para iniciar el entrelazamiento cuántico.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <AnimatePresence>
                      {isSyncing && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4"
                        >
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
                          />
                          <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest animate-pulse">Sincronizando_Consciencia...</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none z-0 opacity-10"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,transparent_70%)]" />
                    </motion.div>
                    {/* Chat Header */}
                    <div className={cn(
                      "p-4 border-b flex items-center justify-between",
                      isDarkMode ? "border-zinc-800 bg-black/20" : "border-zinc-200 bg-zinc-50/50"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-lg bg-black/20 border border-zinc-800", selectedChatEntity.color)}>
                          {selectedChatEntity.icon}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{selectedChatEntity.name}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          </div>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{selectedChatEntity.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setIsEntangled(!isEntangled)}
                          className={cn(
                            "px-3 py-1 rounded text-[10px] font-bold transition-all border flex items-center gap-2",
                            isEntangled 
                              ? "bg-purple-500 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                              : "border-zinc-700 text-zinc-500 hover:text-zinc-300"
                          )}
                        >
                          <Activity size={10} className={isEntangled ? "animate-spin" : ""} />
                          {isEntangled ? '[ENTRELAZADO]' : '[ENTRELAZAR]'}
                        </button>
                        <button 
                          onClick={() => setChatMessages([])}
                          className="px-3 py-1 rounded text-[10px] font-bold transition-all border border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10"
                        >
                          [NUEVO_CHAT]
                        </button>
                        <button 
                          onClick={() => setIsChatOpen(false)}
                          className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-full transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                      <div className={cn(
                        "p-4 rounded-2xl border text-[10px] font-mono leading-relaxed max-w-md mx-auto text-center italic",
                        isDarkMode ? "bg-zinc-800/20 border-zinc-800 text-zinc-500" : "bg-zinc-100 border-zinc-200 text-zinc-400"
                      )}>
                        Conexión establecida con {selectedChatEntity.name}. Bio: {selectedChatEntity.bio}
                      </div>

                      {chatMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            "flex flex-col max-w-[80%]",
                            msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1 px-2">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{msg.sender}</span>
                          </div>
                          <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-lg relative overflow-hidden",
                            msg.role === 'user'
                              ? "bg-cyan-500 text-black font-medium rounded-tr-none"
                              : isDarkMode ? "bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-tl-none" : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none",
                            isEntangled && "animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.3)]",
                            isEntangled && isEntanglementPulseActive && msg.role === 'user' && i === chatMessages.length - 1 && "scale-105 rotate-1 blur-[1px] brightness-150"
                          )}>
                            {isEntangled && (
                              <motion.div 
                                animate={{ x: [-100, 200] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                              />
                            )}
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                      {isChatTyping && (
                        <div className="flex flex-col items-start max-w-[80%] mr-auto">
                          <div className="flex items-center gap-2 mb-1 px-2">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{selectedChatEntity.name}</span>
                          </div>
                          <div className={cn(
                            "p-4 rounded-2xl rounded-tl-none flex items-center gap-2",
                            isDarkMode ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-zinc-200"
                          )}>
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className={cn(
                      "p-6 border-t",
                      isDarkMode ? "border-zinc-800 bg-black/20" : "border-zinc-200 bg-zinc-50/50"
                    )}>
                      <div className="relative flex items-center gap-3">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                          placeholder={`Habla con ${selectedChatEntity.name}...`}
                          className={cn(
                            "flex-1 pl-6 pr-14 py-4 rounded-full border font-mono text-sm outline-none transition-all",
                            isDarkMode ? "bg-zinc-950 border-zinc-800 text-white focus:border-cyan-500" : "bg-white border-zinc-200 text-black focus:border-cyan-600"
                          )}
                        />
                        <button
                          onClick={handleChatSend}
                          disabled={!chatInput.trim() || isChatTyping}
                          className={cn(
                            "absolute right-2 p-3 rounded-full transition-all active:scale-90",
                            !chatInput.trim() || isChatTyping ? "text-zinc-600 cursor-not-allowed" : "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-400"
                          )}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-4 text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Shield size={8} /> Encriptación_Cuántica_Activa</span>
                        <span className="flex items-center gap-1"><Activity size={8} /> Sincronización: 99.9%</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantum Map Modal */}
      <AnimatePresence>
        {isMapOpen && (
          <QuantumMap 
            history={history} 
            currentKey={currentChapterKey} 
            isDarkMode={isDarkMode} 
            onClose={() => setIsMapOpen(false)} 
            onNodeClick={(key) => {
              setVisitedChapters(prev => ({
                ...prev,
                [key]: (prev[key] || 0) + 1
              }));
              setCurrentChapterKey(key);
              setIsMapOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* User Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={cn(
                "w-full max-w-md border rounded-2xl shadow-2xl overflow-hidden flex flex-col",
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              )}
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                  <Shield className="text-cyan-500" size={20} />
                  <h2 className="text-xl font-bold tracking-tight uppercase">Configuración de Identidad</h2>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Display Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nombre de Observador:</label>
                  <input 
                    type="text"
                    value={customDisplayName}
                    onChange={(e) => setCustomDisplayName(e.target.value)}
                    placeholder={user?.displayName || "Introduce tu nombre..."}
                    className={cn(
                      "w-full px-4 py-3 border rounded-xl font-mono text-sm outline-none transition-all",
                      isDarkMode ? "bg-black border-zinc-800 focus:border-cyan-500" : "bg-zinc-50 border-zinc-200 focus:border-cyan-600"
                    )}
                  />
                  <p className="text-[9px] text-zinc-500 italic">Cómo te verán las entidades de Laniakea.</p>
                </div>

                {/* Character Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estado Ontológico:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['HUMAN', 'VARIABLE', 'DATA'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setCharacterType(type)}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-[10px] font-bold transition-all",
                          characterType === type
                            ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                            : isDarkMode ? "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-black"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-zinc-500 italic">Define cómo interactúas con la función de onda.</p>
                </div>

                {/* Default Recipient */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Receptor Predeterminado (Mail):</label>
                  <div className="flex flex-wrap gap-2">
                    {(['Elon', 'Jesus', 'Einstein', 'Tesla', 'FutureScientist'] as const).map((rec) => (
                      <button
                        key={rec}
                        onClick={() => setDefaultRecipient(rec)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all",
                          defaultRecipient === rec
                            ? "bg-purple-500 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                            : isDarkMode ? "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-black"
                        )}
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-zinc-500 italic">La consciencia con la que tienes mayor afinidad.</p>
                </div>
              </div>

              <div className="p-6 border-t border-zinc-800 bg-black/20 flex gap-3">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl font-bold text-xs transition-all",
                    isDarkMode ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  )}
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-3 bg-cyan-500 text-black font-black text-xs rounded-xl hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95"
                >
                  GUARDAR_CAMBIOS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Galactic Event Overlay */}
      <AnimatePresence>
        {showGalacticEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Enhanced Starfield */}
            <div className="absolute inset-0">
              {[...Array(200)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute rounded-full",
                    i % 10 === 0 ? "w-2 h-2 bg-cyan-400 blur-[2px]" : "w-0.5 h-0.5 bg-white"
                  )}
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    scale: 0
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: (Math.random() - 0.5) * 3000 + window.innerWidth / 2,
                    y: (Math.random() - 0.5) * 3000 + window.innerHeight / 2,
                  }}
                  transition={{ 
                    duration: Math.random() * 5 + 3, 
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Nebula Clouds */}
            <div className="absolute inset-0 opacity-30">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)]"
              />
              <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 270, 180, 90, 0]
                }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)]"
              />
            </div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="relative z-10 text-center px-6"
            >
              <motion.div
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(6,182,212,0.5)",
                    "0 0 40px rgba(168,85,247,0.5)",
                    "0 0 20px rgba(6,182,212,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h2 className="text-7xl md:text-9xl font-bold text-white mb-8 tracking-tighter">
                  ASCENSIÓN
                </h2>
              </motion.div>
              
              <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-8" />
              
              <p className="text-xl md:text-3xl text-cyan-200 font-mono tracking-[0.8em] mb-16 uppercase">
                Límite de la Función (i) Alcanzado
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGalacticEvent(false)}
                className="px-16 py-5 bg-white text-black font-black text-xl tracking-[0.3em] hover:bg-cyan-400 transition-all rounded-none border-2 border-white hover:border-cyan-400"
              >
                TRASCENDER
              </motion.button>
            </motion.div>

            {/* Quantum Rings */}
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ 
                  duration: 10 + i * 5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute border border-white/10 rounded-full"
                style={{ 
                  width: `${100 + i * 20}vw`, 
                  height: `${100 + i * 20}vw` 
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Status */}
      <footer className={cn(
        "fixed bottom-0 left-0 w-full backdrop-blur-md border-t p-4 z-50 transition-colors",
        isDarkMode ? "bg-black/80 border-zinc-800" : "bg-white/80 border-zinc-200"
      )}>
        <div className={cn(
          "max-w-7xl mx-auto flex items-center justify-between font-mono text-[10px] tracking-widest transition-colors",
          isDarkMode ? "text-zinc-600" : "text-zinc-400"
        )}>
          <div className="flex gap-4">
            <span>COORD: {chapter.id} + {chapter.branch === 'IMAGINARY' ? 'i' : '0'}</span>
            <span className="flex items-center">
              CAPITULO: {chapter.fibonacciIndex ?? 'N/A'}
              <BlinkingCursor className="h-2 w-0.5 ml-1" />
            </span>
          </div>
          <div className="flex gap-4">
            <span>ENTROPY: {(Math.random() * 0.1).toFixed(4)}</span>
            <span>NORMALIZATION: {(psiValue / 55).toFixed(4)}%</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
