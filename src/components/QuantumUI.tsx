import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Database, Cpu, AlertTriangle, FileText, Mail, BookOpen, User, Activity, Zap, History, ChevronRight, HelpCircle, Sun, Moon } from 'lucide-react';
import { BOOK_DATA, Chapter, Branch, Artifact, Choice } from '../data/book';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth, db, signInWithGoogle, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, setDoc, getDoc } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

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
      animate={intense ? {
        x: [0, -0.5, 0.5, -0.5, 0.5, 0],
        y: [0, 0.5, -0.5, 0.5, -0.5, 0],
      } : {}}
      transition={intense ? {
        duration: 0.1,
        repeat: Infinity,
        repeatType: "mirror"
      } : {}}
    >
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-red-500 opacity-70"
        animate={{ 
          x: intense ? [-2, 2, -2] : [-1, 1, -1], 
          y: intense ? [2, -2, 2] : [1, -1, 1] 
        }}
        transition={{ repeat: Infinity, duration: 0.2 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-blue-500 opacity-70"
        animate={{ 
          x: intense ? [2, -2, 2] : [1, -1, 1], 
          y: intense ? [-2, 2, -2] : [-1, 1, -1] 
        }}
        transition={{ repeat: Infinity, duration: 0.2, delay: 0.1 }}
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

const transformText = (text: string, isBlackHoleActive: boolean) => {
  if (!isBlackHoleActive) return text;
  return text
    .replace(/Silas/g, 'Salis')
    .replace(/Tesla/g, 'Lesta')
    .replace(/Elena/g, 'Anela')
    .replace(/Vance/g, 'Nevac')
    .replace(/Laniakea/g, 'Aekainal')
    .replace(/Fundación/g, 'Noicadnuf')
    .replace(/Aris/g, 'Sira')
    .replace(/Thorne/g, 'Enroht');
};

const ArtifactCard = ({ artifact, isDarkMode, isBlackHoleActive }: { artifact: Artifact; isDarkMode: boolean; isBlackHoleActive: boolean }) => {
  const Icon = artifact.type === 'EMAIL' ? Mail : artifact.type === 'DIARY' ? BookOpen : FileText;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border p-6 rounded-lg my-6 font-mono text-sm relative overflow-hidden group transition-all hover:shadow-lg",
        isDarkMode 
          ? "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700" 
          : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm",
        isBlackHoleActive && "invert hue-rotate-180"
      )}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 group-hover:bg-cyan-400 transition-colors" />
      <div className="flex items-center gap-3 mb-4 text-cyan-500">
        <Icon size={18} className="group-hover:scale-110 transition-transform" />
        <span className="uppercase tracking-widest font-bold">{artifact.type}</span>
        <BlinkingCursor className="h-3 w-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className={cn(
        "space-y-2 mb-4 transition-colors",
        isDarkMode ? "text-zinc-400" : "text-zinc-500"
      )}>
        {artifact.title && <div className={cn("font-bold", isDarkMode ? "text-zinc-200" : "text-zinc-800")}>{transformText(artifact.title, isBlackHoleActive)}</div>}
        {artifact.date && <div>DATE: {artifact.date}</div>}
        {artifact.author && <div>FROM: {transformText(artifact.author, isBlackHoleActive)}</div>}
      </div>
      <div className={cn(
        "leading-relaxed whitespace-pre-wrap italic transition-colors",
        isDarkMode ? "text-zinc-300" : "text-zinc-700"
      )}>
        "{transformText(artifact.content, isBlackHoleActive)}"
      </div>
    </motion.div>
  );
};

const BlackHoleOverlay = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
  >
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 360],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="relative w-64 h-64"
    >
      <div className="absolute inset-0 rounded-full bg-black shadow-[0_0_100px_rgba(255,255,255,0.2)] border border-white/10" />
      <motion.div 
        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full border-2 border-white/20"
      />
    </motion.div>
    <div className="absolute font-mono text-white text-2xl tracking-[1.5em] animate-pulse text-center">
      COLAPSO_TOTAL_DEL_HORIZONTE
      <div className="text-xs tracking-widest mt-4 opacity-50">RECONFIGURANDO_IDENTIDADES_ONTOLÓGICAS</div>
    </div>
  </motion.div>
);

const QuantumMap = ({ history, currentKey, isDarkMode, onClose }: { history: HistoryItem[], currentKey: string, isDarkMode: boolean, onClose: () => void }) => {
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
                {nodeChapter?.title}
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
  const [isWormholeActive, setIsWormholeActive] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [psiValue, setPsiValue] = useState(1.000);
  const [characterType, setCharacterType] = useState<'HUMAN' | 'VARIABLE' | 'DATA'>('HUMAN');
  const [enigmaAnswer, setEnigmaAnswer] = useState('');
  const [isEnigmaSolved, setIsEnigmaSolved] = useState(false);
  const [solvedEnigmasCount, setSolvedEnigmasCount] = useState(0);
  const [showGalacticEvent, setShowGalacticEvent] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [currentHint, setCurrentHint] = useState<{ sender: string; message: string } | null>(null);
  const [transmission, setTransmission] = useState<{ sender: string; message: string } | null>(null);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [mailContent, setMailContent] = useState('');
  const [sentMails, setSentMails] = useState<{ to: string; content: string; reply?: string }[]>([]);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isBlackHoleActive, setIsBlackHoleActive] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<'Elon' | 'Jesus' | 'Einstein' | 'Tesla' | 'FutureScientist'>('Elon');
  const [mails, setMails] = useState<any[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);

  // Sync Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', u.uid);
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
      setMails(m);
    });
    return () => unsubscribe();
  }, [user]);

  // Dynamic Content Logic
  const getDynamicChapter = (baseChapter: Chapter): Chapter => {
    let modifiedContent = baseChapter.content;
    let extraChoices: Choice[] = [];

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

  const chapter = getDynamicChapter(BOOK_DATA[currentChapterKey] || BOOK_DATA['0-REAL']);

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
    return Math.sqrt(fn * fn + fn1 * fn1);
  };

  const handleChoice = (nextId: number, nextBranch?: Branch, triggerWormhole?: boolean) => {
    const branch = nextBranch || chapter.branch;
    const key = `${nextId}-${branch}`;
    
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
    setMailContent(''); // Clear immediately to prevent double send
    setIsSendingMail(true);
    
    const subject = `Consulta del Observador - Nodo ${currentChapterKey}`;
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
        recipientBranch: recipient === 'Elon' || recipient === 'FutureScientist' ? 'REAL' : 'IMAGINARY'
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
    <div className={cn(
      "min-h-screen transition-colors duration-500 font-sans selection:bg-cyan-500/30 selection:text-cyan-200",
      isDarkMode ? "bg-black text-zinc-300" : "bg-zinc-50 text-zinc-900"
    )}>
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
              <span>CORE_STABILITY: 98.4%</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
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
              onClick={() => setIsNavigatorOpen(true)}
              className={cn(
                "p-1.5 rounded-md transition-all hover:scale-110 active:scale-95",
                isDarkMode ? "text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-cyan-600 hover:bg-zinc-100"
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
              onClick={() => setIsMailOpen(true)}
              className={cn(
                "relative flex items-center gap-2 transition-all hover:scale-105 active:scale-95",
                isDarkMode ? "text-zinc-500 hover:text-cyan-400" : "text-zinc-400 hover:text-cyan-600"
              )}
            >
              <Mail size={14} />
              <span className="hidden sm:inline">QUANTUM_MAIL</span>
              {sentMails.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
            <div className={cn("hidden lg:flex items-center gap-2", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
              <BookOpen size={14} />
              <span>ENIGMAS: {solvedEnigmasCount}/55</span>
            </div>
            <div className={cn("flex items-center gap-2", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
              <User size={14} />
              <span>OBSERVER: {psiValue.toFixed(3)}</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-500">
              <Terminal size={14} />
              <span>STATE: {characterType}</span>
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                <img src={user.photoURL || ''} alt="User" className="w-5 h-5 rounded-full border border-cyan-500/50" referrerPolicy="no-referrer" />
                <span className="text-[10px] uppercase tracking-widest hidden md:inline">{user.displayName}</span>
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
                  <GlitchText text="IMAGINARY_STATE" intense className="text-purple-500" />
                ) : (
                  'REAL_STATE'
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-24 pb-32 px-6 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapterKey}
            initial={{ opacity: 0, rotateY: 90, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ 
              opacity: 1, 
              rotateY: 0, 
              scale: 1, 
              filter: 'blur(0px)',
              x: chapter.branch === 'IMAGINARY' ? [0, -1, 1, -1, 1, 0] : 0,
              y: chapter.branch === 'IMAGINARY' ? [0, 1, -1, 1, -1, 0] : 0
            }}
            exit={{ opacity: 0, rotateY: -90, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ 
              duration: 0.8, 
              ease: "circOut",
              x: { duration: 0.2, repeat: Infinity, repeatType: "mirror" },
              y: { duration: 0.2, repeat: Infinity, repeatType: "mirror" }
            }}
          >
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
                {chapter.title}
                <BlinkingCursor className="h-3 w-1 ml-2" />
              </div>
              <h1 className={cn(
                "text-4xl md:text-5xl font-bold tracking-tight leading-tight transition-colors",
                isDarkMode ? "text-white" : "text-zinc-900"
              )}>
                <GlitchText text={transformText(chapter.subtitle, isBlackHoleActive)} intense={chapter.branch === 'IMAGINARY'} />
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
                  {transformText(chapter.content, isBlackHoleActive)}
                </ReactMarkdown>
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
      </main>

      {/* Chapter Navigator Modal */}
      <AnimatePresence>
        {isNavigatorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={cn(
                "w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border rounded-xl shadow-2xl",
                isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              )}
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="text-cyan-500" size={20} />
                  <h2 className="text-xl font-bold tracking-tight">INDEX_DE_REALIDADES</h2>
                </div>
                <button 
                  onClick={() => setIsNavigatorOpen(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <ChevronRight className="rotate-90" />
                </button>
              </div>

              <div className="p-4 border-b border-zinc-800">
                <div className="relative">
                  <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por ID o título..."
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-md font-mono text-sm outline-none transition-all",
                      isDarkMode ? "bg-black border-zinc-800 focus:border-cyan-500" : "bg-zinc-50 border-zinc-200 focus:border-cyan-600"
                    )}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {Object.entries(BOOK_DATA)
                  .filter(([key, ch]) => 
                    key.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ch.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(([key, ch]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentChapterKey(key);
                        setIsNavigatorOpen(false);
                        setHistory(prev => [...prev, { key: currentChapterKey }]);
                      }}
                      className={cn(
                        "w-full p-4 rounded-lg border text-left transition-all group relative overflow-hidden",
                        currentChapterKey === key 
                          ? "border-cyan-500 bg-cyan-500/10" 
                          : isDarkMode 
                            ? "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50" 
                            : "border-zinc-200 hover:border-zinc-300 bg-zinc-50"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono text-cyan-500 tracking-widest uppercase">ID: {key}</span>
                        <span className={cn(
                          "text-[10px] font-mono px-2 py-0.5 rounded",
                          ch.branch === 'REAL' ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-400"
                        )}>
                          {ch.branch}
                        </span>
                      </div>
                      <div className="font-bold text-sm mb-1">{ch.title}</div>
                      <div className="text-xs text-zinc-500 italic">{ch.subtitle}</div>
                      {currentChapterKey === key && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Activity size={16} className="text-cyan-500 animate-pulse" />
                        </motion.div>
                      )}
                    </button>
                  ))}
              </div>
              
              <div className="p-4 border-t border-zinc-800 bg-black/20 text-[10px] font-mono text-zinc-500 text-center uppercase tracking-[0.2em]">
                Total de nodos detectados: {Object.keys(BOOK_DATA).length} | Estado del Observador: {characterType}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <BlackHoleOverlay isDarkMode={isDarkMode} />
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

      {/* Temporal Transmission Notification */}
      <AnimatePresence>
        {transmission && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={cn(
              "fixed bottom-24 right-6 z-[150] max-w-sm border p-4 rounded-lg shadow-2xl backdrop-blur-xl transition-colors",
              isDarkMode ? "bg-zinc-900 border-cyan-500/30" : "bg-white border-cyan-200"
            )}
          >
            <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] tracking-widest mb-2 font-bold">
              <Terminal size={12} className="animate-pulse" />
              <span>TRANSMISIÓN_TEMPORAL_ENTRANTE</span>
              <BlinkingCursor className="h-2 w-0.5" />
            </div>
            <div className={cn(
              "font-mono text-[9px] mb-1 uppercase tracking-tighter",
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            )}>
              DE: {transmission.sender}
            </div>
            <div className={cn(
              "text-xs italic leading-relaxed",
              isDarkMode ? "text-zinc-200" : "text-zinc-800"
            )}>
              "{transmission.message}"
            </div>
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-cyan-500"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 8, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
                <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs tracking-widest">
                  <Mail size={14} className="animate-bounce" />
                  <span>LANIAKEA_MESSENGER_v1.0</span>
                  <BlinkingCursor className="h-3 w-1" />
                </div>
                <button 
                  onClick={() => setIsMailOpen(false)}
                  className={cn(
                    "text-xs font-mono transition-colors hover:underline",
                    isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-black"
                  )}
                >
                  [CERRAR]
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-sm">
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

                {user && mails.length === 0 && (
                  <div className={cn(
                    "text-center italic py-12",
                    isDarkMode ? "text-zinc-600" : "text-zinc-400"
                  )}>
                    No hay transmisiones previas en este hilo temporal.
                  </div>
                )}

                {user && mails.map((mail, i) => (
                  <motion.div 
                    key={mail.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-end">
                      <div className={cn(
                        "border p-4 rounded-lg rounded-tr-none max-w-[80%] shadow-sm",
                        isDarkMode ? "bg-cyan-500/10 border-cyan-500/30" : "bg-cyan-50 border-cyan-200"
                      )}>
                        <div className="text-[10px] text-cyan-500 mb-1 font-bold uppercase tracking-widest flex justify-between">
                          <span>PARA: {mail.recipient}</span>
                          <span className={cn(
                            "text-[8px]",
                            mail.status === 'DELIVERED' ? "text-green-500" : 
                            mail.status === 'SENT' ? "text-yellow-500 animate-pulse" : "text-red-500"
                          )}>
                            [{mail.status || 'SENT'}]
                            {mail.senderBranch !== mail.recipientBranch && " [FUERA_DE_FASE]"}
                          </span>
                        </div>
                        <div className={isDarkMode ? "text-zinc-200" : "text-zinc-800"}>
                          {mail.body}
                          {mail.senderBranch !== mail.recipientBranch && (
                            <div className="text-[8px] text-yellow-500 mt-1 italic font-bold">
                              [ADVERTENCIA]: INTERFERENCIA_DE_PLANO_CUÁNTICO
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {mail.reply && (
                      <div className="flex justify-start">
                        <div className={cn(
                          "border p-4 rounded-lg rounded-tl-none max-w-[80%] shadow-sm",
                          isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
                        )}>
                          <div className="text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-widest">DE: {mail.recipient}</div>
                          <div className={cn("italic", isDarkMode ? "text-zinc-300" : "text-zinc-600")}>
                            <ReactMarkdown 
                              remarkPlugins={[remarkMath]} 
                              rehypePlugins={[rehypeKatex]}
                            >
                              {mail.reply}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}

                    {mail.status === 'COLLAPSED' && (
                      <div className="text-[10px] text-red-500 font-mono animate-pulse text-center uppercase">
                        [ERROR]: COLAPSO_DE_FUNCIÓN_DE_ONDA - MENSAJE_PERDIDO
                      </div>
                    )}

                    {mail.status === 'OUT_OF_PHASE' && (
                      <div className="text-[10px] text-yellow-500 font-mono animate-pulse text-center uppercase">
                        [ERROR]: INTERFERENCIA_DE_FASE - ENTREGA_FALLIDA
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {user && (
                <div className={cn(
                  "p-6 border-t",
                  isDarkMode ? "border-zinc-800 bg-black/30" : "border-zinc-200 bg-zinc-50/50"
                )}>
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {(['Elon', 'Jesus', 'Einstein', 'Tesla', 'FutureScientist'] as const).map(rec => (
                      <button
                        key={rec}
                        onClick={() => setSelectedRecipient(rec)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap",
                          selectedRecipient === rec 
                            ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                            : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        {rec.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <textarea
                      value={mailContent}
                      onChange={(e) => setMailContent(e.target.value)}
                      placeholder={`Escribe a ${selectedRecipient}...`}
                      className={cn(
                        "flex-1 border p-4 font-mono text-sm outline-none resize-none h-24 rounded-lg transition-all",
                        isDarkMode ? "bg-zinc-950 border-zinc-800 text-white focus:border-cyan-500" : "bg-white border-zinc-200 text-black focus:border-cyan-600"
                      )}
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleSendMessage}
                        disabled={isSendingMail || !mailContent.trim()}
                        className={cn(
                          "px-8 h-full text-black font-black uppercase tracking-widest text-xs rounded-lg transition-all active:scale-95 flex items-center justify-center",
                          (isSendingMail || !mailContent.trim()) 
                            ? "bg-zinc-500 opacity-50 cursor-not-allowed" 
                            : "bg-cyan-500 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                        )}
                      >
                        {isSendingMail ? <Activity size={16} className="animate-spin" /> : 'ENVIAR'}
                      </button>
                      <button 
                        onClick={() => generateQuantumImage(mailContent)}
                        disabled={isGeneratingImage || !mailContent.trim()}
                        className={cn(
                          "p-2 rounded-md transition-all",
                          isDarkMode ? "bg-zinc-800 text-zinc-400 hover:text-cyan-400" : "bg-zinc-100 text-zinc-600 hover:text-cyan-600"
                        )}
                        title="Generar Imagen Cuántica"
                      >
                        <Zap size={16} className={isGeneratingImage ? "animate-spin" : ""} />
                      </button>
                    </div>
                  </div>
                  {lastGeneratedImage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 relative group"
                    >
                      <img src={lastGeneratedImage} alt="Quantum" className="w-full h-48 object-cover rounded-lg border border-zinc-800" referrerPolicy="no-referrer" />
                      <button 
                        onClick={() => setLastGeneratedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="rotate-90" size={14} />
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
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
          />
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
