import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import zoeZooIllustratedMap from './assets/images/zoe_zoo_map_1781269306168.jpg';
import animalSilhouetteImg from './assets/images/animal_silhouette_1781269745490.jpg';
import elephantSprayWaterImg from './assets/images/elephant_spray_water_1781269727158.jpg';
import kingPenguinImg from './assets/images/king_penguin_1781268727298.jpg';
import { 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Sparkles, 
  X, 
  ArrowUp, 
  Activity, 
  Compass, 
  Eye, 
  LayoutGrid, 
  MapPin, 
  RotateCw, 
  Calendar, 
  ShieldAlert, 
  Play, 
  Heart, 
  Flame, 
  Info,
  Scale,
  Wind
} from 'lucide-react';
import { CALENDAR_ANIMALS, ENCYCLOPEDIA_SPECIMENS } from './data';
import { AnimalDay, Specimen } from './types';

interface ZooActivity {
  title: string;
  desc: string;
  defaultTier: 'standard' | 'vip' | 'night';
  price: number;
  imageUrl: string;
}

const ZOO_ACTIVITIES: { [key: number]: ZooActivity[] } = {
  18: [
    { title: "Predator Feeding", desc: "Witness massive apex predators up close under secure safety barriers.", defaultTier: "vip", price: 125, imageUrl: "https://images.unsplash.com/photo-1608976478549-b0037a34e062?auto=format&fit=crop&w=800&q=80" }
  ],
  20: [
    { title: "Bioluminescent Walk", desc: "Witness glowing deep-ocean reefs and dark caves guided by marine biologists.", defaultTier: "night", price: 80, imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" },
    { title: "Canopy Zip Safari", desc: "Glide along sky-high tree cables with a clear bird's-eye view of active primates.", defaultTier: "standard", price: 45, imageUrl: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80" }
  ],
  21: [
    { title: "Savannah Dusk Trek", desc: "Custom off-road evening vehicles tracking giant grazing herds during sunset.", defaultTier: "standard", price: 45, imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80" }
  ],
  23: [
    { title: "Venom Laboratory", desc: "Interactive safety demonstration featuring some of the planet's most toxic reptiles.", defaultTier: "standard", price: 45, imageUrl: "https://images.unsplash.com/photo-1531386151447-fd7627375997?auto=format&fit=crop&w=800&q=80" }
  ],
  24: [
    { title: "Nocturnal Forest Walk", desc: "Guided night scope hike looking for active glowing owls and flying squirrels.", defaultTier: "night", price: 80, imageUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80" },
    { title: "Siberian Tiger Tour", desc: "Go behind the scenes with our premium veterinarians caring for Siberian tigers.", defaultTier: "vip", price: 125, imageUrl: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80" }
  ],
  26: [
    { title: "Giraffe Acacia Picnic", desc: "Join specialists to prepare and hand-feed tender acacia shoots to our beautiful giraffe herd on custom elevated wooden decks.", defaultTier: "vip", price: 125, imageUrl: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=800&q=80" }
  ],
  28: [
    { title: "Marine Vet Workshop", desc: "Exclusive rescue training simulation and hands-on medical care for sea mammals.", defaultTier: "vip", price: 125, imageUrl: "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=800&q=80" },
    { title: "Aquarium Sleepover", desc: "Luxury sleepover inside a custom glass panoramic bedroom under schools of hammerheads.", defaultTier: "night", price: 80, imageUrl: "https://images.unsplash.com/photo-1560275669-46c5a88d6a4c?auto=format&fit=crop&w=800&q=80" }
  ],
  31: [
    { title: "Sunset Sound Ceremony", desc: "Acoustic wilderness journey to hear the majestic dusk calls of lions and wolves.", defaultTier: "standard", price: 45, imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80" }
  ]
};

export default function App() {
  // Sound control state
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Preloader progress state
  const [progress, setProgress] = useState(0);
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [footprints, setFootprints] = useState<{ id: number; x: number; y: number; rotate: number; type: string }[]>([]);

  // Additional Premium Interactive states
  const [screenFootprints, setScreenFootprints] = useState<{ id: number; x: number; y: number; rotate: number; type: string }[]>([]);
  const [showModuleAtlas, setShowModuleAtlas] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeEventAudioIndex, setActiveEventAudioIndex] = useState<number | null>(null);

  // Navigation state
  const [activeSection, setActiveSection] = useState<'home' | 'hub' | 'calendar' | 'map' | 'encyclopedia'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState('');
  const [transitionTo, setTransitionTo] = useState('');

  // Community Hub active module states
  const [selectedAdoptAnimal, setSelectedAdoptAnimal] = useState(0); // Index of adopted animal
  const [adoptParentName, setAdoptParentName] = useState('');
  const [adoptCompleted, setAdoptCompleted] = useState(false);
  const [adoptConfetti, setAdoptConfetti] = useState(false);

  const [volunteerTrack, setVolunteerTrack] = useState<'wildlife' | 'educator' | 'nocturnal'>('wildlife');
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [volunteerDate, setVolunteerDate] = useState('');
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [volunteerScanning, setVolunteerScanning] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  const [expandedNewsIndex, setExpandedNewsIndex] = useState<number | null>(null);

  // Letter lens image indexing
  const lensImages = [
    "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=1200", // Z (Monkey)
    kingPenguinImg,                                                               // O (Penguin)
    elephantSprayWaterImg,                                                        // E (Elephant)
    "https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1200", // Z (Polar Bear)
    "https://images.unsplash.com/photo-1547721064-da6cfb341d50?q=80&w=1200",     // O (Giraffe) - restored original
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200",     // O (Lion) - restored original
  ];
  
  // Lens mouse track states
  const [lensPositions, setLensPositions] = useState<{ [key: number]: { x: number; y: number; hover: boolean } }>({
    0: { x: 50, y: 50, hover: false },
    1: { x: 50, y: 50, hover: false },
    2: { x: 50, y: 50, hover: false },
    3: { x: 50, y: 50, hover: false },
    4: { x: 50, y: 50, hover: false },
    5: { x: 50, y: 50, hover: false },
  });

  // Calendar interactive states
  const [selectedDay, setSelectedDay] = useState<AnimalDay | null>(null);
  const [hoveredDayBubble, setHoveredDayBubble] = useState<{ day: AnimalDay; x: number; y: number } | null>(null);

  // Ticket Booking states
  const [bookingDay, setBookingDay] = useState<number | null>(null);
  const [ticketTier, setTicketTier] = useState<'standard' | 'vip' | 'night'>('standard');
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorEmail, setVisitorEmail] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Playable interactive widgets parameters
  const [giraffeHeight, setGiraffeHeight] = useState(5.5);
  const [bearFrequency, setBearFrequency] = useState(60);
  const [lionDecibel, setLionDecibel] = useState(0);
  const [lionStatus, setLionStatus] = useState("Resting");
  const [sealFishCount, setSealFishCount] = useState(0);
  const [monkeyAngle, setMonkeyAngle] = useState(0);

  // Map state variables
  const [selectedMapZone, setSelectedMapZone] = useState<string>('polar'); // polar, savannah, oceanic, primate, nocturnal
  const [mapLayer, setMapLayer] = useState<'blueprint' | 'thermal' | 'telemetry' | 'illustrated'>('illustrated');
  const [mistActive, setMistActive] = useState<{ [key: string]: boolean }>({
    polar: false,
    savannah: false,
    oceanic: false,
    primate: false,
    nocturnal: false
  });
  const [zoneTemps, setZoneTemps] = useState<{ [key: string]: number }>({
    polar: -4,
    savannah: 29,
    oceanic: 14,
    primate: 23,
    nocturnal: 12
  });
  const [zoneHumidity, setZoneHumidity] = useState<{ [key: string]: number }>({
    polar: 25,
    savannah: 40,
    oceanic: 95,
    primate: 85,
    nocturnal: 55
  });
  const [feedingStatus, setFeedingStatus] = useState<{ [key: string]: { active: boolean; timer: number; animal?: string } }>({
    polar: { active: false, timer: 0 },
    savannah: { active: false, timer: 0 },
    oceanic: { active: false, timer: 0 },
    primate: { active: false, timer: 0 },
    nocturnal: { active: false, timer: 0 }
  });
  const [activeAudioFeed, setActiveAudioFeed] = useState<string | null>(null);

  // Encyclopedia states
  const [activeCategory, setActiveCategory] = useState<'all' | 'mammals' | 'marine' | 'aviary'>('all');
  const [galleryLayout, setGalleryLayout] = useState<'scatter' | 'carousel' | 'ring' | 'stack'>('scatter');
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);
  const [ambientIndex, setAmbientIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [targetRotationY, setTargetRotationY] = useState(0);
  const startDragX = useRef(0);

  // Home description typewriter states
  const typewriterText = "Witness the pulse of the earth.\nA sanctuary defined by rhythm, scale, and untamed elegance.";
  const [typedHomeDesc, setTypedHomeDesc] = useState("");

  useEffect(() => {
    if (progress < 100) return;
    let index = 0;
    setTypedHomeDesc("");
    const timer = setInterval(() => {
      setTypedHomeDesc(typewriterText.slice(0, index + 1));
      index++;
      if (index >= typewriterText.length) {
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [progress]);

  // Feeding status countdown tick
  useEffect(() => {
    const timerId = setInterval(() => {
      setFeedingStatus(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(key => {
          if (next[key].active && next[key].timer > 0) {
            const nextTimer = next[key].timer - 1;
            next[key] = {
              ...next[key],
              timer: nextTimer,
              active: nextTimer > 0
            };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Decibel decay loop
  useEffect(() => {
    if (lionDecibel > 0) {
      const interval = setInterval(() => {
        setLionDecibel(prev => {
          const next = Math.max(0, prev - 12);
          if (next === 0) setLionStatus("Resting");
          return next;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [lionDecibel]);

  // Telemetry updates
  const telemetryLogs = [
    'INITIALIZING HIGH-FIDELITY OPTICS...',
    'CALIBRATING SATELLITE TELEMETRY WIRE GRIDS...',
    'ESTABLISHING DURABLE BIOSPHERE DATABASES...',
    'MAPPING GEO-COORDINATE WILD SITES...',
    'STABILIZING AUDIO SYNTH ENGINE CHANNELS...',
    'SECURE CONNECTION ESTABLISHED. WELCOME.'
  ];

  // Feet trail rendering inside preloader
  const foottypes = ['penguin', 'giraffe', 'bear', 'lion'];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 8 + 3;
        const next = Math.min(prev + increment, 100);
        
        // Spawn footprints at checkpoints
        if (Math.floor(next / 15) > Math.floor(prev / 15) && next < 95) {
          setFootprints(old => [
            ...old,
            {
              id: Date.now() + Math.random(),
              x: 10 + Math.random() * 80,
              y: 10 + Math.random() * 83,
              rotate: Math.random() * 360,
              type: foottypes[Math.floor(Math.random() * foottypes.length)]
            }
          ]);
        }
        
        if (next >= 100) {
          clearInterval(progressTimer);
        }
        return next;
      });
    }, 150);

    return () => clearInterval(progressTimer);
  }, []);

  // Telemetry loop
  useEffect(() => {
    if (progress < 100) {
      const idx = Math.min(Math.floor((progress / 100) * telemetryLogs.length), telemetryLogs.length - 1);
      setTelemetryIndex(idx);
    }
  }, [progress]);

  // Audio synthesis driver
  const playOscillator = (freq: number, type: OscillatorType = 'sine', duration = 0.35, gainValue = 0.07) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1000, ctx.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + duration);

      osc.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  // Complex modal opening chords
  const playChords = (baseFreq: number) => {
    if (!soundEnabled) return;
    playOscillator(baseFreq, 'sine', 0.5, 0.08);
    setTimeout(() => playOscillator(baseFreq * 1.25, 'triangle', 0.45, 0.05), 80);
    setTimeout(() => playOscillator(baseFreq * 1.5, 'sine', 0.4, 0.06), 160);
  };

  // Interactive letter lens coordinates
  const handleLetterLensMouseMove = (idx: number, e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPositions(prev => ({
      ...prev,
      [idx]: { x, y, hover: true }
    }));
  };

  const handleLetterLensLeave = (idx: number) => {
    setLensPositions(prev => ({
      ...prev,
      [idx]: { x: 50, y: 50, hover: false }
    }));
  };

  // Click-to-spawn futuristic animal trace marks
  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('input') || 
      target.closest('select') || 
      target.closest('a') || 
      target.closest('canvas') ||
      target.closest('.letter-lens') ||
      target.closest('.interactive-map-zone') ||
      target.closest('.advent-day-box')
    ) {
      return; 
    }

    // Convert mouse coordinates to viewport percentages
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    const animalTypes = ['penguin', 'giraffe', 'bear', 'lion'];
    const selectedType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
    const footprintId = Date.now() + Math.random();

    const newFp = {
      id: footprintId,
      x,
      y,
      rotate: Math.random() * 360,
      type: selectedType
    };

    setScreenFootprints(prev => [...prev.slice(-12), newFp]);

    if (soundEnabled) {
      playOscillator(750 + Math.random() * 400, 'sine', 0.03, 0.03);
    }

    setTimeout(() => {
      setScreenFootprints(prev => prev.filter(fp => fp.id !== footprintId));
    }, 4000);
  };

  // Scroll to layout sections with sound feedback
  const jumpTo = (section: 'home' | 'hub' | 'calendar' | 'map' | 'encyclopedia') => {
    if (activeSection === section) return;
    setTransitionFrom(activeSection);
    setTransitionTo(section);
    setIsTransitioning(true);

    // Play high tech futuristic sweep sounds
    playOscillator(150, 'sawtooth', 0.15, 0.1);
    setTimeout(() => {
      playOscillator(section === 'home' ? 220 : 
                     section === 'hub' ? 277.18 :
                     section === 'calendar' ? 330 : 
                     section === 'map' ? 385 : 440, 'sine', 0.25, 0.12);
    }, 280);

    // Scroll after the sci-fi transition curtain covers the screen
    setTimeout(() => {
      setActiveSection(section);
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
      }
    }, 450);

    // Turn off transition after warp completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1100);
  };

  // Multi-Mode Rotation Loop
  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      // Exponential lerp dampening
      setRotationY(prev => prev + (targetRotationY - prev) * 0.08);
      
      // Auto rotate slightly when not dragging
      if (galleryLayout === 'ring' && !isDragging) {
        setTargetRotationY(prev => prev + 0.002);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      active = false;
    };
  }, [galleryLayout, targetRotationY, isDragging]);

  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    if (galleryLayout !== 'ring') return;
    setIsDragging(true);
    startDragX.current = e.clientX;
  };

  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || galleryLayout !== 'ring') return;
    const deltaX = e.clientX - startDragX.current;
    startDragX.current = e.clientX;
    setTargetRotationY(prev => prev + deltaX * 0.008);
  };

  const handleGalleryMouseUp = () => {
    setIsDragging(false);
  };

  // Specimen categories categorization
  const filteredSpecimens = ENCYCLOPEDIA_SPECIMENS.filter(spec => {
    if (activeCategory === 'all') return true;
    return spec.category === activeCategory;
  });

  // Dynamic ambient backgrounds
  const ambientBackgrounds = [
    { from: '#1c305d', to: '#ee7752', opacity: 0.16 },  // Classic Slate Dusk
    { from: '#4a2414', to: '#1c305d', opacity: 0.20 },  // Savannah Fireglow
    { from: '#06b6d4', to: '#0e182e', opacity: 0.15 },  // Polar Frost Blue
    { from: '#723b11', to: '#31104d', opacity: 0.18 },  // Tropical Autumn
  ];

  return (
    <div 
      className="relative min-h-screen bg-themeDarkBase text-[#fdfaf5] overflow-x-hidden select-none font-sans"
      onMouseMove={handleGalleryMouseMove}
      onMouseUp={handleGalleryMouseUp}
      onMouseLeave={handleGalleryMouseUp}
      onClick={handleGlobalClick}
    >
      {/* 1. Cinematic Satellite Preloader */}
      <AnimatePresence>
        {progress < 100 && (
          <motion.div 
            id="preloader"
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-themeDarkBase select-none overflow-hidden"
            exit={{ clipPath: 'circle(0% at 50% 50%)', transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
          >
            {/* Holographic Wire Lines & Grid Overlay */}
            <div className="absolute inset-0 grid-blueprint opacity-60"></div>
            
            {/* Cosmic Ambient Blur Backing */}
            <div className="absolute w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[160px] animate-pulse pointer-events-none"></div>

            {/* Animal footprints rendering coordinate layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {footprints.map(fp => (
                <div 
                  key={fp.id}
                  className="absolute text-themePeach/45 drop-shadow-[0_0_12px_rgba(248,162,130,0.3)] transition-all duration-1000"
                  style={{ left: `${fp.x}%`, top: `${fp.y}%`, transform: `translate(-50%, -50%) rotate(${fp.rotate}deg)` }}
                >
                  {fp.type === 'penguin' && (
                    <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
                      <path d="M50,85 L50,25 M50,65 L20,38 M50,65 L80,38" />
                    </svg>
                  )}
                  {fp.type === 'giraffe' && (
                    <svg className="w-10 h-10" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M43,20 C23,32 24,75 44,82 C46,82 46,20 43,20 Z M57,20 C77,32 76,75 56,82 C54,82 54,20 57,20 Z" />
                    </svg>
                  )}
                  {fp.type === 'bear' && (
                    <svg className="w-11 h-11" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M22,65 C22,50 34,44 50,44 C66,44 78,50 78,65 C78,79 66,85 50,85 C34,85 22,79 22,65 Z"/>
                      <ellipse cx="18" cy="38" rx="6" ry="8" transform="rotate(-20 18 38)"/>
                      <ellipse cx="32" cy="27" rx="7" ry="9" transform="rotate(-8 32 27)"/>
                      <ellipse cx="50" cy="23" rx="7" ry="10"/>
                      <ellipse cx="68" cy="27" rx="7" ry="9" transform="rotate(8 68 27)"/>
                      <ellipse cx="82" cy="38" rx="6" ry="8" transform="rotate(20 82 38)"/>
                    </svg>
                  )}
                  {fp.type === 'lion' && (
                    <svg className="w-10 h-10" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M31,68 C31,52 40,48 50,48 C60,48 69,52 69,68 C69,80 59,84 50,84 C41,84 31,80 31,68 Z"/>
                      <ellipse cx="27" cy="39" rx="7" ry="10" transform="rotate(-15 27 39)"/>
                      <ellipse cx="41" cy="28" rx="8" ry="11"/>
                      <ellipse cx="59" cy="28" rx="8" ry="11"/>
                      <ellipse cx="73" cy="39" rx="7" ry="10" transform="rotate(15 73 39)"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>

            {/* Micro Compass Loader */}
            <div className="relative flex flex-col items-center scale-90 md:scale-100">
              <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                {/* Outermost ring */}
                <svg className="absolute w-full h-full animate-[spin_30s_linear_infinite] opacity-40" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="49" stroke="#f8a282" strokeWidth="0.2" fill="none" strokeDasharray="1.5 3.5" />
                  <text x="50" y="6" fill="#ee7752" fontSize="2.5" fontFamily="monospace" textAnchor="middle">N - HEAD</text>
                  <text x="94" y="52.2" fill="#ee7752" fontSize="2.5" fontFamily="monospace" textAnchor="middle">90°</text>
                  <text x="50" y="97.5" fill="#ee7752" fontSize="2.5" fontFamily="monospace" textAnchor="middle">180°</text>
                  <text x="7" y="52.2" fill="#ee7752" fontSize="2.5" fontFamily="monospace" textAnchor="middle">270°</text>
                </svg>

                {/* Sweep scanner ring */}
                <svg className="absolute w-[82%] h-[82%] animate-[spin_12s_linear_infinite_reverse] opacity-65" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f8a282" strokeWidth="0.5" fill="none" strokeDasharray="12 110" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="38" stroke="#ee7752" strokeWidth="0.1" fill="none" opacity="0.3" />
                </svg>

                {/* Central lens focal core */}
                <div className="w-36 h-36 rounded-full border border-white/10 flex flex-col items-center justify-center bg-white/5 backdrop-blur-3xl shadow-[inset_0_0_30px_rgba(255,255,255,0.04),0_12px_45px_rgba(0,0,0,0.5)] z-10 relative">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-mono font-black tracking-tighter text-[#f8a282]">
                      {String(Math.floor(progress)).padStart(3, '0')}
                    </span>
                    <span className="text-[10px] font-mono text-[#f8a282]/60 ml-0.5">%</span>
                  </div>
                  <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-white/40 mt-1">Satellite Link</span>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-themeCoral animate-ping"></div>
                </div>

                {/* Thin technical axis lines */}
                <div className="absolute inset-0 pointer-events-none opacity-15">
                  <div className="absolute top-1/2 left-0 w-full h-[0.4px] bg-white"></div>
                  <div className="absolute left-1/2 top-0 w-[0.4px] h-full bg-white"></div>
                </div>
              </div>

              {/* Loader telemetry display */}
              <div className="text-center w-80">
                <h2 className="font-serif text-2xl uppercase tracking-[0.6em] text-[#fdfaf5] font-black mb-3">ZOE ZOO</h2>
                <div className="text-[8px] font-mono uppercase tracking-[0.25em] text-[#ee7752] h-4 mb-8">
                  {telemetryLogs[telemetryIndex]}
                </div>
                
                <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6 px-1">
                  <div className="text-left font-mono">
                    <span className="block text-[6px] text-white/30 uppercase tracking-widest mb-0.5">GEO-LOCK COORD</span>
                    <span className="text-[8px] text-white/55">
                      GPS: {(22.3951 + progress * 0.0019).toFixed(4)}° N
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="block text-[6px] text-white/30 uppercase tracking-widest mb-0.5">ELEVATION ALTIMETER</span>
                    <span className="text-[8px] text-white/55">
                      ALT: {Math.floor(250 + progress * 16.4)} M
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating global clicked footprint telemetry layer */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <AnimatePresence>
          {screenFootprints.map(fp => (
            <motion.div 
              key={fp.id}
              initial={{ opacity: 0.8, scale: 0.5 }}
              animate={{ opacity: [0.8, 0.45, 0], scale: [1, 1.1, 0.85] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.5, ease: "easeOut" }}
              className="absolute text-[#f8a282]/30 drop-shadow-[0_0_8px_rgba(238,119,82,0.18)]"
              style={{ left: `${fp.x}vw`, top: `${fp.y}vh`, transform: `translate(-50%, -50%) rotate(${fp.rotate}deg)` }}
            >
              {fp.type === 'penguin' && (
                <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                  <path d="M50,85 L50,25 M50,65 L20,38 M50,65 L80,38" />
                </svg>
              )}
              {fp.type === 'giraffe' && (
                <svg className="w-8 h-8" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M43,20 C23,32 24,75 44,82 C46,82 46,20 43,20 Z M57,20 C77,32 76,75 56,82 C54,82 54,20 57,20 Z" />
                </svg>
              )}
              {fp.type === 'bear' && (
                <svg className="w-8 h-8" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M22,65 C22,50 34,44 50,44 C66,44 78,50 78,65 C78,79 66,85 50,85 C34,85 22,79 22,65 Z"/>
                  <ellipse cx="18" cy="38" rx="6" ry="8" transform="rotate(-20 18 38)"/>
                  <ellipse cx="32" cy="27" rx="7" ry="9" transform="rotate(-8 32 27)"/>
                  <ellipse cx="50" cy="23" rx="7" ry="10"/>
                  <ellipse cx="68" cy="27" rx="7" ry="9" transform="rotate(8 68 27)"/>
                  <ellipse cx="82" cy="38" rx="6" ry="8" transform="rotate(20 82 38)"/>
                </svg>
              )}
              {fp.type === 'lion' && (
                <svg className="w-8 h-8" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M31,68 C31,52 40,48 50,48 C60,48 69,52 69,68 C69,80 59,84 50,84 C41,84 31,80 31,68 Z"/>
                  <ellipse cx="27" cy="39" rx="7" ry="10" transform="rotate(-15 27 39)"/>
                  <ellipse cx="41" cy="28" rx="8" ry="11"/>
                  <ellipse cx="59" cy="28" rx="8" ry="11"/>
                  <ellipse cx="73" cy="39" rx="7" ry="10" transform="rotate(15 73 39)"/>
                </svg>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sci-Fi Quantum Relocation Transition Gate Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto select-none font-mono"
          >
            {/* Left Gate shutter */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#060c18] border-r border-[#ee7752]/40 flex justify-end items-center overflow-hidden"
            >
              {/* Internal abstract grid details */}
              <div className="absolute inset-0 grid-blueprint opacity-10" />
              <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-v from-transparent via-[#ee7752] to-transparent shadow-[0_0_20px_#ee7752,0_0_40px_#ee7752]" />
            </motion.div>

            {/* Right Gate shutter */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#060c18] border-l border-[#ee7752]/40 flex justify-start items-center overflow-hidden"
            >
              {/* Internal abstract grid details */}
              <div className="absolute inset-0 grid-blueprint opacity-10" />
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-v from-transparent via-[#ee7752] to-transparent shadow-[0_0_20px_#ee7752,0_0_40px_#ee7752]" />
            </motion.div>

            {/* Futuristic Tech Scanner Portal Ring (fades in when gates meet) */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
              className="relative z-25 p-8 rounded-full border border-[#ee7752]/45 bg-[#0e182e]/95 backdrop-blur-xl w-[350px] h-[350px] flex flex-col items-center justify-center text-center shadow-[0_0_100px_rgba(238,119,82,0.25)]"
            >
              {/* Outer spinning tech ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#f8a282]/30 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-4 rounded-full border border-[#ee7752]/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              
              <div className="w-12 h-12 rounded-full border border-[#ee7752]/50 flex items-center justify-center mb-4 relative bg-[#0e182e]/80">
                <Compass className="w-6 h-6 text-[#f8a282] animate-spin" style={{ animationDuration: '5s' }} />
                <div className="absolute inset-0 rounded-full border border-[#ee7752]/20 border-t-[#ee7752] animate-spin" style={{ animationDuration: '1.2s' }}></div>
              </div>

              <span className="text-[9.5px] uppercase font-black tracking-[0.5em] text-[#ee7752] animate-pulse">
                QUANTUM EXPEDITION WARP
              </span>
              <div className="text-[7.5px] uppercase tracking-widest text-[#f8a282]/50 font-bold mb-4">
                Active Spatial Coordinates Shift
              </div>

              {/* Glowing vector path */}
              <div className="flex items-center justify-center gap-4 w-full max-w-[240px] border-t border-b border-white/5 py-3.5 mb-4 my-2">
                <div className="text-right">
                  <span className="block text-[5.5px] text-white/40 uppercase tracking-widest">ORIGIN ZONE</span>
                  <span className="text-[9px] text-[#f8a282] font-black uppercase tracking-widest">{transitionFrom || 'ENTRY'}</span>
                </div>
                <div className="text-[9px] text-[#ee7752]/60 font-black animate-pulse">
                  ⇾ ⇾
                </div>
                <div className="text-left">
                  <span className="block text-[5.5px] text-white/40 uppercase tracking-widest">DESTINATION</span>
                  <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">{transitionTo || 'SECURE'}</span>
                </div>
              </div>

              {/* Status telemetry read */}
              <div className="text-[7px] text-white/40 tracking-widest uppercase flex items-center gap-1.5 animate-pulse">
                <span className="w-1 h-1 rounded-full bg-[#ee7752] inline-block"></span>
                ● TUNNELING VECTOR ENVELOPE...
              </div>

              {/* Scanning Laser Line */}
              <motion.div 
                initial={{ top: '10%' }}
                animate={{ top: '90%' }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="absolute left-10 right-10 h-[1.5px] bg-[#ee7752] shadow-[0_0_12px_#ee7752,0_0_24px_#f8a282] z-10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blueprint grid layout backdrop */}
      <div className="fixed inset-0 grid-blueprint opacity-60 pointer-events-none z-[-20]"></div>
      
      {/* Dynamic atmospheric color bleed background (corresponds to ambientIndex) */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0e182e] pointer-events-none">
        <div 
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[160px] opacity-25 -top-1/4 -left-1/4 transition-colors duration-[2500ms]"
          style={{ background: `radial-gradient(circle, ${ambientBackgrounds[ambientIndex % ambientBackgrounds.length].from} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute w-[90vw] h-[90vw] rounded-full blur-[180px] opacity-20 -bottom-1/3 -right-1/4 transition-colors duration-[2500ms]"
          style={{ background: `radial-gradient(circle, ${ambientBackgrounds[ambientIndex % ambientBackgrounds.length].to} 0%, transparent 70%)` }}
        />
      </div>

      <div className="noise-overlay absolute inset-0 pointer-events-none z-40 opacity-5"></div>

      {/* 2. Premium Fixed Header Bar (Floating Glass Dock) */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl z-50 bg-[#0e182e]/60 backdrop-blur-3xl border border-white/10 hover:border-themeCoral/25 py-2.5 px-5 md:px-8 rounded-full flex justify-between items-center transition-all duration-500 shadow-[0_16px_50px_-10px_rgba(7,13,25,0.9),_0_0_30px_rgba(238,119,82,0.03)]">
        <div className="flex items-center space-x-4 md:space-x-5">
          <div className="flex flex-col cursor-pointer group" onClick={() => { jumpTo('home'); setShowModuleAtlas(false); }}>
            <span className="font-serif text-base md:text-lg tracking-[0.45em] uppercase font-black text-themePeach leading-none group-hover:text-white transition-colors duration-300">ZOE ZOO</span>
            <span className="text-[7px] tracking-[0.3em] uppercase font-mono text-blue-200/40 mt-1 leading-none transition-colors duration-300 group-hover:text-blue-200/60">Wilderness Inst.</span>
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-white/10" />

          {/* Micro Active Status indicator */}
          <div className="hidden md:flex items-center space-x-1.5 text-[6.5px] text-emerald-400 font-mono tracking-widest uppercase">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span>SECURE GATEWAY ACTIVE</span>
          </div>
        </div>

        {/* Section Navigation with sliding glass capsule indicator */}
        <div className="hidden lg:flex items-center space-x-4 text-[8.5px] uppercase tracking-[0.2em] font-extrabold relative">
          {[
            { id: 'home', tag: '01', label: 'The Sanctuary' },
            { id: 'hub', tag: '02', label: 'Community Hub' },
            { id: 'calendar', tag: '03', label: 'Advent Chrono' },
            { id: 'map', tag: '04', label: 'Sanctuary Map' },
            { id: 'encyclopedia', tag: '05', label: 'Species Archive' },
          ].map((item) => {
            const isCurrent = activeSection === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => { jumpTo(item.id as any); setShowModuleAtlas(false); }} 
                className={`transition-all py-2 px-3.5 rounded-full relative ${isCurrent ? 'text-white' : 'text-white/55 hover:text-white'}`}
              >
                <span className="relative z-10 flex items-center">
                  <span className={`text-[6.5px] font-mono mr-1.5 ${isCurrent ? 'text-themePeach font-black' : 'text-themeCoral/60'}`}>{item.tag}</span>
                  {item.label}
                </span>
                {isCurrent && (
                  <motion.div 
                    layoutId="navActiveBg" 
                    className="absolute inset-0 bg-[#ee7752]/10 border border-[#ee7752]/15 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-3.5">
          {/* Web Audio Synthetic Toggle and visualization */}
          <div className="flex items-center space-x-2.5 bg-white/[0.04] py-1 px-3 rounded-full border border-white/5">
            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest hidden sm:inline">SYNTH</span>
            
            {soundEnabled && (
              <div className="flex items-end gap-[1.5px] h-2.5 px-0.5 pointer-events-none w-4">
                <span className="w-[1.5px] bg-[#ee7752] rounded-full animate-pulse" style={{ height: '50%' }} />
                <span className="w-[1.5px] bg-[#f8a282] rounded-full animate-pulse" style={{ height: '90%' }} />
                <span className="w-[1.5px] bg-[#ee7752] rounded-full animate-pulse" style={{ height: '35%' }} />
              </div>
            )}

            <button 
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                if (nextState) {
                  if (!audioCtxRef.current) {
                    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                  }
                  playOscillator(523.25, 'sine', 0.25, 0.08); // high C tone
                }
              }}
              className={`p-1.5 border rounded-full transition-all flex items-center justify-center ${soundEnabled ? 'bg-themeCoral/20 border-themeCoral/45 text-themePeach shadow-[0_0_8px_rgba(238,119,82,0.15)]' : 'border-white/10 text-white/40 hover:text-[#f8a282] hover:bg-white/5'}`}
            >
              {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </button>
          </div>

          <button 
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setShowModuleAtlas(false);
              playOscillator(300, 'sine', 0.1, 0.05);
            }}
            className="lg:hidden p-2 rounded-full bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all duration-300"
            title="Sectors Atlas Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-themeCoral" /> : <LayoutGrid className="w-4 h-4 text-themePeach animate-pulse" />}
          </button>

          <button 
            onClick={() => jumpTo('calendar')}
            className="hidden sm:inline-block relative overflow-hidden rounded-full p-[1px] group transition-all duration-300 active:scale-95 shadow-[0_4px_15px_rgba(238,119,82,0.1)] hover:shadow-[0_4px_22px_rgba(238,119,82,0.22)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-themeCoral to-themePeach rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="block relative bg-[#0e182e] hover:bg-transparent px-5 py-2 text-[8px] uppercase tracking-[0.25em] text-themePeach group-hover:text-[#0e182e] font-black rounded-full transition-all duration-500 leading-none">
              Book Access
            </span>
          </button>
        </div>
      </nav>

      {/* 2.5. HIGH END SYSTEM ATLAS DROPDOWN (Lists all available layout sectors/modules with description & lovely animal micro-states) */}
      <AnimatePresence>
        {showModuleAtlas && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-55 bg-[#0e182e]/95 backdrop-blur-3xl border border-themeCoral/40 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(7,13,25,0.9),0_0_30px_rgba(238,119,82,0.1)] font-mono"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <div>
                <span className="text-[9px] uppercase text-[#ee7752] font-black tracking-widest block">BIO-DOME QUANTUM DIRECTORY // 园区模块档案一览</span>
                <h4 className="text-[8px] text-blue-200/40 uppercase tracking-widest mt-1">Holographic Grid Portal & Navigation Center</h4>
              </div>
              <button 
                onClick={() => setShowModuleAtlas(false)}
                className="text-white/40 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of 5 Modules */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  id: "home",
                  num: "[S1]",
                  title: "THE SANCTUARY",
                  zh: "探索神秘乐园",
                  desc: "Featuring dynamic customizable letter lenses, satellite altitude diagnostic trackers, and procedural soundtrack synthesizer engines.",
                  status: "ONLINE // GEO-LOCKED",
                  icon: "🦁"
                },
                {
                  id: "hub",
                  num: "[S2]",
                  title: "COMMUNITY HUB",
                  zh: "社区生活中心",
                  desc: "Read interactive biometric zoo events, adopt a species to lock state indicators, or apply for reserve patrol volunteering.",
                  status: "3 BIOMETRIC PORTALS ACTIVE",
                  icon: "koala"
                },
                {
                  id: "calendar",
                  num: "[S3]",
                  title: "ADVENT CHRONO",
                  zh: "每日奇遇历及票务",
                  desc: "Claim customized digital boarding pass tickets, schedule customized live animal activities, and view advent schedules.",
                  status: "SYSTEM READY",
                  icon: "penguin"
                },
                {
                  id: "map",
                  num: "[S4]",
                  title: "SANCTUARY MAP",
                  zh: "互动三维气象地图",
                  desc: "Monitor live microclimate systems, control bio-domes mist valves, dispatch feed packages, and listen acoustic sensors feeds.",
                  status: "THERMAL ENVELOPE SECURE",
                  icon: "marine"
                },
                {
                  id: "encyclopedia",
                  num: "[S5]",
                  title: "SPECIES ARCHIVE",
                  zh: "珍稀物种全息档案",
                  desc: "Inspect species classification databases, look at live weights, habitats, and unlock audio calls or realistic weights data sheets.",
                  status: "28 SPECIMEN PORTALS INGESTED",
                  icon: "owl"
                }
              ].map((m) => {
                const isActive = activeSection === m.id;
                return (
                  <motion.div 
                    key={m.id}
                    whileHover={{ scale: 1.025, y: -4 }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${isActive ? 'bg-themeCoral/15 border-themeCoral/60 shadow-[0_0_15px_rgba(238,119,82,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]'}`}
                    onClick={() => {
                      jumpTo(m.id as any);
                      setShowModuleAtlas(false);
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[14px]">
                        {m.icon === "🦁" && "🦁"}
                        {m.icon === "koala" && "🐨"}
                        {m.icon === "penguin" && "🐧"}
                        {m.icon === "marine" && "🐬"}
                        {m.icon === "owl" && "🦉"}
                      </span>
                      <span className="text-[8px] font-black text-[#ee7752] font-mono">{m.num}</span>
                    </div>

                    <h5 className="text-[9px] font-black tracking-widest text-[#fdfaf5] uppercase mb-0.5">{m.title}</h5>
                    <div className="text-[7.5px] text-themePeach mb-3 font-sans font-bold">{m.zh}</div>
                    <p className="text-[8.5px] font-sans text-blue-200/40 leading-relaxed mb-4 line-clamp-4">{m.desc}</p>
                    
                    <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[6px] tracking-widest">
                      <span className="text-white/30 uppercase">STATUS</span>
                      <span className={`font-black ${isActive ? 'text-themePeach' : 'text-blue-200/40'}`}>{isActive ? 'CURRENT' : 'STANDBY'}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2.6. MOBILE FULL SCREEN NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed inset-y-0 right-0 w-[85%] max-w-sm z-45 bg-[#0e182e]/98 backdrop-blur-3xl border-l border-themeCoral/20 p-8 flex flex-col pt-24 font-mono shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* HUD Divider Line */}
            <div className="absolute top-20 left-8 right-8 border-t border-white/5" />
            
            <div className="flex flex-col gap-4 mt-4">
              <span className="text-[8px] uppercase tracking-[0.25em] text-[#ee7752]/60 mb-2">Sanctuary Sectors & Modules // 网页模块</span>
              {[
                { id: 'home', tag: "Sector 01", name: 'The Sanctuary', zh: "探索神秘乐园", emoji: "🦁" },
                { id: 'hub', tag: "Sector 02", name: 'Community Hub', zh: "社区生活中心", emoji: "🐨" },
                { id: 'calendar', tag: "Sector 03", name: 'Advent Chrono', zh: "每日奇遇历及票务", emoji: "🐧" },
                { id: 'map', tag: "Sector 04", name: 'Sanctuary Map', zh: "互动三维气象地图", emoji: "🐬" },
                { id: 'encyclopedia', tag: "Sector 05", name: 'Species Archive', zh: "珍稀物种全息档案", emoji: "🦉" }
              ].map((sector) => {
                const isActive = activeSection === sector.id;
                return (
                  <button
                    key={sector.id}
                    onClick={() => {
                      jumpTo(sector.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${isActive ? 'bg-[#ee7752]/10 border-themeCoral/40 text-themePeach shadow-[0_0_12px_rgba(238,119,82,0.1)]' : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-base">{sector.emoji}</span>
                      <div>
                        <span className="block text-[6px] font-mono uppercase tracking-widest text-[#ee7752] font-black">{sector.tag}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-white block">{sector.name}</span>
                        <span className="text-[8px] font-sans font-semibold text-blue-200/40">{sector.zh}</span>
                      </div>
                    </div>
                    <span className="text-[8px] text-white/30">⇾</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto border-t border-white/5 pt-6 text-center">
              <span className="text-[8px] text-[#f8a282]/40 uppercase tracking-widest block mb-2">ZOE ZOO WILDERNESS INST.</span>
              <button 
                onClick={() => { jumpTo('calendar'); setMobileMenuOpen(false); }}
                className="w-full bg-[#ee7752] text-themeDarkBase font-black text-[9px] uppercase tracking-widest py-2.5 rounded-lg"
              >
                Book Access Pass
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Hero / Homepage Screen (THE SANCTUARY) */}
      <section id="home" className="relative min-h-screen w-full flex flex-col justify-center items-center pt-24 pb-16 bg-themeDarkBase select-none">
        {/* Background Silhouette Image - Discreet and non-distracting */}
        <div 
          className="absolute inset-x-0 bottom-0 top-0 pointer-events-none opacity-[0.015] overflow-hidden select-none"
          style={{
            backgroundImage: `url(${animalSilhouetteImg})`,
            backgroundPosition: 'bottom center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'screen',
            filter: 'invert(1) contrast(1.1)',
          }}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full px-6 max-w-7xl z-10"
        >
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="block text-[#ee7752] uppercase tracking-[0.65em] text-[10px] md:text-xs mb-8 font-black"
          >
            EXPERIENCE WILDLIFE IN THE HEART OF THE CITY
          </motion.span>
          
          {/* Elegant Display text featuring custom letter apertures */}
          <div className="flex justify-center items-center flex-wrap select-none py-4">
            {"ZOEZOO".split('').map((char, index) => {
              const pos = lensPositions[index] || { x: 50, y: 50, hover: false };
              return (
                <span 
                  key={index}
                  onMouseMove={(e) => handleLetterLensMouseMove(index, e)}
                  onMouseLeave={() => handleLetterLensLeave(index)}
                  onClick={() => {
                    playOscillator(180 + index * 80, 'sine', 0.4, 0.06);
                    setAmbientIndex(prev => prev + 1);
                  }}
                  className={`letter-lens cursor-pointer mx-1 md:mx-2 select-none relative transition-all duration-300`}
                  style={{
                    backgroundImage: pos.hover ? `url(${lensImages[index]})` : `linear-gradient(to bottom, #ee7752, #f8a282, #ee7752)`,
                    backgroundPosition: pos.hover ? `${pos.x}% ${pos.y}%` : 'center',
                    filter: pos.hover ? 'drop-shadow(0 10px 25px rgba(238, 119, 82, 0.4))' : 'none',
                    transform: pos.hover ? 'scale(1.09) rotate(2deg) translateY(-8px)' : 'none'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="max-w-2xl mx-auto mt-10"
          >
            <p className="text-xs md:text-sm text-blue-200/40 uppercase tracking-[0.25em] mb-12 leading-relaxed min-h-[3.5rem]">
              {typedHomeDesc.split('\n').map((line, lIdx) => (
                <span key={lIdx} className="block">
                  {line}
                </span>
              ))}
              <span className="inline-block w-1.5 h-3 bg-themePeach ml-0.5 animate-pulse" />
            </p>
            
            <button 
              onClick={() => jumpTo('calendar')}
              className="inline-flex flex-col items-center justify-center p-3 rounded-full hover:bg-themeCoral/10 text-[#f8a282] transition-colors border border-themeCoral/20 mx-auto"
            >
              <span className="text-[8px] uppercase tracking-[0.15em] mb-1 opacity-50 block px-2">EXPLORE CHRONOLOGY</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </motion.div>
        </motion.div>

        {/* Diagonal technical corner indicators */}
        <div className="absolute bottom-6 left-12 hidden md:block text-[8px] font-mono opacity-30 tracking-widest text-[#f8a282]">
          SYSTEM ID: AIS-R4 // LAT: 22.39° N
        </div>
        <div className="absolute bottom-6 right-12 hidden md:block text-[8px] font-mono opacity-30 tracking-widest text-[#f8a282]">
          LOCAL TIME: {new Date().toLocaleTimeString()}
        </div>
      </section>

      {/* 3.5. Community Hub & Dynamic Portals (News, Adopt, Volunteer) */}
      <section id="hub" className="relative min-h-screen w-full flex flex-col justify-center items-center py-24 px-4 md:px-12 bg-[#0a1122] border-b border-themeCoral/15 overflow-hidden select-none">
        {/* Abstract vector tech lines background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-themeCoral" />
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-themeCoral" />
          <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-themeCoral" strokeDasharray="5,5" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl z-10"
        >
          {/* Section Heading */}
          <div className="text-center mb-16 relative">
            <span className="text-[#ee7752] uppercase tracking-[0.5em] text-[10px] md:text-xs mb-3 font-semibold block">INTELLIGENT CITIZEN NETWORK</span>
            <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[0.25em] text-white font-black">COMMUNITY PORTAL</h2>
            <div className="w-16 h-[2px] bg-gradient-to-r from-themeCoral to-themePeach mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: TRENDING NEWS & EVENTS (Take 4 Columns) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-panel glass-panel-hover rounded-3xl p-6 border border-themeCoral/20 bg-[#1c305d]/10 flex flex-col h-full min-h-[500px]">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
                  <Activity className="w-5 h-5 text-themeCoral animate-pulse" />
                  <div>
                    <h3 className="font-serif text-lg tracking-wider text-themePeach uppercase font-black">News & Events</h3>
                    <p className="text-[7.5px] font-mono uppercase tracking-widest text-[#f8a282]/40">Active Dispatch Center</p>
                  </div>
                </div>

                {/* News Items List */}
                <div className="flex flex-col gap-4 flex-grow">
                  {[
                    {
                      label: "HOLOGRAPHIC NATURE SEASON",
                      date: "JUNE 15 - JULY 30",
                      title: "Aurora Night Safaris Open",
                      brief: "Dusk is alive! Experience the sanctuary in simulated low-lux infrared settings, featuring state-of-the-art holographic animal trackers.",
                      details: "This season, the botanical nocturnal sectors receive integrated organic bioluminescent lighting, providing full safe-spectrum observation capabilities. Included with premium night passes."
                    },
                    {
                      label: "NEWBORN VETERINAL SIGHTING",
                      date: "UPDATED YESTERDAY",
                      title: "Pygmy Hippo Cub Born",
                      brief: "A fragile miracle in the oceanic marsh. Our expert veterinary units have deployed 24/7 telemetric link monitors to chart early milestones.",
                      details: "Healthy, active, and feeding properly! The mother, Iris, has been provided custom organic bamboo and marsh flora bedding. Guest-side high-zoom sensor goggles are active today."
                    },
                    {
                      label: "INFRASTRUCTURE UPGRADE",
                      date: "COMPLETED",
                      title: "Coral Reef Bio-Dome 2.0",
                      brief: "The marine sphere completes deep-water pressure synchronization, introducing high-fidelity wave current modules.",
                      details: "By rebuilding natural current patterns, we have increased local plankton colony density by 42%. Guests can interact with custom sonar wave controllers at Level 3 docks."
                    }
                  ].map((news, nIdx) => {
                    const isExpanded = expandedNewsIndex === nIdx;
                    const isAudioPlaying = activeEventAudioIndex === nIdx;
                    
                    // Popularity and animal tag settings for each hot activity
                    const popularityRatings = ["🔥 99.4% REAL-TIME POPULARITY", "🔥 98.1% ECO-LOG INTEREST", "🔥 96.5% HIGHLY RECOMMENDED"];
                    const microAnimals = [
                      { emoji: "🦉", name: "Nocturnal Owl", status: "Active" },
                      { emoji: "🦛", name: "Pygmy Hippo", status: "Napping" },
                      { emoji: "🐠", name: "Reef Clownfish", status: "Swimming" }
                    ];

                    return (
                      <motion.div 
                        key={nIdx} 
                        whileHover={{ scale: 1.025, y: -4 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={`p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer overflow-hidden ${isExpanded ? 'bg-[#ee7752]/12 border-[#ee7752]/50 shadow-[0_12px_25px_rgba(238,119,82,0.12)]' : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]'}`}
                        onClick={() => {
                          playOscillator(261.63 + nIdx * 65.41, 'sine', 0.15, 0.05);
                          setExpandedNewsIndex(isExpanded ? null : nIdx);
                        }}
                      >
                        {/* Hot Activity Glow Accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-themeCoral/15 to-transparent blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex justify-between items-center mb-1.5 relative z-10">
                          <span className="text-[7px] font-mono text-[#ee7752]/80 uppercase tracking-widest font-black leading-none">{news.label}</span>
                          <span className="text-[6.5px] font-mono text-white/30 uppercase tracking-widest leading-none">{news.date}</span>
                        </div>

                        <h4 className="text-xs font-black uppercase text-white tracking-wide mb-1.5 flex items-center justify-between relative z-10">
                          <span className="flex items-center gap-1">
                            <span>{news.title}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[7.5px] font-mono text-[#ee7752] font-black">{microAnimals[nIdx].emoji}</span>
                            <Sparkles className={`w-3 h-3 text-[#f8a282]/80 transition-transform duration-300 ${isExpanded ? 'rotate-45 scale-110' : 'opacity-40 group-hover:opacity-100'}`} />
                          </span>
                        </h4>

                        <p className="text-[10px] text-blue-200/50 leading-relaxed font-sans mb-3 relative z-10">{news.brief}</p>

                        {/* Interactive dynamic telemetry widgets for each hot event */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 relative z-10">
                          {/* Live interactive hot index tag */}
                          <span className="text-[6.5px] font-mono text-emerald-400 tracking-wider flex items-center gap-1 uppercase">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping block" style={{ animationDuration: '1.5s' }} />
                            {popularityRatings[nIdx]}
                          </span>

                          {/* Sound feedback button for hot popular events */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // prevent collapsing accordion
                              if (isAudioPlaying) {
                                setActiveEventAudioIndex(null);
                                playOscillator(180, 'sine', 0.15, 0.06);
                              } else {
                                setActiveEventAudioIndex(nIdx);
                                if (soundEnabled) {
                                  if (nIdx === 0) {
                                    playOscillator(110, 'triangle', 0.4, 0.25);
                                    setTimeout(() => playOscillator(330, 'sine', 0.15, 0.08), 120);
                                    setTimeout(() => playOscillator(440, 'sine', 0.1, 0.05), 240);
                                  } else if (nIdx === 1) {
                                    playOscillator(587.33, 'sine', 0.3, 0.08);
                                    setTimeout(() => playOscillator(880, 'sine', 0.2, 0.06), 150);
                                  } else {
                                    playOscillator(150, 'sawtooth', 0.25, 0.3);
                                    setTimeout(() => playOscillator(523.25, 'triangle', 0.2, 0.12), 100);
                                  }
                                }
                                setTimeout(() => {
                                  setActiveEventAudioIndex(curr => curr === nIdx ? null : curr);
                                }, 5000);
                              }
                            }}
                            className={`px-2 py-1 rounded-md text-[7px] font-mono uppercase tracking-widest flex items-center gap-1 transition-all border ${isAudioPlaying ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-[#0e182e]/85 text-[#f8a282] border-[#ee7752]/20 hover:border-[#ee7752]/50 hover:bg-[#ee7752]/10'}`}
                          >
                            <Activity className={`w-2.5 h-2.5 ${isAudioPlaying ? 'animate-spin' : 'animate-pulse'}`} />
                            <span>{isAudioPlaying ? 'LIVE SCANNER ACTIVE' : 'SIM ACOUSTIC'}</span>
                          </button>
                        </div>

                        {/* Acoustic Visualizer & Miniature Animal Running footsteps simulator inside the card */}
                        <AnimatePresence>
                          {isAudioPlaying && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 bg-[#0a1122]/90 border border-emerald-500/25 rounded-xl p-2 flex items-center justify-between pointer-events-none relative overflow-hidden"
                            >
                              <div className="flex items-center gap-2">
                                {/* Glowing Equalizer bars */}
                                <div className="flex items-end gap-0.5 h-3">
                                  {[...Array(5)].map((_, barIdx) => (
                                    <motion.div 
                                      key={barIdx}
                                      animate={{ height: ["20%", "100%", "25%", "85%", "20%"] }}
                                      transition={{ duration: 0.5 + barIdx * 0.12, repeat: Infinity, ease: "easeInOut" }}
                                      className="w-0.5 bg-gradient-to-t from-[#ee7752] to-[#f8a282] rounded-full"
                                    />
                                  ))}
                                </div>
                                <span className="text-[6.5px] font-mono text-blue-200/40 uppercase tracking-widest">Acoustic Signal Locked...</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[8px] uppercase tracking-widest text-[#f8a282] font-black animate-bounce flex items-center gap-1">
                                  <span>{microAnimals[nIdx].emoji}</span>
                                  <span>{microAnimals[nIdx].name}</span>
                                </span>
                                <span className="text-[6px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-1 border border-emerald-800/35 rounded-sm">
                                  {microAnimals[nIdx].status}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Dynamic Accordion Details using motion */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className="overflow-hidden border-t border-[#ee7752]/20 pt-2.5 relative z-10"
                            >
                              <p className="text-[9.5px] font-mono text-[#f8a282]/80 leading-relaxed uppercase tracking-wide">
                                {news.details}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COLUMN 2: INTERACTIVE ANIMAL ADOPTION (Take 4 Columns) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-panel glass-panel-hover rounded-3xl p-6 border border-themeCoral/20 bg-[#1c305d]/10 flex flex-col h-full min-h-[500px]">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
                  <Heart className="w-5 h-5 text-[#ee7752]" />
                  <div>
                    <h3 className="font-serif text-lg tracking-wider text-themePeach uppercase font-black">Animal Bond</h3>
                    <p className="text-[7.5px] font-mono uppercase tracking-widest text-[#f8a282]/40">Active Co-Existence</p>
                  </div>
                </div>

                {/* Adoptable Animals Slider Data */}
                {[
                  {
                    name: "Emperor Pengy",
                    species: "Aptenodytes forsteri",
                    status: "Oceanic Floe Protection",
                    snack: "Glow Krill",
                    adopted: 342,
                    bio: "An active sub-zero diver, loves sliding along the crystal thermal structures.",
                    img: kingPenguinImg
                  },
                  {
                    name: "Little Tembo",
                    species: "Loxodonta africana",
                    status: "Tropical Preservation",
                    snack: "Pluvial Grass Mats",
                    adopted: 189,
                    bio: "A young energetic calf exploring water spraying games with caretakers daily.",
                    img: elephantSprayWaterImg
                  },
                  {
                    name: "Zari Giraffe",
                    species: "Giraffa camelopardalis",
                    status: "Savannah Canopy Sentinel",
                    snack: "Sweet Acacia Shoots",
                    adopted: 645,
                    bio: "A majestic high-reacher who loves grazing on fresh green canopies and engaging with guests from elevated wooden observation decks.",
                    img: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?q=80&w=1200"
                  }
                ].map((animal, aIdx) => {
                  if (selectedAdoptAnimal !== aIdx) return null;
                  return (
                    <motion.div 
                      key={aIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-grow flex flex-col"
                    >
                      {/* Photo Header */}
                      <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-4 group border border-white/5 bg-black/40">
                        <img 
                          src={animal.img} 
                          alt={animal.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                          <div>
                            <span className="text-[7px] font-mono text-[#ee7752] uppercase tracking-widest font-black block mb-0.5">{animal.species}</span>
                            <h4 className="text-sm font-black uppercase text-white tracking-widest">{animal.name}</h4>
                          </div>
                          <span className="text-[7px] font-mono text-white/50 bg-[#0e182e]/80 py-1 px-2 rounded-md border border-white/10 uppercase tracking-widest">
                            👥 {animal.adopted} Adopted
                          </span>
                        </div>
                      </div>

                      {/* Info lines */}
                      <div className="flex flex-col gap-2.5 font-mono mb-6 pb-4 border-b border-white/5">
                        <div className="flex justify-between items-center text-[9px] border-b border-white/5 pb-1.5">
                          <span className="text-white/40 uppercase">Preserve Sector</span>
                          <span className="text-themePeach uppercase font-bold text-right">{animal.status}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] border-b border-white/5 pb-1.5">
                          <span className="text-white/40 uppercase">Favorite Snack</span>
                          <span className="text-emerald-400 uppercase font-bold text-right">{animal.snack}</span>
                        </div>
                        <p className="text-[9.5px] leading-relaxed text-blue-200/50 italic font-sans text-center">
                          "{animal.bio}"
                        </p>
                      </div>

                      {/* Adoption Input Form */}
                      <div className="flex flex-col gap-3 font-mono mt-auto">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="ENTER ADOPTER NAME..." 
                            value={adoptParentName} 
                            onChange={(e) => setAdoptParentName(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 hover:border-white/20 focus:border-[#ee7752]/60 focus:bg-[#1a2d54]/25 text-white placeholder-white/25 text-[9.5px] tracking-widest px-4 py-2.5 rounded-xl transition-all font-mono outline-none text-center"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              playOscillator(250, 'sine', 0.1, 0.05);
                              setSelectedAdoptAnimal(prev => (prev === 0 ? 2 : prev - 1));
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white/80 transition-all px-3 py-2.5 rounded-xl border border-white/15 text-xs font-black"
                            title="Previous Animal"
                          >
                            ⇾
                          </button>
                          <button 
                            onClick={() => {
                              if (!adoptParentName.trim()) {
                                playOscillator(100, 'sawtooth', 0.2, 0.1);
                                return;
                              }
                              // Complete adoption process
                              playOscillator(587.33, 'sine', 0.5, 0.12); // D5 high note
                              setAdoptCompleted(true);
                              setAdoptConfetti(true);
                              setTimeout(() => setAdoptConfetti(false), 3000);
                            }}
                            className="flex-grow bg-gradient-to-r from-[#ee7752] to-[#f8a282] hover:shadow-[0_0_20px_rgba(238,119,82,0.3)] text-themeDarkBase font-black tracking-[0.25em] text-[9px] py-2.5 rounded-xl transition-all uppercase flex items-center justify-center space-x-2"
                          >
                            🤝 SECURE DIGITAL BOND
                          </button>
                          <button 
                            onClick={() => {
                              playOscillator(350, 'sine', 0.1, 0.05);
                              setSelectedAdoptAnimal(prev => (prev === 2 ? 0 : prev + 1));
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white/80 transition-all px-3 py-2.5 rounded-xl border border-white/15 text-xs font-black rotate-180"
                            title="Next Animal"
                          >
                            ⇾
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: CYBERNETIC VOLUNTEER REGISTRY (Take 4 Columns) / Teaser Level */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-panel glass-panel-hover rounded-3xl p-6 border border-themeCoral/20 bg-[#1c305d]/10 flex flex-col h-full min-h-[500px] justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
                    <Flame className="w-5 h-5 text-[#f8a282]" />
                    <div>
                      <h3 className="font-serif text-lg tracking-wider text-themePeach uppercase font-black">Reserve Patrol</h3>
                      <p className="text-[7.5px] font-mono uppercase tracking-widest text-[#f8a282]/40">Reserve Unit Registration</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 font-mono select-none">
                    <div className="p-4 rounded-2xl border border-white/5 bg-black/40">
                      <span className="text-[8px] font-mono text-emerald-400 font-black block mb-2">● SQUAD ACTIVE ENVELOPE // 巡逻中队状态</span>
                      <p className="text-[9.5px] text-white/70 leading-relaxed uppercase">
                        The Sanctuary Civilian Volunteer Force guards active boundaries, reports biosensor telemetry, and keeps vital biospheres enriched.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 text-center">
                        <span className="text-[7.5px] text-white/35 block uppercase tracking-widest">Active Sentinels</span>
                        <span className="text-xs font-black text-[#f8a282] mt-1.5 block">48 ACTIVE</span>
                      </div>
                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 text-center">
                        <span className="text-[7.5px] text-white/35 block uppercase tracking-widest">Global Coverage</span>
                        <span className="text-xs font-black text-emerald-400 mt-1.5 block">100% SECURE</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-blue-200/40 font-sans leading-relaxed mt-2 uppercase tracking-wide">
                      Patrol assignments include husbandry support, microclimate sensor audit, and nocturnal habitat observation tours. Registration requires biometric sign-off.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => {
                      playOscillator(440, 'sine', 0.15, 0.05);
                      setShowVolunteerModal(true);
                    }}
                    className="w-full bg-gradient-to-r from-themeCoral to-themePeach hover:shadow-[0_0_20px_rgba(238,119,82,0.3)] text-themeDarkBase font-black tracking-[0.2em] text-[9.5px] py-4 rounded-xl transition-all uppercase flex items-center justify-center space-x-2"
                  >
                    <span>🛡️ SIGN UP FOR PATROL // 申请加入</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Dynamic Full Screen Holographic Adoption Certificate Overlay */}
        <AnimatePresence>
          {adoptCompleted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-[#070d19]/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 pointer-events-auto select-none font-mono"
            >
              {adoptConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute w-[200px] h-[200px] border border-themeCoral/20 rounded-full animate-ping opacity-30" />
                  <div className="absolute w-[400px] h-[400px] border border-themeCoral/10 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.4s' }} />
                </div>
              )}

              <motion.div 
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-lg w-full p-8 md:p-12 rounded-3xl border border-[#ee7752]/40 bg-[#122143]/40 shadow-[0_0_100px_rgba(238,119,82,0.15)] flex flex-col items-center select-none"
              >
                {/* HUD Corner Tech Lines */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#ee7752]/60" />
                <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#ee7752]/60" />
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#ee7752]/60" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#ee7752]/60" />

                <div className="w-16 h-16 rounded-full border border-themeCoral/40 flex items-center justify-center mb-6 bg-themeCoral/5 relative">
                  <Heart className="w-8 h-8 text-[#f8a282]" />
                  <div className="absolute inset-0 rounded-full border border-themeCoral/15 animate-ping" />
                </div>

                <span className="text-[10px] uppercase tracking-[0.5em] text-[#ee7752] font-black mb-1">
                  OFFICIAL ADOPTION DECREE
                </span>
                <span className="text-[7.5px] uppercase tracking-widest text-white/30 mb-8 border-b border-white/5 pb-2 w-full text-center">
                  ZOE WILDERNESS INSTITUTE PORTAL // BOND-ID: AD-{Math.floor(10000 + Math.random() * 90000)}
                </span>

                <div className="text-center mb-8 flex flex-col items-center">
                  <span className="text-[8px] uppercase tracking-wider text-white/30 block mb-1">ADOMINATIVE PARENT GUARDIAN</span>
                  <span className="text-xl font-serif uppercase tracking-widest text-[#fdfaf5] font-black border-b border-themeCoral/30 px-6 pb-2.5 max-w-xs truncate text-center">
                    {adoptParentName}
                  </span>
                </div>

                <div className="text-center mb-10 text-xs text-white/70 tracking-widest uppercase leading-relaxed max-w-sm">
                  HAS ESTABLISHED A SECURE BIOMETRIC LIFE-SUPPORT CO-EXISTENCE BOND SUPPORTING OUR SACRED SPECIMEN:
                  <div className="text-[#f8a282] font-serif text-lg font-black tracking-widest mt-3 uppercase">
                    {selectedAdoptAnimal === 0 ? "🐧 Emperor Pengy" : selectedAdoptAnimal === 1 ? "🐘 Little Tembo (Elephant)" : "🦒 Zari Giraffe"}
                  </div>
                  <div className="text-[8px] text-white/30 tracking-widest block mt-4 uppercase">
                    A percentage of live solar panel resources and health nutrition feeds is officially locked under your guardian node.
                  </div>
                </div>

                <button 
                  onClick={() => {
                    playOscillator(150, 'sine', 0.2, 0.08);
                    setAdoptCompleted(false);
                    setAdoptParentName('');
                  }}
                  className="bg-gradient-to-r from-[#ee7752] to-[#f8a282] hover:shadow-[0_0_20px_rgba(238,119,82,0.3)] text-themeDarkBase font-black tracking-[0.25em] text-[9.5px] py-3 px-10 rounded-xl transition-all uppercase"
                >
                  Close & Secure Certificate
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. Interactive Advent Calendar Screen */}
      <section id="calendar" className="relative min-h-screen w-full flex flex-col justify-center items-center py-24 px-4 bg-[#122143]/40 border-t border-b border-themeCoral/10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center"
        >
          
          <div className="text-center mb-10">
            <div className="flex items-center gap-2 justify-center mb-3">
              <span className="w-2 h-2 bg-[#EE7752] rounded-full animate-ping"></span>
              <span className="text-[10px] tracking-[0.25em] font-mono text-themePeach uppercase font-bold">WILD ADVENT CHRONOLOGY</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight uppercase">May 2026 Calendar</h2>
            <p className="text-xs text-blue-200/40 uppercase tracking-widest mt-2">Hover active cells to swing door / Click to reveal deep specimen</p>
          </div>

          {/* Calendar Plate container */}
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.45)] border border-themeCoral/20 relative">
            <div className="text-[11px] font-mono text-themePeach tracking-widest uppercase mb-4 text-center">MAY 2026</div>

            {/* Grid Days headers */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[8px] font-mono tracking-wider opacity-45 uppercase text-[#fdfaf5] mb-2 font-bold select-none">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* May 2026 Grid starting on Friday (Offset of 5 empty blocks) */}
            <div className="grid grid-cols-7 gap-2.5 relative">
              {/* Offset cells */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={`offset-${idx}`} className="bg-transparent aspect-square flex items-center justify-center opacity-10">
                  <span className="w-1.5 h-1.5 bg-[#f8a282] rounded-full"></span>
                </div>
              ))}

              {/* 31 Calendar Days of May */}
              {Array.from({ length: 31 }).map((_, idx) => {
                const dayNum = idx + 1;
                const matchedAnimal = CALENDAR_ANIMALS.find(item => item.date === dayNum);
                const isToday = dayNum === 17; // Today is May 17th

                if (matchedAnimal) {
                  return (
                    <div
                      key={`day-${dayNum}`}
                      onMouseEnter={(e) => {
                        playOscillator(360 + matchedAnimal.id * 55, 'triangle', 0.15, 0.05);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredDayBubble({
                          day: matchedAnimal,
                          x: rect.left + rect.width / 2,
                          y: rect.top + window.scrollY - 15,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredDayBubble(null);
                      }}
                      onClick={() => {
                        playChords(300);
                        setSelectedDay(matchedAnimal);
                      }}
                      className="active-grid-cell bg-neutral-950/80 rounded-xl aspect-square cursor-pointer border border-[#2a4585]/40 transition-all duration-300 hover:scale-[1.07] select-none relative perspective-container"
                    >
                      {/* Sub-layer: Revealed photo behind */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden bg-neutral-900 pointer-events-none">
                        <img 
                          className="w-full h-full object-cover opacity-85 select-none" 
                          src={matchedAnimal.imageUrl} 
                          alt={matchedAnimal.role} 
                        />
                      </div>

                      {/* 3D Double sliding / outer swing door (Swing open left) */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                        <div 
                          className="inline-door-single w-full h-full border-r border-[#213a6e] flex items-center justify-between px-2.5 sm:px-3 origin-left shadow-lg select-none"
                          style={{ backgroundColor: '#1c305d' }}
                        >
                          {/* Left side: Premium glowing label */}
                          <span className="font-mono text-xs sm:text-sm font-black text-[#f8a282] tracking-tight">{String(dayNum).padStart(2, '0')}</span>
                          
                          {/* Handle plate */}
                          <div className="w-1.5 h-4 sm:w-2 sm:h-5 border border-stone-800/40 rounded-full bg-themeDarkBase flex flex-col justify-around py-[2px] flex-shrink-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)]">
                            <span className="w-1 h-1 rounded-full bg-themePeach/80 mx-auto"></span>
                          </div>
                        </div>
                      </div>

                      {/* Blinking satellite telemetry pixel */}
                      <span className="absolute top-1 right-1 w-1 h-1 bg-themeCoral rounded-full z-20 animate-ping"></span>
                    </div>
                  );
                }

                // Standard day element
                const isAfterToday = dayNum > 17;
                const activities = isAfterToday ? (ZOO_ACTIVITIES[dayNum] || []) : [];
                return (
                  <div 
                    key={`day-${dayNum}`}
                    onClick={() => {
                      if (isAfterToday) {
                        playChords(330);
                        setBookingDay(dayNum);
                        if (activities.length > 0) {
                          setTicketTier(activities[0].defaultTier);
                        } else {
                          setTicketTier('standard');
                        }
                        setTicketCount(1);
                        setVisitorName('');
                        setVisitorEmail('');
                        setIsBooked(false);
                      } else {
                        playOscillator(180, 'sine', 0.1, 0.05);
                      }
                    }}
                    className={`group border rounded-xl aspect-square select-none relative transition-all duration-300 flex flex-col items-center justify-between cursor-pointer p-1.5 overflow-hidden ${
                      isAfterToday 
                        ? 'bg-themeNavy/35 hover:bg-themeCoral/15 border-themeCoral/35 hover:border-themeCoral/80 shadow-md hover:shadow-[0_0_15px_rgba(238,119,82,0.15)] hover:scale-[1.05]' 
                        : 'bg-themeNavy/15 hover:bg-themeNavy/30 border-[#2a4585]/20'
                    }`}
                  >
                    {isToday ? (
                      <>
                        <span className="absolute inset-0 border border-emerald-500/80 rounded-xl"></span>
                        <div className="flex justify-between items-center w-full">
                          <span className="font-mono text-xs text-emerald-400 font-extrabold z-10">{dayNum}</span>
                          <span className="relative flex h-1.5 w-1.5 z-10">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                        </div>
                        <span className="text-[6.5px] text-emerald-400/70 tracking-widest uppercase font-mono mt-auto select-none leading-none z-10">TODAY</span>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start w-full">
                          <span className={`font-mono transition-colors ${isAfterToday ? 'text-xs text-themePeach/85 group-hover:text-themePeach font-bold' : 'text-xs text-white/35 group-hover:text-white/60 font-light'}`}>
                            {dayNum}
                          </span>
                          {isAfterToday && activities.length > 0 && (
                            <span className="flex gap-[2px] mt-0.5">
                              {activities.map((act, idx) => (
                                <span 
                                  key={idx} 
                                  className={`w-[4.5px] h-[4.5px] rounded-full ${
                                    act.defaultTier === 'vip' 
                                      ? 'bg-themeCoral animate-pulse' 
                                      : act.defaultTier === 'night' 
                                        ? 'bg-indigo-400' 
                                        : 'bg-teal-400'
                                  }`} 
                                />
                              ))}
                            </span>
                          )}
                        </div>
                        {isAfterToday && activities.length > 0 ? (
                          <div className="w-full flex flex-col gap-1 mt-auto select-none">
                            {activities.slice(0, 2).map((act, idx) => (
                              <div 
                                key={idx} 
                                className={`w-full flex items-center justify-between text-[6.5px] leading-tight px-1 py-0.5 rounded transition-all uppercase tracking-tight font-mono truncate border
                                  ${act.defaultTier === 'vip' 
                                    ? 'bg-themeCoral/10 text-themeCoral border-themeCoral/20' 
                                    : act.defaultTier === 'night' 
                                      ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' 
                                      : 'bg-teal-500/10 text-teal-300 border-teal-500/20'}`}
                              >
                                <span className="truncate flex-1 text-left">{act.title}</span>
                                {act.defaultTier === 'vip' && <span className="text-[5.5px] text-themeCoral/80 ml-1">★</span>}
                              </div>
                            ))}
                            {activities.length > 2 && (
                              <span className="text-[5.5px] text-white/40 text-right uppercase tracking-wider font-mono">
                                +{activities.length - 2} acts
                              </span>
                            )}
                          </div>
                        ) : isAfterToday ? (
                          <span className="text-[6.5px] text-white/20 uppercase tracking-widest font-mono mt-auto select-none pb-0.5 leading-none">
                            OPEN ENTRY
                          </span>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Global hover chat dialog card floating overlay */}
        <AnimatePresence>
          {hoveredDayBubble && (
            <motion.div 
              style={{
                position: 'absolute',
                left: `${hoveredDayBubble.x}px`,
                top: `${hoveredDayBubble.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none fixed z-40 bg-white border border-stone-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.18)] rounded-2xl p-4 w-64 text-neutral-800 text-xs text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: hoveredDayBubble.day.accentColor }}></span>
                <span className="font-mono text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: hoveredDayBubble.day.accentColor }}>
                  {hoveredDayBubble.day.role}
                </span>
                <span className="font-mono text-[9px] text-stone-500 ml-auto">May 2026 // Day {hoveredDayBubble.day.date}</span>
              </div>
              <p className="text-stone-700 text-xs font-medium leading-relaxed italic">
                &ldquo;{hoveredDayBubble.day.bubble}&rdquo;
              </p>
              {/* Small bottom triangle pin */}
              <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-stone-200 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Expandable Advent Morph Detail Modal Portal overlay */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backdropFilter: 'blur(30px)' }}
              className="fixed inset-0 z-50 bg-themeDarkBase/90 flex items-center justify-center p-4 md:p-10 overflow-hidden"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 140 }}
                className="max-w-6xl w-full h-[85vh] md:h-[75vh] glass-panel bg-themeNavy/25 rounded-[32px] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border border-themeCoral/20"
              >
                {/* Close handle button */}
                <button 
                  onClick={() => {
                    playOscillator(200, 'sawtooth', 0.25);
                    setSelectedDay(null);
                  }}
                  className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 border border-themeCoral/20 hover:bg-themeCoral/25 text-[#fdfaf5] hover:text-white flex items-center justify-center transition-all duration-300 z-50 group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Left side: Interactive 3D mechanical open door */}
                <div className="w-full md:w-1/2 h-[42%] md:h-full relative overflow-hidden bg-themeDarkBase/80 p-8 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-8 rounded-2xl overflow-hidden bg-themeDarkBase flex items-center justify-center border border-white/5">
                    
                    {/* Atmospheric focal glow */}
                    <div 
                      className="absolute inset-0 opacity-40 blur-[50px]"
                      style={{ backgroundColor: selectedDay.accentColor }}
                    />
                    
                    {/* Target animal portrait */}
                    <motion.img 
                      initial={{ scale: 1.15, opacity: 0 }}
                      animate={{ scale: 1.02, opacity: 0.95 }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                      src={selectedDay.imageUrl} 
                      alt={selectedDay.role} 
                      className="w-full h-full object-cover transition-all"
                    />
                  </div>

                  {/* 3D Swing mechanical portal covering layer */}
                  <div className="absolute inset-8 rounded-2xl overflow-hidden perspective-container pointer-events-none z-20 flex">
                    <div 
                      className="w-full h-full border-r border-[#ee7752]/30 flex items-center justify-between px-8 md:px-12 shadow-[5px_0_20px_rgba(0,0,0,0.65)] origin-left transition-all duration-1000 transform rotate-y-[105deg] opacity-15"
                      style={{ backgroundColor: '#1c305d' }}
                    >
                      <span className="font-mono text-5xl md:text-7xl font-black text-[#F8A282]/85 select-none">
                        {String(selectedDay.date).padStart(2, '0')}
                      </span>
                      <div className="w-8 h-16 border border-themeCoral/30 rounded-full bg-[#1c305d]/50 flex flex-col items-center justify-center gap-1">
                        <span className="w-2 h-2 rounded-full col-span-1 bg-themePeach"></span>
                        <span className="w-1.5 h-6 bg-[#213a6e] rounded-full"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Specimen parameters & play widgets container */}
                <div className="w-full md:w-1/2 bg-[#eceef4] text-themeNavy/95 p-6 md:p-12 flex flex-col justify-between overflow-y-auto">
                  <div className="text-left font-sans">
                    <div className="flex items-center gap-3 mb-4">
                      <span 
                        className="font-mono text-[10px] px-3 py-1 text-white rounded-full font-bold select-none"
                        style={{ backgroundColor: selectedDay.accentColor }}
                      >
                        {selectedDay.index}
                      </span>
                      <span className="font-mono text-[10px] font-black tracking-widest text-[#EE7752] uppercase">
                        Specimen {selectedDay.role}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-4xl font-serif font-black tracking-tight mb-4 text-[#1c305d]">
                      {selectedDay.title}
                    </h3>

                    {/* Dialog quote bubble section */}
                    <div className="relative bg-white border border-[#2a4585]/20 p-5 rounded-2xl mb-6 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                      <p className="text-stone-700 text-xs md:text-sm leading-relaxed font-semibold italic">
                        &ldquo;{selectedDay.bubble}&rdquo;
                      </p>
                    </div>

                    {/* Skill Bars rendering */}
                    <div className="space-y-3 mb-6">
                      <h4 className="text-[10px] font-mono tracking-widest text-themeCoral font-bold uppercase">PHYSICS & SPECIMEN VALUES</h4>
                      <div className="space-y-2">
                        {selectedDay.skills.map((skill, sIdx) => (
                          <div key={sIdx}>
                            <div className="flex justify-between text-[11px] font-bold mb-0.5">
                              <span className="text-stone-600">{skill.name}</span>
                              <span className="font-mono text-themeDarkBase">{skill.value}%</span>
                            </div>
                            <div className="w-full h-2 bg-stone-300/40 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.value}%` }}
                                transition={{ duration: 1.2, delay: 0.15 }}
                                className="h-full rounded-full bg-themeNavy"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Playable Interactive Bay */}
                  <div className="border-t border-stone-200 pt-5 mt-4 text-left">
                    <div className="flex items-center gap-2 mb-3 select-none">
                      <span className="w-2.5 h-2.5 bg-themeCoral rounded-full animate-pulse"></span>
                      <h4 className="text-[10px] font-mono font-bold tracking-widest text-themeCoral uppercase">INTERACTIVE BAY / PROCEDURAL SYNTH</h4>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#2a4585]/20 shadow-sm leading-normal">
                      
                      {/* Giraffe Height Stretcher widget */}
                      {selectedDay.widgetTemplate === 'giraffe' && (
                        <div>
                          <p className="text-[10px] text-stone-500 font-mono mb-2">GIRAFFE STRETCH SIMULATOR:</p>
                          <div className="bg-stone-900 p-4 rounded-xl text-yellow-500 font-mono mb-3 leading-tight min-h-[50px] flex flex-col justify-center items-center">
                            <span className="text-[9px] text-stone-400 font-light select-none">Procedural Height:</span>
                            <span className="text-xl md:text-2xl font-black mt-1">{giraffeHeight.toFixed(1)} meters</span>
                          </div>
                          <button 
                            onClick={() => {
                              setGiraffeHeight(prev => {
                                const next = prev >= 8.4 ? 5.5 : prev + 0.3;
                                playOscillator(160 + (next * 45), 'triangle', 0.25, 0.08);
                                return next;
                              });
                            }}
                            className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white py-2 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 text-xs text-center"
                          >
                            <ArrowUp className="w-3.5 h-3.5" /> Stretch Neck
                          </button>
                        </div>
                      )}

                      {/* Polar bear slider widget */}
                      {selectedDay.widgetTemplate === 'polar_bear' && (
                        <div>
                          <p className="text-[10px] text-stone-500 font-mono mb-2">ICEBERG RESONANCE SIMULATOR:</p>
                          <p className="text-[11px] text-stone-400 mb-3">Slide to resonance through arctic ocean bands:</p>
                          <div className="space-y-3">
                            <input 
                              type="range" 
                              min="40" 
                              max="150" 
                              value={bearFrequency}
                              onChange={(e) => {
                                const freq = Number(e.target.value);
                                setBearFrequency(freq);
                                playOscillator(freq, 'triangle', 0.15, 0.07);
                              }}
                              className="w-full accent-[#06B6D4] cursor-pointer" 
                            />
                            <div className="flex justify-between items-center bg-stone-900 px-3 py-1.5 text-xs text-[#06b6d4] font-mono rounded">
                              <span>OCEAN BAND:</span>
                              <span className="font-bold">{bearFrequency} Hz</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Penguin Keyboard chord widget */}
                      {selectedDay.widgetTemplate === 'penguin' && (
                        <div>
                          <p className="text-[10px] text-stone-500 font-mono mb-2">PENGUIN NOTES (C-D-E-F KEYS):</p>
                          <p className="text-[11px] text-stone-400 mb-3">Click key blocks to play icy procedural scale pitches:</p>
                          <div className="grid grid-cols-4 gap-2">
                            <button 
                              onClick={() => playOscillator(261.63, 'sine', 0.4, 0.09)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-xs rounded-xl font-bold active:scale-[0.95]"
                            >
                              Do (C4)
                            </button>
                            <button 
                              onClick={() => playOscillator(293.66, 'sine', 0.4, 0.09)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-xs rounded-xl font-bold active:scale-[0.95]"
                            >
                              Re (D4)
                            </button>
                            <button 
                              onClick={() => playOscillator(329.63, 'sine', 0.4, 0.09)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-xs rounded-xl font-bold active:scale-[0.95]"
                            >
                              Mi (E4)
                            </button>
                            <button 
                              onClick={() => playOscillator(349.23, 'sine', 0.4, 0.09)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-xs rounded-xl font-bold active:scale-[0.95]"
                            >
                              Fa (F4)
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Lion roar decibel indicator and gauge widget */}
                      {selectedDay.widgetTemplate === 'lion' && (
                        <div>
                          <p className="text-[10px] text-stone-500 font-mono mb-2">ROAR RESONANCE GAUGING:</p>
                          <div className="flex items-center justify-between mb-3 bg-stone-900 text-stone-300 p-2.5 rounded-xl font-mono">
                            <span className="text-xs">Dynamic Level: <b className="text-amber-500 text-sm">{lionDecibel} dBA</b></span>
                            <span className="text-[9px] text-[#213a6e] font-black uppercase text-center">{lionStatus}</span>
                          </div>
                          <button 
                            onClick={() => {
                              setLionDecibel(120);
                              setLionStatus("Regal Sound! Area Roar 🦁");
                              playOscillator(160, 'sawtooth', 0.45, 0.1);
                              setTimeout(() => playOscillator(240, 'sawtooth', 0.4, 0.07), 100);
                            }}
                            className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.95] text-white py-2 px-4 rounded-lg font-bold text-xs"
                          >
                            🦁 ROAR TILL GROUND SHAKES!
                          </button>
                        </div>
                      )}

                      {/* Seal feeding widget */}
                      {selectedDay.widgetTemplate === 'seal' && (
                        <div>
                          <p className="text-[10px] text-stone-500 font-mono mb-2">SEAL TREAT LOADER:</p>
                          <div className="flex items-center justify-between mb-3 bg-stone-900 text-stone-300 p-2.5 rounded-xl font-mono">
                            <span className="text-xs">Tasty Fish Loaded: <b className="text-teal-400">{sealFishCount}</b> pieces</span>
                            <span className="text-[9px] text-teal-400 font-bold">{sealFishCount >= 8 ? 'STUFFED 🐟' : 'HUNGRY 🐟'}</span>
                          </div>
                          <button 
                            disabled={sealFishCount >= 8}
                            onClick={() => {
                              setSealFishCount(prev => prev + 1);
                              playOscillator(520, 'sine', 0.1, 0.04);
                              setTimeout(() => playOscillator(780, 'sine', 0.1, 0.05), 45);
                            }}
                            className={`w-full py-2 px-4 rounded-lg font-bold text-xs text-white ${sealFishCount >= 8 ? 'bg-stone-500 opacity-60 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98]'}`}
                          >
                            {sealFishCount >= 8 ? 'Seal is completely full!' : 'Feed a delicious fish'}
                          </button>
                        </div>
                      )}

                      {/* Monkey pendulum gym slider widget */}
                      {selectedDay.widgetTemplate === 'monkey' && (
                        <div>
                          <p className="text-[10px] text-stone-500 font-mono mb-2">MONKEY PENDULUM SIMULATOR:</p>
                          <p className="text-[11px] text-stone-400 mb-2">Adjust tree-swing angles to modulate dynamic gymnastics:</p>
                          <div className="space-y-3">
                            <input 
                              type="range" 
                              min="-90" 
                              max="90" 
                              value={monkeyAngle}
                              onChange={(e) => {
                                const angleValue = Number(e.target.value);
                                setMonkeyAngle(angleValue);
                                playOscillator(200 + Math.abs(angleValue) * 3.5, 'sine', 0.12, 0.06);
                              }}
                              className="w-full accent-orange-500 cursor-pointer" 
                            />
                            <div className="flex justify-between items-center bg-stone-900 px-3 py-1.5 text-xs text-orange-400 font-mono rounded">
                              <span>ANGLE:</span>
                              <span className="font-bold">{monkeyAngle}°</span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. Interactive Blueprint & Climate Control Map (ZOO MAP) */}
      <section id="map" className="relative min-h-screen w-full flex flex-col justify-center items-center py-24 px-4 md:px-12 bg-themeDarkBase border-b border-themeCoral/10 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 grid-blueprint opacity-40 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl mx-auto flex flex-col gap-8 relative z-10"
        >
          
          {/* Header Title Grid */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-themeCoral/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#f8a282] uppercase font-bold">BIOSPHERE REAL-TIME TELEMETRY</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-black text-white leading-none uppercase">SANCTUARY BLUEPRINT</h2>
              <p className="text-xs text-white/40 tracking-widest uppercase mt-2">Interactive mapping, thermodynamic diagnostics & specimen tracking</p>
            </div>

            {/* Layer Control Tabs */}
            <div className="flex items-center gap-2 bg-themeNavy/40 p-1 rounded-full border border-themeCoral/20 glass-panel scrollbar-none overflow-x-auto max-w-full">
              <button
                onClick={() => {
                  setMapLayer('illustrated');
                  playOscillator(392, 'sine', 0.1, 0.05);
                }}
                className={`px-4 py-1.5 rounded-full text-[9px] font-mono tracking-widest uppercase transition-all whitespace-nowrap ${mapLayer === 'illustrated' ? 'bg-[#ee7752] text-themeDarkBase font-black' : 'text-white/60 hover:text-white'}`}
              >
                🗺 ILLUSTRATED
              </button>
              <button
                onClick={() => {
                  setMapLayer('blueprint');
                  playOscillator(440, 'sine', 0.1, 0.05);
                }}
                className={`px-4 py-1.5 rounded-full text-[9px] font-mono tracking-widest uppercase transition-all whitespace-nowrap ${mapLayer === 'blueprint' ? 'bg-[#ee7752] text-themeDarkBase font-black' : 'text-white/60 hover:text-white'}`}
              >
                🛠 ARCHITECTURAL
              </button>
              <button
                onClick={() => {
                  setMapLayer('thermal');
                  playOscillator(554.37, 'sine', 0.1, 0.05);
                }}
                className={`px-4 py-1.5 rounded-full text-[9px] font-mono tracking-widest uppercase transition-all whitespace-nowrap ${mapLayer === 'thermal' ? 'bg-[#ee7752] text-themeDarkBase font-black' : 'text-white/60 hover:text-white'}`}
              >
                🔥 THERMAL HEATMAP
              </button>
              <button
                onClick={() => {
                  setMapLayer('telemetry');
                  playOscillator(659.25, 'sine', 0.1, 0.05);
                }}
                className={`px-4 py-1.5 rounded-full text-[9px] font-mono tracking-widest uppercase transition-all whitespace-nowrap ${mapLayer === 'telemetry' ? 'bg-[#ee7752] text-themeDarkBase font-black' : 'text-white/60 hover:text-white'}`}
              >
                📡 ANIMAL RADAR
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left/Top Area: Interactive SVG Map Canvas (takes 7 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              <div id="map-frame" className="relative glass-panel rounded-3xl p-4 md:p-6 border border-themeCoral/25 overflow-hidden flex flex-col items-center justify-center bg-[#1c305d]/15 shadow-[0_0_50px_rgba(238,119,82,0.03)] aspect-[8/5] w-full select-none">
                
                {/* HUD Coordinates overlays */}
                <span className="absolute top-4 left-4 font-mono text-[8px] text-white/20 select-none">GRID REF: ZOE-SNC-3000</span>
                <span className="absolute top-4 right-4 font-mono text-[8px] text-white/20 select-none">SYSTEM STATUS: FULLY ONLINE</span>
                <span className="absolute bottom-4 left-4 font-mono text-[8px] text-emerald-500/60 select-none tracking-widest">● SCANNING... 24.2HZ</span>
                
                {/* Dynamic Mist fogger cloud overlays */}
                {Object.keys(mistActive).some(key => mistActive[key]) && (
                  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-screen opacity-40">
                    <div className="absolute inset-x-0 bottom-0 top-1/4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/25 via-white/5 to-transparent blur-3xl animate-pulse" />
                    <div className="absolute w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl top-1/3 left-1/4 animate-bounce" style={{ animationDuration: '12s' }} />
                    <div className="absolute w-[250px] h-[250px] bg-white/10 rounded-full blur-3xl bottom-1/4 right-1/4 animate-bounce" style={{ animationDuration: '9s' }} />
                  </div>
                )}

                {/* SVG Visual Polygon Layout Map */}
                <svg viewBox="0 0 800 500" className="w-full h-full relative z-10 select-none pointer-events-auto">
                  <defs>
                    <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ee7752" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ee7752" stopOpacity="0" />
                    </radialGradient>
                    {/* Thermal color shifts for heatmap layer */}
                    <linearGradient id="polar-temp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={zoneTemps.polar <= 0 ? "#06B6D4" : "#10B981"} />
                      <stop offset="100%" stopColor={zoneTemps.polar <= -10 ? "#1E3A8A" : "#3B82F6"} stopOpacity="0.65" />
                    </linearGradient>
                    <linearGradient id="savannah-temp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={zoneTemps.savannah >= 26 ? "#F59E0B" : "#10B981"} />
                      <stop offset="100%" stopColor={zoneTemps.savannah >= 32 ? "#EF4444" : "#F59E0B"} stopOpacity="0.65" />
                    </linearGradient>
                    <linearGradient id="oceanic-temp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={zoneTemps.oceanic <= 15 ? "#0284C7" : "#059669"} />
                      <stop offset="100%" stopColor={zoneTemps.oceanic >= 24 ? "#6366F1" : "#1E40AF"} stopOpacity="0.65" />
                    </linearGradient>
                    <linearGradient id="primate-temp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={zoneTemps.primate >= 24 ? "#10B981" : "#0284C7"} />
                      <stop offset="100%" stopColor={zoneTemps.primate >= 28 ? "#D97706" : "#064E3B"} stopOpacity="0.65" />
                    </linearGradient>
                    <linearGradient id="nocturnal-temp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={zoneTemps.nocturnal <= 12 ? "#4F46E5" : "#10B981"} />
                      <stop offset="100%" stopColor={zoneTemps.nocturnal >= 18 ? "#8B5CF6" : "#312E81"} stopOpacity="0.65" />
                    </linearGradient>
                  </defs>

                  {/* Illustrated Map Background Asset (ZOO MAP) */}
                  {mapLayer === 'illustrated' && (
                    <image 
                      href={zoeZooIllustratedMap} 
                      x="0" 
                      y="0" 
                      width="800" 
                      height="500" 
                      preserveAspectRatio="none"
                      className="pointer-events-none rounded-2xl transition-all duration-[700ms]"
                      style={{ 
                        filter: 'brightness(0.65) contrast(1.2) saturate(0.7) sepia(0.2) hue-rotate(340deg)'
                      }}
                    />
                  )}

                  {/* Grid Lines Overlay representing coordinates */}
                  <g opacity={mapLayer === 'illustrated' ? "0.03" : "0.15"} stroke="#f8a282" strokeWidth="0.5">
                    <line x1="100" y1="0" x2="100" y2="500" strokeDasharray="3,3" />
                    <line x1="200" y1="0" x2="200" y2="500" strokeDasharray="3,3" />
                    <line x1="300" y1="0" x2="300" y2="500" strokeDasharray="3,3" />
                    <line x1="400" y1="0" x2="400" y2="500" strokeDasharray="3,3" />
                    <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="3,3" />
                    <line x1="600" y1="0" x2="600" y2="500" strokeDasharray="3,3" />
                    <line x1="700" y1="0" x2="700" y2="500" strokeDasharray="3,3" />
                    <line x1="0" y1="100" x2="800" y2="100" strokeDasharray="3,3" />
                    <line x1="0" y1="200" x2="800" y2="200" strokeDasharray="3,3" />
                    <line x1="0" y1="300" x2="800" y2="300" strokeDasharray="3,3" />
                    <line x1="0" y1="400" x2="800" y2="400" strokeDasharray="3,3" />
                  </g>

                  {/* Dynamic Radar Sweep when Telemetry Active */}
                  {mapLayer === 'telemetry' && (
                    <circle cx="400" cy="250" r="230" fill="none" stroke="#ee7752" strokeWidth="0.75" strokeDasharray="5, 10" className="animate-spin" style={{ transformOrigin: '400px 250px', animationDuration: '10s' }} />
                  )}

                  {/* Zone 1: Polar Dome */}
                  <g 
                    onClick={() => {
                      setSelectedMapZone('polar');
                      playOscillator(130.81, 'triangle', 0.25, 0.05); // low C
                    }}
                    className="cursor-pointer group"
                  >
                    <polygon 
                      points="120,80 320,80 370,190 270,300 110,190" 
                      fill={mapLayer === 'thermal' ? 'url(#polar-temp-grad)' : mapLayer === 'illustrated' ? (selectedMapZone === 'polar' ? 'rgba(238, 119, 82, 0.12)' : 'rgba(0,0,0,0)') : (selectedMapZone === 'polar' ? 'rgba(238, 119, 82, 0.15)' : '#0e172e')} 
                      fillOpacity={mapLayer === 'thermal' ? '0.75' : mapLayer === 'illustrated' ? '1' : selectedMapZone === 'polar' ? '0.6' : '0.25'} 
                      stroke={selectedMapZone === 'polar' ? '#ee7752' : (mapLayer === 'illustrated' ? 'rgba(238, 119, 82, 0.2)' : 'rgba(255,255,255,0.12)')} 
                      strokeWidth={selectedMapZone === 'polar' ? '3' : '1'} 
                      className="transition-all duration-500 ease-out hover:fill-opacity-50"
                    />
                    <text x="210" y="160" fill="white" fillOpacity={selectedMapZone === 'polar' ? '1' : '0.6'} stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke" className="font-mono text-[10px] font-bold tracking-widest text-center select-none pointer-events-none">POLAR DOME</text>
                    <text x="210" y="175" fill="#f8a282" fillOpacity={selectedMapZone === 'polar' ? '1' : '0.4'} stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke" className="font-sans text-[7px] tracking-wider text-center select-none pointer-events-none uppercase">TEMP: {zoneTemps.polar}°C</text>
                    {/* Floating Mist Indicators */}
                    {mistActive.polar && <circle cx="210" cy="120" r="15" fill="white" className="animate-ping opacity-10 pointer-events-none" />}
                  </g>

                  {/* Zone 2: Savannah Sun-Canopy */}
                  <g 
                    onClick={() => {
                      setSelectedMapZone('savannah');
                      playOscillator(220, 'sine', 0.2, 0.05);
                    }}
                    className="cursor-pointer group"
                  >
                    <polygon 
                      points="450,70 680,70 710,180 580,280 430,220" 
                      fill={mapLayer === 'thermal' ? 'url(#savannah-temp-grad)' : mapLayer === 'illustrated' ? (selectedMapZone === 'savannah' ? 'rgba(238, 119, 82, 0.12)' : 'rgba(0,0,0,0)') : (selectedMapZone === 'savannah' ? 'rgba(238, 119, 82, 0.15)' : '#0e172e')} 
                      fillOpacity={mapLayer === 'thermal' ? '0.75' : mapLayer === 'illustrated' ? '1' : selectedMapZone === 'savannah' ? '0.5' : '0.25'} 
                      stroke={selectedMapZone === 'savannah' ? '#ee7752' : (mapLayer === 'illustrated' ? 'rgba(238, 119, 82, 0.2)' : 'rgba(255,255,255,0.12)')} 
                      strokeWidth={selectedMapZone === 'savannah' ? '3' : '1'} 
                      className="transition-all duration-500 ease-out hover:fill-opacity-50"
                    />
                    <text x="560" y="150" fill="white" fillOpacity={selectedMapZone === 'savannah' ? '1' : '0.6'} stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke" className="font-mono text-[10px] font-bold tracking-widest text-center select-none pointer-events-none">SAVANNAH CAP</text>
                    <text x="560" y="165" fill="#f8a282" fillOpacity={selectedMapZone === 'savannah' ? '1' : '0.4'} stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke" className="font-sans text-[7px] tracking-wider text-center select-none pointer-events-none uppercase">TEMP: {zoneTemps.savannah}°C</text>
                    {mistActive.savannah && <circle cx="560" cy="110" r="15" fill="white" className="animate-ping opacity-10 pointer-events-none" />}
                  </g>

                  {/* Zone 3: Deep Oceanic Trench */}
                  <g 
                    onClick={() => {
                      setSelectedMapZone('oceanic');
                      playOscillator(146.83, 'triangle', 0.2, 0.05);
                    }}
                    className="cursor-pointer group"
                  >
                    <polygon 
                      points="120,330 380,310 420,460 160,460" 
                      fill={mapLayer === 'thermal' ? 'url(#oceanic-temp-grad)' : mapLayer === 'illustrated' ? (selectedMapZone === 'oceanic' ? 'rgba(238, 119, 82, 0.12)' : 'rgba(0,0,0,0)') : (selectedMapZone === 'oceanic' ? 'rgba(238, 119, 82, 0.15)' : '#0e172e')} 
                      fillOpacity={mapLayer === 'thermal' ? '0.75' : mapLayer === 'illustrated' ? '1' : selectedMapZone === 'oceanic' ? '0.5' : '0.25'} 
                      stroke={selectedMapZone === 'oceanic' ? '#ee7752' : (mapLayer === 'illustrated' ? 'rgba(238, 119, 82, 0.2)' : 'rgba(255,255,255,0.12)')} 
                      strokeWidth={selectedMapZone === 'oceanic' ? '3' : '1'} 
                      className="transition-all duration-500 ease-out hover:fill-opacity-50"
                    />
                    <text x="270" y="390" fill="white" fillOpacity={selectedMapZone === 'oceanic' ? '1' : '0.6'} stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke" className="font-mono text-[10px] font-bold tracking-widest text-center select-none pointer-events-none">OCEANIC DEEP</text>
                    <text x="270" y="405" fill="#f8a282" fillOpacity={selectedMapZone === 'oceanic' ? '1' : '0.4'} stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke" className="font-sans text-[7px] tracking-wider text-center select-none pointer-events-none uppercase">TEMP: {zoneTemps.oceanic}°C</text>
                    {mistActive.oceanic && <circle cx="270" cy="350" r="15" fill="white" className="animate-ping opacity-10 pointer-events-none" />}
                  </g>

                  {/* Zone 4: Primate Forest Canopy */}
                  <g 
                    onClick={() => {
                      setSelectedMapZone('primate');
                      playOscillator(261.63, 'sine', 0.2, 0.05);
                    }}
                    className="cursor-pointer group"
                  >
                    <polygon 
                      points="460,300 680,280 720,440 500,440" 
                      fill={mapLayer === 'thermal' ? 'url(#primate-temp-grad)' : mapLayer === 'illustrated' ? (selectedMapZone === 'primate' ? 'rgba(238, 119, 82, 0.12)' : 'rgba(0,0,0,0)') : (selectedMapZone === 'primate' ? 'rgba(238, 119, 82, 0.15)' : '#0e172e')} 
                      fillOpacity={mapLayer === 'thermal' ? '0.75' : mapLayer === 'illustrated' ? '1' : selectedMapZone === 'primate' ? '0.5' : '0.25'} 
                      stroke={selectedMapZone === 'primate' ? '#ee7752' : (mapLayer === 'illustrated' ? 'rgba(238, 119, 82, 0.2)' : 'rgba(255,255,255,0.12)')} 
                      strokeWidth={selectedMapZone === 'primate' ? '3' : '1'} 
                      className="transition-all duration-500 ease-out hover:fill-opacity-50"
                    />
                    <text x="590" y="370" fill="white" fillOpacity={selectedMapZone === 'primate' ? '1' : '0.6'} stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke" className="font-mono text-[10px] font-bold tracking-widest text-center select-none pointer-events-none">PRIMATE CANOPY</text>
                    <text x="590" y="385" fill="#f8a282" fillOpacity={selectedMapZone === 'primate' ? '1' : '0.4'} stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke" className="font-sans text-[7px] tracking-wider text-center select-none pointer-events-none uppercase">TEMP: {zoneTemps.primate}°C</text>
                    {mistActive.primate && <circle cx="590" cy="330" r="15" fill="white" className="animate-ping opacity-10 pointer-events-none" />}
                  </g>

                  {/* Zone 5: Nocturnal Vale */}
                  <g 
                    onClick={() => {
                      setSelectedMapZone('nocturnal');
                      playOscillator(110, 'triangle', 0.3, 0.06);
                    }}
                    className="cursor-pointer group"
                  >
                    <polygon 
                      points="370,195 445,195 425,285 350,285" 
                      fill={mapLayer === 'thermal' ? 'url(#nocturnal-temp-grad)' : mapLayer === 'illustrated' ? (selectedMapZone === 'nocturnal' ? 'rgba(238, 119, 82, 0.12)' : 'rgba(0,0,0,0)') : (selectedMapZone === 'nocturnal' ? 'rgba(238, 119, 82, 0.15)' : '#0e172e')} 
                      fillOpacity={mapLayer === 'thermal' ? '0.75' : mapLayer === 'illustrated' ? '1' : selectedMapZone === 'nocturnal' ? '0.6' : '0.25'} 
                      stroke={selectedMapZone === 'nocturnal' ? '#ee7752' : (mapLayer === 'illustrated' ? 'rgba(238, 119, 82, 0.2)' : 'rgba(255,255,255,0.12)')} 
                      strokeWidth={selectedMapZone === 'nocturnal' ? '3' : '1'} 
                      className="transition-all duration-500 ease-out hover:fill-opacity-50"
                    />
                    <text x="398" y="240" fill="white" fillOpacity={selectedMapZone === 'nocturnal' ? '1' : '0.6'} stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" paintOrder="stroke" className="font-mono text-[8px] font-black tracking-widest text-center select-none pointer-events-none">NOCTURNAL</text>
                    {mistActive.nocturnal && <circle cx="398" cy="225" r="10" fill="white" className="animate-ping opacity-10 pointer-events-none" />}
                  </g>

                  {/* Active Radar Pulses Representing Telemetry Locators */}
                  {(mapLayer === 'telemetry' || mapLayer === 'illustrated') && (
                    <>
                      {/* Polar bear tracker */}
                      <g className="cursor-pointer" onClick={() => setSelectedMapZone('polar')}>
                        <circle cx="250" cy="150" r="18" fill="url(#radar-glow)" stroke="#ee7752" strokeWidth="0.5" className="animate-pulse" />
                        <circle cx="250" cy="150" r="3.5" fill="#ee7752" />
                        <text x="250" y="135" fill="white" className="font-mono text-[6.5px] font-black text-center text-outline uppercase select-none pointer-events-none">L-01 [POLAR]</text>
                      </g>

                      {/* Penguin tracker */}
                      <g className="cursor-pointer" onClick={() => setSelectedMapZone('polar')}>
                        <circle cx="160" cy="220" r="14" fill="url(#radar-glow)" stroke="#ee7752" strokeWidth="0.5" className="animate-pulse" />
                        <circle cx="160" cy="220" r="3" fill="#ee7752" />
                        <text x="160" y="208" fill="white" className="font-mono text-[6.5px] font-black text-center text-outline uppercase select-none pointer-events-none">L-02 [PENGUIN]</text>
                      </g>

                      {/* Giraffe tracker */}
                      <g className="cursor-pointer" onClick={() => setSelectedMapZone('savannah')}>
                        <circle cx="620" cy="110" r="18" fill="url(#radar-glow)" stroke="#ee7752" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '1s' }} />
                        <circle cx="620" cy="110" r="3.5" fill="#ee7752" />
                        <text x="620" y="95" fill="white" className="font-mono text-[6.5px] font-black text-center text-outline uppercase select-none pointer-events-none">G-01 [GIRAFFE]</text>
                      </g>

                      {/* Lion tracker */}
                      <g className="cursor-pointer" onClick={() => setSelectedMapZone('savannah')}>
                        <circle cx="520" cy="200" r="16" fill="url(#radar-glow)" stroke="#ee7752" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <circle cx="520" cy="200" r="3.5" fill="#ee7752" />
                        <text x="520" y="185" fill="white" className="font-mono text-[6.5px] font-black text-center text-outline uppercase select-none pointer-events-none">L-03 [LION]</text>
                      </g>

                      {/* Manta tracker */}
                      <g className="cursor-pointer" onClick={() => setSelectedMapZone('oceanic')}>
                        <circle cx="340" cy="380" r="18" fill="url(#radar-glow)" stroke="#ee7752" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                        <circle cx="340" cy="380" r="3.5" fill="#ee7752" />
                        <text x="340" y="365" fill="white" className="font-mono text-[6.5px] font-black text-center text-outline uppercase select-none pointer-events-none">M-01 [MANTA]</text>
                      </g>

                      {/* Seal tracker */}
                      <g className="cursor-pointer" onClick={() => setSelectedMapZone('oceanic')}>
                        <circle cx="210" cy="420" r="16" fill="url(#radar-glow)" stroke="#ee7752" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
                        <circle cx="210" cy="420" r="3" fill="#ee7752" />
                        <text x="210" y="408" fill="white" className="font-mono text-[6.5px] font-black text-center text-outline uppercase select-none pointer-events-none">S-01 [SEAL]</text>
                      </g>

                      {/* Monkey tracker */}
                      <g className="cursor-pointer" onClick={() => setSelectedMapZone('primate')}>
                        <circle cx="580" cy="350" r="18" fill="url(#radar-glow)" stroke="#ee7752" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
                        <circle cx="580" cy="350" r="3.5" fill="#ee7752" />
                        <text x="580" y="335" fill="white" className="font-mono text-[6.5px] font-black text-center text-outline uppercase select-none pointer-events-none">C-01 [MONKEY]</text>
                      </g>

                      {/* Snow Leopard tracker */}
                      <g className="cursor-pointer" onClick={() => setSelectedMapZone('nocturnal')}>
                        <circle cx="395" cy="245" r="15" fill="url(#radar-glow)" stroke="#ee7752" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                        <circle cx="395" cy="245" r="3.5" fill="#ee7752" />
                        <text x="395" y="232" fill="white" className="font-mono text-[6.5px] font-black text-center text-outline uppercase select-none pointer-events-none">T-01 [LEOPARD]</text>
                      </g>
                    </>
                  )}
                </svg>
              </div>

              {/* Responsive Quick Map legends */}
              <div className="flex justify-between items-center bg-themeNavy/20 px-4 py-2.5 rounded-xl border border-themeCoral/10 text-[8px] font-mono uppercase tracking-wider text-white/50 select-none">
                <span>[CLIKING DOMES TO SWITCH CHANNELS]</span>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-themeCoral rounded-full"></span>SELECTED Dome</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>COOP CORES</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Side HUD Control Panel (takes 5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 glass-panel border border-themeCoral/20 rounded-3xl p-6 flex flex-col gap-5 bg-gradient-to-b from-[#1c305d]/30 to-[#0e182e]/50 text-left">
              
              {/* Biome Identification Header */}
              {selectedMapZone === 'polar' && (
                <>
                  <div className="flex justify-between items-start pb-4 border-b border-themeCoral/15">
                    <div>
                      <span className="text-[8px] font-mono text-cyan-400 tracking-widest uppercase font-bold">ZONE REFS // P-01</span>
                      <h3 className="font-serif text-2xl font-black text-white mt-1 uppercase leading-none">POLAR DOME</h3>
                      <p className="text-[9px] text-[#f8a282]/80 mt-1 uppercase tracking-tight">Cryosphere Eco-Sanctuary</p>
                    </div>
                    <span className="bg-cyan-500/10 text-cyan-300 font-mono text-[8px] font-bold px-2 py-1 rounded border border-cyan-500/20 uppercase tracking-widest leading-none">SUB-ZERO</span>
                  </div>

                  {/* Climate stats reads */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">ACUTE TEMPERATURE</span>
                      <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">{zoneTemps.polar}°C</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">RELATIVE HUMIDITY</span>
                      <span className="text-xl font-bold font-mono text-[#f8a282] mt-1 block">{zoneHumidity.polar}%</span>
                    </div>
                  </div>

                  {/* Residents Data */}
                  <div className="space-y-2">
                    <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-widest font-black block">LIVE ANIMAL TELEMETRY</span>
                    <div className="bg-stone-900/50 p-3 rounded-2xl border border-themeCoral/5 space-y-3">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src="https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=120&q=80" 
                          alt="Augustus" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-cyan-500/20 shadow-inner flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-white truncate">AUGUSTUS [POLAR]</span>
                            <span className="text-emerald-400 animate-pulse text-[8px] font-normal leading-none">● ON</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-[7.5px] font-mono text-white/50">
                            <span>AGE: 11Y</span>
                            <span>HRT: 58</span>
                            <span className="text-right text-themePeach truncate">SWIMMING</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex items-center gap-3.5">
                        <img 
                          src="/src/assets/images/king_penguin_1781268727298.jpg" 
                          alt="Barnaby" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-cyan-500/20 shadow-inner flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-white truncate">BARNABY [PENGUIN]</span>
                            <span className="text-emerald-400 animate-pulse text-[8px] font-normal leading-none font-sans">● ON</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-[7.5px] font-mono text-white/50">
                            <span>AGE: 4Y</span>
                            <span>HRT: 88</span>
                            <span className="text-right text-themePeach truncate">SLIDING</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedMapZone === 'savannah' && (
                <>
                  <div className="flex justify-between items-start pb-4 border-b border-themeCoral/15">
                    <div>
                      <span className="text-[8px] font-mono text-amber-400 tracking-widest uppercase font-bold">ZONE REFS // S-02</span>
                      <h3 className="font-serif text-2xl font-black text-white mt-1 uppercase leading-none">SAVANNAH CAP</h3>
                      <p className="text-[9px] text-[#f8a282]/80 mt-1 uppercase tracking-tight font-sans">Arid Climate canopy</p>
                    </div>
                    <span className="bg-amber-500/10 text-amber-300 font-mono text-[8px] font-bold px-2 py-1 rounded border border-amber-500/20 uppercase tracking-widest leading-none">WARM ARID</span>
                  </div>

                  {/* Climate stats reads */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">ACUTE TEMPERATURE</span>
                      <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">{zoneTemps.savannah}°C</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">RELATIVE HUMIDITY</span>
                      <span className="text-xl font-bold font-mono text-[#f8a282] mt-1 block">{zoneHumidity.savannah}%</span>
                    </div>
                  </div>

                  {/* Residents Data */}
                  <div className="space-y-2">
                    <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-widest font-black block">LIVE ANIMAL TELEMETRY</span>
                    <div className="bg-stone-900/50 p-3 rounded-2xl border border-themeCoral/5 space-y-3">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src="https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=120&q=80" 
                          alt="Zara" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-amber-500/20 shadow-inner flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-white truncate">ZARA [GIRAFFE]</span>
                            <span className="text-emerald-400 animate-pulse text-[8px] font-normal leading-none">● ON</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-[7.5px] font-mono text-white/50">
                            <span>AGE: 7Y</span>
                            <span>HRT: 45</span>
                            <span className="text-right text-themePeach truncate">GRAZING</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex items-center gap-3.5">
                        <img 
                          src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=120&q=80" 
                          alt="Kaiser" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-amber-500/20 shadow-inner flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-white truncate">KAISER [LION]</span>
                            <span className="text-emerald-400 animate-pulse text-[8px] font-normal leading-none">● ON</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-[7.5px] font-mono text-white/50">
                            <span>AGE: 9Y</span>
                            <span>HRT: 62</span>
                            <span className="text-right text-themePeach truncate">RESTING</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedMapZone === 'oceanic' && (
                <>
                  <div className="flex justify-between items-start pb-4 border-b border-themeCoral/15">
                    <div>
                      <span className="text-[8px] font-mono text-indigo-400 tracking-widest uppercase font-bold">ZONE REFS // O-03</span>
                      <h3 className="font-serif text-2xl font-black text-white mt-1 uppercase leading-none">OCEANIC TRENCH</h3>
                      <p className="text-[9px] text-[#f8a282]/80 mt-1 uppercase tracking-tight font-sans">Deep Water Bio-basin</p>
                    </div>
                    <span className="bg-indigo-500/10 text-indigo-300 font-mono text-[8px] font-bold px-2 py-1 rounded border border-indigo-500/20 uppercase tracking-widest leading-none">HYPER-AQUATIC</span>
                  </div>

                  {/* Climate stats reads */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">ACUTE TEMPERATURE</span>
                      <span className="text-xl font-bold font-mono text-indigo-400 mt-1 block">{zoneTemps.oceanic}°C</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">RELATIVE HUMIDITY</span>
                      <span className="text-xl font-bold font-mono text-[#f8a282] mt-1 block">{zoneHumidity.oceanic}%</span>
                    </div>
                  </div>

                  {/* Residents Data */}
                  <div className="space-y-2">
                    <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-widest font-black block">LIVE ANIMAL TELEMETRY</span>
                    <div className="bg-stone-900/50 p-3 rounded-2xl border border-themeCoral/5 space-y-3">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=120&q=80" 
                          alt="Milo" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-indigo-500/20 shadow-inner flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-white truncate">MILO [GIANT MANTA]</span>
                            <span className="text-emerald-400 animate-pulse text-[8px] font-normal leading-none font-sans">● ON</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-[7.5px] font-mono text-white/50">
                            <span>AGE: 14Y</span>
                            <span>HRT: 40</span>
                            <span className="text-right text-themePeach truncate">GLIDING</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex items-center gap-3.5">
                        <img 
                          src="https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=120&q=80" 
                          alt="Sylvia" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-indigo-500/20 shadow-inner flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-white truncate">SYLVIA [SEAL]</span>
                            <span className="text-emerald-400 animate-pulse text-[8px] font-normal leading-none">● ON</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-[7.5px] font-mono text-white/50">
                            <span>AGE: 6Y</span>
                            <span>HRT: 72</span>
                            <span className="text-right text-themePeach truncate">PLAYING</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedMapZone === 'primate' && (
                <>
                  <div className="flex justify-between items-start pb-4 border-b border-themeCoral/15">
                    <div>
                      <span className="text-[8px] font-mono text-teal-400 tracking-widest uppercase font-bold">ZONE REFS // P-04</span>
                      <h3 className="font-serif text-2xl font-black text-white mt-1 uppercase leading-none">PRIMATE CANOPY</h3>
                      <p className="text-[9px] text-[#f8a282]/80 mt-1 uppercase tracking-tight font-sans">High-altitude Rainforest Corridor</p>
                    </div>
                    <span className="bg-teal-500/10 text-teal-300 font-mono text-[8px] font-bold px-2 py-1 rounded border border-teal-500/20 uppercase tracking-widest leading-none">HUMID MISTY</span>
                  </div>

                  {/* Climate stats reads */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">ACUTE TEMPERATURE</span>
                      <span className="text-xl font-bold font-mono text-teal-400 mt-1 block">{zoneTemps.primate}°C</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">RELATIVE HUMIDITY</span>
                      <span className="text-xl font-bold font-mono text-[#f8a282] mt-1 block">{zoneHumidity.primate}%</span>
                    </div>
                  </div>

                  {/* Residents Data */}
                  <div className="space-y-2">
                    <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-widest font-black block">LIVE ANIMAL TELEMETRY</span>
                    <div className="bg-stone-900/50 p-3 rounded-2xl border border-themeCoral/5 space-y-3">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src="https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=120&q=80" 
                          alt="Chester" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-teal-500/20 shadow-inner flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-white truncate">CHESTER [MONKEY]</span>
                            <span className="text-emerald-400 animate-pulse text-[8px] font-normal leading-none">● ON</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-[7.5px] font-mono text-white/50">
                            <span>AGE: 5Y</span>
                            <span>HRT: 90</span>
                            <span className="text-right text-themePeach truncate font-syne">SWINGING</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedMapZone === 'nocturnal' && (
                <>
                  <div className="flex justify-between items-start pb-4 border-b border-themeCoral/15">
                    <div>
                      <span className="text-[8px] font-mono text-purple-400 tracking-widest uppercase font-bold">ZONE REFS // N-05</span>
                      <h3 className="font-serif text-2xl font-black text-white mt-1 uppercase leading-none">NOCTURNAL VALE</h3>
                      <p className="text-[9px] text-[#f8a282]/80 mt-1 uppercase tracking-tight font-sans">Mystic Shadow Ravine</p>
                    </div>
                    <span className="bg-purple-500/10 text-purple-300 font-mono text-[8px] font-bold px-2 py-1 rounded border border-purple-500/20 uppercase tracking-widest leading-none">DIM CHILLED</span>
                  </div>

                  {/* Climate stats reads */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">ACUTE TEMPERATURE</span>
                      <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">{zoneTemps.nocturnal}°C</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="block text-[7px] font-mono text-white/40 uppercase tracking-wider">RELATIVE HUMIDITY</span>
                      <span className="text-xl font-bold font-mono text-[#f8a282] mt-1 block">{zoneHumidity.nocturnal}%</span>
                    </div>
                  </div>

                  {/* Residents Data */}
                  <div className="space-y-2">
                    <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-widest font-black block">LIVE ANIMAL TELEMETRY</span>
                    <div className="bg-stone-900/50 p-3 rounded-2xl border border-themeCoral/5 space-y-3">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src="https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=120&q=80" 
                          alt="Selene" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-purple-500/20 shadow-inner flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                            <span className="text-white truncate">SELENE [LEOPARD]</span>
                            <span className="text-emerald-400 animate-pulse text-[8px] font-normal leading-none font-sans">● ON</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1 text-[7.5px] font-mono text-white/50">
                            <span>AGE: 8Y</span>
                            <span>HRT: 52</span>
                            <span className="text-right text-themePeach truncate">STALKING</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Climate Adjustment Controls Slider */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 mt-2">
                <span className="text-[8.5px] font-mono text-white/60 uppercase tracking-widest block font-bold">🛠 DIRECT ENVIRONMENTAL CALIBRATION</span>
                
                {/* Temperature slider adjuster */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[8px] text-white/35">
                    <span>MANUAL THERM TUNE</span>
                    <span className="text-[#f8a282] font-bold">{zoneTemps[selectedMapZone]}°C / {zoneTemps[selectedMapZone] < 10 ? 'CHILLY' : zoneTemps[selectedMapZone] < 22 ? 'BALMY' : 'HIGH HEAT'}</span>
                  </div>
                  <input
                    type="range"
                    min={selectedMapZone === 'polar' ? -18 : selectedMapZone === 'savannah' ? 15 : 5}
                    max={selectedMapZone === 'polar' ? 12 : selectedMapZone === 'savannah' ? 38 : 34}
                    value={zoneTemps[selectedMapZone]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setZoneTemps(prev => ({ ...prev, [selectedMapZone]: value }));
                      playOscillator(200 + (value + 20) * 10, 'sine', 0.08, 0.03);
                    }}
                    className="w-full accent-themeCoral cursor-pointer"
                  />
                </div>

                {/* Humidity slider adjuster */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[8px] text-white/35">
                    <span>HYDRO RELATIVE STRENGTH</span>
                    <span className="text-teal-400 font-bold">{zoneHumidity[selectedMapZone]}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={zoneHumidity[selectedMapZone]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setZoneHumidity(prev => ({ ...prev, [selectedMapZone]: value }));
                      playOscillator(300 + value * 2, 'sine', 0.08, 0.03);
                    }}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons: Mist & Feed */}
              <div className="grid grid-cols-2 gap-3 mt-1 text-[9px] font-mono tracking-widest font-black uppercase font-sans">
                <button
                  type="button"
                  onClick={() => {
                    const isNowActive = !mistActive[selectedMapZone];
                    setMistActive(prev => ({ ...prev, [selectedMapZone]: isNowActive }));
                    playOscillator(isNowActive ? 800 : 400, 'triangle', 0.15, 0.08);
                  }}
                  className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center
                    ${mistActive[selectedMapZone] 
                      ? 'bg-teal-500/10 text-teal-300 border-teal-500/50 shadow-md' 
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
                >
                  <Wind className={`w-4 h-4 ${mistActive[selectedMapZone] ? 'animate-pulse' : ''}`} />
                  <span>{mistActive[selectedMapZone] ? 'MIST ACTIVE' : 'TOGGLE MIST'}</span>
                </button>

                <button
                  type="button"
                  disabled={feedingStatus[selectedMapZone].active}
                  onClick={() => {
                    playOscillator(523.25, 'sine', 0.2, 0.06);
                    setTimeout(() => playOscillator(659.25, 'sine', 0.2, 0.06), 100);
                    setTimeout(() => playOscillator(783.99, 'sine', 0.25, 0.08), 200);

                    const foodTargets: { [key: string]: string } = {
                      polar: "Augustus (Polar Bear)",
                      savannah: "Zara (Giraffe)",
                      oceanic: "Sylvia (Coastal Seal)",
                      primate: "Chester (Golden Monkey)",
                      nocturnal: "Selene (Snow Leopard)"
                    };

                    setFeedingStatus(prev => ({
                      ...prev,
                      [selectedMapZone]: {
                        active: true,
                        timer: 4,
                        animal: foodTargets[selectedMapZone] || "Specimen"
                      }
                    }));
                  }}
                  className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center
                    ${feedingStatus[selectedMapZone].active 
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 cursor-not-allowed' 
                      : 'bg-themeCoral/10 text-themePeach border-themeCoral/40 hover:bg-themeCoral/20'}`}
                >
                  <Activity className={`w-4 h-4 ${feedingStatus[selectedMapZone].active ? 'animate-spin' : ''}`} />
                  <span>{feedingStatus[selectedMapZone].active ? `FEEDING... ${feedingStatus[selectedMapZone].timer}S` : 'DISPATCH FEED'}</span>
                </button>
              </div>

              {/* Feed simulation live message indicator overlay inside side HUD */}
              <AnimatePresence>
                {feedingStatus[selectedMapZone].active && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 10 }}
                    className="bg-emerald-500/10 border border-emerald-500/35 p-3 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-[9px]"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
                    <div className="flex-1 uppercase leading-normal">
                      FEED CAPSULE DELIVERED TO: <b className="text-white font-black">{feedingStatus[selectedMapZone].animal}</b>. TRANS MISSION METRICS ACTIVE.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Acoustic resonance loop trigger */}
              <div className="mt-2 pt-4 border-t border-themeCoral/15 flex justify-between items-center bg-transparent">
                <div className="flex items-center gap-2">
                  <Activity className={`w-3.5 h-3.5 font-black text-rose-500 ${activeAudioFeed === selectedMapZone ? 'animate-pulse' : ''}`} />
                  <span className="font-mono text-[8px] uppercase text-white/50">ACOUSTIC RESONANCE CORE</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (activeAudioFeed === selectedMapZone) {
                      setActiveAudioFeed(null);
                      playOscillator(150, 'sawtooth', 0.1, 0.05);
                    } else {
                      setActiveAudioFeed(selectedMapZone);
                      // Play atmospheric synthetic melody
                      const pitches: { [key: string]: number } = {
                        polar: 164.81, 
                        savannah: 220, 
                        oceanic: 293.66, 
                        primate: 349.23, 
                        nocturnal: 110 
                      };
                      playOscillator(pitches[selectedMapZone] || 220, 'triangle', 0.35, 0.25);
                      setTimeout(() => playOscillator((pitches[selectedMapZone] || 220) * 1.5, 'sine', 0.2, 0.15), 180);
                    }
                  }}
                  className={`text-[8.5px] uppercase font-mono px-3 py-1.5 rounded-full font-bold border transition-all
                    ${activeAudioFeed === selectedMapZone 
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/40' 
                      : 'bg-white/5 text-white/60 border-white/5 hover:text-white'}`}
                >
                  {activeAudioFeed === selectedMapZone ? '■ STOP CORE' : '▶ LISTEN ACOUSTIC'}
                </button>
              </div>

              {/* Pulse waves sound effect viz */}
              {activeAudioFeed === selectedMapZone && (
                <div className="flex gap-1 justify-center items-end h-4 mt-1 select-none pointer-events-none">
                  {[1, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 2, 4].map((v, i) => (
                    <motion.span 
                      key={i} 
                      className="w-[1.5px] bg-rose-500 rounded-full"
                      animate={{ height: [`${v * 3}px`, `${(v === 1 ? 5 : v === 5 ? 1 : 3) * 3}px`, `${v * 3}px`] }}
                      transition={{ repeat: Infinity, duration: 0.5 + (i % 3) * 0.15, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>

        </motion.div>
      </section>

      {/* 5. Immersive Specimen Encyclopedia Screen (WILD SPECIES ARCHIVE) */}
      <section id="encyclopedia" className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-16 px-6 md:px-12 bg-themeDarkBase select-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex flex-col justify-between flex-grow z-10"
        >
        
        {/* Module Header titles */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-themeCoral animate-pulse"></span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-themePeach uppercase font-bold">WILDLIFE SPECIES SPECIMEN DB</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight uppercase">Specimen Archive</h2>
            <p className="text-xs text-white/40 tracking-widest uppercase mt-1">Four-dimensional layout grids mapping animal profiles</p>
          </div>

          {/* Species category filter tabs */}
          <div className="flex flex-wrap gap-1 bg-themeNavy/40 p-1 rounded-full border border-themeCoral/20 glass-panel">
            <button 
              onClick={() => {
                setActiveCategory('all');
                playOscillator(340, 'triangle', 0.2);
              }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${activeCategory === 'all' ? 'bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              ALL
            </button>
            <button 
              onClick={() => {
                setActiveCategory('mammals');
                playOscillator(380, 'triangle', 0.2);
              }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${activeCategory === 'mammals' ? 'bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              MAMMALS
            </button>
            <button 
              onClick={() => {
                setActiveCategory('marine');
                playOscillator(420, 'triangle', 0.2);
              }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${activeCategory === 'marine' ? 'bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              MARINE LIFE
            </button>
            <button 
              onClick={() => {
                setActiveCategory('aviary');
                playOscillator(460, 'triangle', 0.2);
              }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${activeCategory === 'aviary' ? 'bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              AVIARY / BIRDS
            </button>
          </div>
        </div>

        {/* Dynamic Specimen Interactive Canvas Sandbox (3D coordinates calculations) */}
        <div 
          className="relative flex-grow w-full min-h-[500px] flex items-center justify-center cursor-crosshair pb-12 overflow-visible"
          onMouseDown={handleGalleryMouseDown}
          onTouchStart={(e) => {
            if (galleryLayout !== 'ring') return;
            setIsDragging(true);
            startDragX.current = e.touches[0].clientX;
          }}
          onTouchMove={(e) => {
            if (!isDragging || galleryLayout !== 'ring') return;
            const deltaX = e.touches[0].clientX - startDragX.current;
            startDragX.current = e.touches[0].clientX;
            setTargetRotationY(prev => prev + deltaX * 0.01);
          }}
          onTouchEnd={() => setIsDragging(false)}
        >
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            <div className="w-[450px] h-[450px] border border-themeCoral rounded-full animate-[spin_60s_linear_infinite] border-dashed"></div>
            <div className="w-[320px] h-[320px] border border-themePeach rounded-full absolute animate-[spin_40s_linear_infinite_reverse]"></div>
          </div>

          <div className="relative w-full h-[450px] flex items-center justify-center overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
            {filteredSpecimens.map((spec, idx) => {
              // Custom Coords Calculations based on galleryLayout state
              let transformStyle = '';
              let opacity = 1;
              let isInteractable = true;

              const totalCount = filteredSpecimens.length;

              if (galleryLayout === 'scatter') {
                const angle = (idx / totalCount) * Math.PI * 2;
                const radiusX = window.innerWidth > 768 ? 200 : 120;
                const radiusY = window.innerWidth > 768 ? 110 : 70;
                const x = Math.cos(angle) * radiusX + (Math.sin(idx * 40) * 15);
                const y = Math.sin(angle) * radiusY + (Math.cos(idx * 70) * 10);
                const rZ = (idx % 2 === 0 ? 1 : -1) * (idx * 2);
                transformStyle = `translate3d(${x}px, ${y}px, 0px) rotateZ(${rZ}deg)`;
              } 
              
              else if (galleryLayout === 'carousel') {
                const spacing = window.innerWidth > 768 ? 220 : 135;
                const startX = -((totalCount - 1) * spacing) / 2;
                const x = startX + idx * spacing;
                const y = Math.pow(Math.abs(idx - (totalCount - 1) / 2), 2) * 4.5;
                const rY = -10 * ((idx - (totalCount - 1) / 2) / (totalCount / 2));
                transformStyle = `translate3d(${x}px, ${y}px, 0px) rotateY(${rY}deg) scale(0.92)`;
              } 
              
              else if (galleryLayout === 'ring') {
                const angle = (idx / totalCount) * Math.PI * 2 + rotationY;
                const radius = window.innerWidth > 768 ? 320 : 190;
                const x = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius - 80;
                const rY = angle * (180 / Math.PI);
                transformStyle = `translate3d(${x}px, 0px, ${z}px) rotateY(${rY}deg) scale(0.85)`;
              } 
              
              else if (galleryLayout === 'stack') {
                const offsetIdx = idx;
                const z = -offsetIdx * 25;
                const y = -offsetIdx * 10;
                const x = offsetIdx * 5;
                const rZ = (idx - totalCount / 2) * 1.5;
                transformStyle = `translate3d(${x}px, ${y}px, ${z}px) rotateX(10deg) rotateY(-15deg) rotateZ(${rZ}deg) scale(0.95)`;
                opacity = 1 - (offsetIdx * 0.15);
                isInteractable = idx === 0;
              }

              return (
                <div
                  key={spec.id}
                  onClick={() => {
                    if (!isInteractable) return;
                    playChords(320);
                    setSelectedSpecimen(spec);
                  }}
                  onMouseEnter={() => {
                    if (isInteractable) {
                      playOscillator(600 + idx * 50, 'sine', 0.15, 0.04);
                    }
                  }}
                  className="zoe-card transition-all duration-[800ms] ease-out absolute select-none group"
                  style={{
                    transform: transformStyle,
                    opacity: opacity,
                    zIndex: 20 - idx,
                    pointerEvents: isInteractable ? 'auto' : 'none'
                  }}
                >
                  <div className="card-inner relative select-none">
                    {/* Block headers */}
                    <div className="flex justify-between items-start z-10 w-full select-none">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#f8a282] block mb-0.5 font-mono">{spec.category}</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">{spec.id}</span>
                      </div>
                      <span className="text-[8px] tracking-widest text-[#ee7752]/75 font-mono select-none">STG // 0{idx + 1}</span>
                    </div>

                    {/* Masked HD wildlife painting block */}
                    <div className="photo-frame my-3 flex items-center justify-center h-48 pointer-events-none select-none">
                      <div className="vector-backup opacity-20 pointer-events-none select-none">
                        {spec.symbolCode === 'diagonal' && (
                          <svg className="w-12 h-12 text-[#f8a282]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                        )}
                        {spec.symbolCode === 'half_moon' && (
                          <svg className="w-12 h-12 text-[#f8a282]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747" />
                          </svg>
                        )}
                        {spec.symbolCode === 'grid' && (
                          <svg className="w-12 h-12 text-[#f8a282]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                          </svg>
                        )}
                        {spec.symbolCode === 'concentric' && (
                          <svg className="w-12 h-12 text-[#f8a282]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.8">
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="5" />
                          </svg>
                        )}
                        {spec.symbolCode === 'circle_cross' && (
                          <svg className="w-12 h-12 text-[#f8a282]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.8">
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                          </svg>
                        )}
                        {spec.symbolCode === 'waves' && (
                          <svg className="w-12 h-12 text-[#f8a282]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c8.954-4.855 10.546 4.855 19.5 0" />
                          </svg>
                        )}
                      </div>
                      <img 
                        src={spec.imageUrl} 
                        alt={spec.title} 
                        className="photo-element w-full h-full object-cover select-none pointer-events-none filter grayscale opacity-75 transition-all duration-[750ms] ease-out group-hover:grayscale-0 group-hover:opacity-100 transform group-hover:scale-105" 
                      />
                    </div>

                    {/* Specimen lower profile text */}
                    <div className="z-10 mt-auto select-none">
                      <h3 className="font-syne text-md font-bold text-white tracking-wide">{spec.title}</h3>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#ee7752]/10 select-none">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 italic font-mono select-none">{spec.scientific}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f8a282]/40"></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic slide page footer controller systems */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between mt-12 z-10 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/40 tracking-wider font-mono uppercase">AMBIENT ATMOSPHERE:</span>
            <div className="flex gap-1.5 p-1 bg-themeNavy/30 rounded-xl border border-themeCoral/15">
              <button 
                onClick={() => {
                  setAmbientIndex(prev => prev + 1);
                  playOscillator(440, 'triangle', 0.2, 0.05);
                }} 
                className="p-2 rounded-lg bg-themeNavy/50 hover:bg-themeCoral/20 border border-[#ee7752]/20 text-white/70 hover:text-white transition-all flex items-center justify-center gap-1.5 text-[9px] font-mono font-bold"
                title="Morph background blur palette color schemes"
              >
                <RotateCw className="w-3 h-3 animate-spin" />
                MORPH
              </button>
            </div>
          </div>

          {/* Core Space Dimension Controllers */}
          <div className="flex p-1 bg-[#122143]/60 rounded-full border border-themeCoral/20 glass-panel shadow-lg select-none">
            <button 
              onClick={() => {
                setGalleryLayout('scatter');
                playOscillator(300, 'triangle', 0.25);
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-mono leading-none tracking-widest transition-all duration-305 ${galleryLayout === 'scatter' ? 'bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase font-bold shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              SCATTER
            </button>
            <button 
              onClick={() => {
                setGalleryLayout('carousel');
                playOscillator(340, 'triangle', 0.25);
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-mono leading-none tracking-widest transition-all duration-305 ${galleryLayout === 'carousel' ? 'bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase font-bold shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              CAROUSEL
            </button>
            <button 
              onClick={() => {
                setGalleryLayout('ring');
                playOscillator(380, 'triangle', 0.25);
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-mono leading-none tracking-widest transition-all duration-305 ${galleryLayout === 'ring' ? 'bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase font-bold shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              3D RING
            </button>
            <button 
              onClick={() => {
                setGalleryLayout('stack');
                playOscillator(420, 'triangle', 0.25);
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-mono leading-none tracking-widest transition-all duration-305 ${galleryLayout === 'stack' ? 'bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase font-bold shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              STACK
            </button>
          </div>

          <div className="text-right text-[9px] text-[#f8a282]/40 font-mono tracking-widest select-none">
            ARCHIVE CLASSIFICATION DATA // SYSTEM VER 4.2
          </div>
        </div>
      </motion.div>

        {/* Modern high-concept sliding specimen drawer details */}
        <AnimatePresence>
          {selectedSpecimen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backdropFilter: 'blur(30px)' }}
              className="fixed inset-0 z-50 bg-themeDarkBase/90 flex items-center justify-center p-4 md:p-12"
            >
              <motion.div 
                initial={{ y: 50, scale: 0.96 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.96 }}
                transition={{ type: 'spring', damping: 25, stiffness: 140 }}
                className="max-w-6xl w-full h-[85vh] md:h-[75vh] glass-panel bg-themeNavy/25 rounded-[32px] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border border-themeCoral/25"
              >
                {/* Close spec sheet button */}
                <button 
                  onClick={() => {
                    playOscillator(220, 'triangle', 0.2);
                    setSelectedSpecimen(null);
                  }}
                  className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 hover:bg-themeCoral/20 border border-themeCoral/20 flex items-center justify-center transition-all group z-50 text-white"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Left side: Artwork graphic with glass focus lines */}
                <div className="w-full md:w-1/2 h-[38%] md:h-full relative overflow-hidden flex items-center justify-center bg-gradient-to-tr from-themeDarkBase/50 to-themeNavy/25 border-b md:border-b-0 md:border-r border-[#243962]">
                  {/* Subtle blur overlay background color */}
                  <div 
                    className="absolute inset-0 opacity-30 filter blur-3xl transform scale-125"
                    style={{ background: selectedSpecimen.gradient }}
                  />
                  
                  {/* Full image render */}
                  <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
                    <img 
                      src={selectedSpecimen.imageUrl} 
                      alt={selectedSpecimen.title} 
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-themeDarkBase via-themeDarkBase/15 to-transparent"></div>
                  </div>

                  {/* Scientific laser targeting overlay lines */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-20 h-[0.5px] bg-themePeach"></div>
                    <div className="h-20 w-[0.5px] bg-themePeach absolute"></div>
                    <div className="w-36 h-36 border border-themePeach rounded-full absolute border-dashed scale-75"></div>
                  </div>

                  {/* Corner indicator details */}
                  <div className="absolute bottom-6 left-8 font-mono text-[8px] text-white/50 tracking-widest hidden sm:block">
                    OPTICAL ALIGNMENT LOCK // OK
                  </div>
                </div>

                {/* Right side: Informational encyclopedia spec details card */}
                <div className="w-full md:w-1/2 h-[62%] md:h-full p-8 md:p-14 flex flex-col justify-between overflow-y-auto bg-gradient-to-br from-themeNavy/50 to-themeDarkBase text-left">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 border border-themeCoral/30 rounded-full bg-themeCoral/10 text-themePeach">
                        {selectedSpecimen.category}
                      </span>
                      <span className="text-[10px] font-mono text-white/45 tracking-wide">
                        SPECIMEN ID: {selectedSpecimen.id}
                      </span>
                      <span className="text-[8px] px-2.5 py-1 border border-red-500/40 text-red-400 bg-red-950/25 rounded font-mono font-bold tracking-wider">
                        {selectedSpecimen.status}
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-syne font-black text-white leading-tight uppercase tracking-tight">
                      {selectedSpecimen.title}
                    </h2>

                    <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">
                      {selectedSpecimen.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-6 border-t border-themeCoral/10 pt-6">
                      <div>
                        <span className="block text-[8px] text-white/45 tracking-widest uppercase mb-1 font-mono">SCIENTIFIC GENUS</span>
                        <span className="text-xs md:text-sm text-themePeach font-medium italic">
                          {selectedSpecimen.scientific}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-white/45 tracking-widest uppercase mb-1 font-mono">HABITAT RANGE</span>
                        <span className="text-xs md:text-sm text-white/85 font-mono">
                          {selectedSpecimen.range}
                        </span>
                      </div>
                    </div>

                    {/* Scientific Sparkline Trend visualization */}
                    <div className="space-y-2 pt-4">
                      <span className="block text-[8px] text-white/45 tracking-widest uppercase font-mono">BIOLOGICAL CRITICAL TREND DATA</span>
                      <div className="w-full h-8 flex items-end gap-1.5 opacity-40 pointer-events-none select-none">
                        <div className="flex-grow bg-themePeach/25 h-1/3 rounded-sm"></div>
                        <div className="flex-grow bg-[#ee7752]/35 h-3/5 rounded-sm"></div>
                        <div className="flex-grow bg-themePeach/45 h-2/5 rounded-sm"></div>
                        <div className="flex-grow bg-[#ee7752]/75 h-4/5 rounded-sm animate-pulse"></div>
                        <div className="flex-grow bg-themePeach/15 h-1/4 rounded-sm"></div>
                        <div className="flex-grow bg-[#ee7752]/20 h-1/5 rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 md:mt-0 pt-6 border-t border-themeCoral/10 font-mono">
                    <span className="text-[9px] text-white/35 italic">Zoe Zoo Specimen Biosphere Archive</span>
                    <button 
                      onClick={() => {
                        playOscillator(660, 'sine', 0.25, 0.05);
                        alert(`Consulting deeper observation logs for ${selectedSpecimen.title}... All systems stable.`);
                      }}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase font-bold text-[10px] tracking-wider hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      OBSERVE DATA
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Custom Premium Ticket Booking Modal */}
        <AnimatePresence>
          {bookingDay !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backdropFilter: 'blur(30px)' }}
              className="fixed inset-0 z-50 bg-themeDarkBase/95 flex items-center justify-center p-4 md:p-8 overflow-y-auto no-scrollbar"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 140 }}
                className="max-w-4xl w-full glass-panel bg-[#122143]/50 rounded-[32px] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border border-themeCoral/20 min-h-[500px]"
              >
                {/* Close Button */}
                <button 
                  onClick={() => {
                    playOscillator(200, 'sawtooth', 0.25);
                    setBookingDay(null);
                  }}
                  className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 border border-themeCoral/20 hover:bg-themeCoral/25 text-[#fdfaf5] hover:text-white flex items-center justify-center transition-all duration-300 z-50 group"
                >
                  <X className="w-5 h-5 group-hover:rotate-95 transition-transform duration-300" />
                </button>

                {/* Left Side: Interactive Virtual Ticket Boarding Pass */}
                <div className="w-full md:w-[42%] bg-themeDarkBase/90 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-themeCoral/15 relative overflow-hidden text-left">
                  {/* Holographic background highlights */}
                  <div className="absolute inset-0 grid-blueprint opacity-20 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-themeCoral/10 blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-themePeach/5 blur-[60px] pointer-events-none" />
                  
                  {/* Ticket Header */}
                  <div className="relative z-10 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-themeCoral animate-ping" />
                      <span className="font-mono text-[9px] tracking-[0.3em] text-themePeach font-bold">SECURE PASS GRANTED</span>
                    </div>
                    <h4 className="font-serif text-2xl font-black text-white tracking-widest uppercase mb-1">ZOE ZOO</h4>
                    <p className="text-[8px] font-mono tracking-widest text-[#f8a282]/50 uppercase mt-0.5">SANCTUARY RESERVATION OFFICE</p>
                  </div>

                  {/* Booking Details visual */}
                  <div className="my-8 space-y-5 text-left relative z-10 font-mono">
                    <div className="border-t border-b border-themeCoral/15 py-4 space-y-3">
                      <div>
                        <span className="block text-[8px] text-white/35 uppercase tracking-widest mb-1 font-semibold">SCHEDULED DATE</span>
                        <span className="text-sm text-themePeach font-bold font-mono">MAY {bookingDay}, 2026</span>
                      </div>
                      {bookingDay && ZOO_ACTIVITIES[bookingDay] && ZOO_ACTIVITIES[bookingDay].length > 0 ? (
                        <div className="space-y-4">
                          {/* Rich High-Resolution Photographic Visual representing animal event */}
                          <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-themeCoral/15 bg-neutral-900 shadow-inner">
                            <img 
                              src={ZOO_ACTIVITIES[bookingDay][0].imageUrl} 
                              alt={ZOO_ACTIVITIES[bookingDay][0].title} 
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-themeDarkBase via-transparent to-transparent" />
                            <div className="absolute bottom-2 left-3">
                              <span className="text-[7px] uppercase font-mono tracking-widest text-[#f8a282] bg-themeDarkBase/80 px-2 py-0.5 rounded border border-themeCoral/20">
                                Featured Experience
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <span className="block text-[8px] text-white/35 uppercase tracking-widest font-semibold leading-none">
                              {ZOO_ACTIVITIES[bookingDay].length > 1 ? "EXCLUSIVE SCHEDULED ACTIVITIES" : "EXCLUSIVE SCHEDULED ACTIVITY"}
                            </span>
                            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
                              {ZOO_ACTIVITIES[bookingDay].map((act, index) => (
                                <div key={index} className="bg-white/5 p-2 rounded-xl border border-themeCoral/10 text-left">
                                  <div className="flex gap-2 items-center justify-between mb-1">
                                    <span className={`text-[6px] px-1.5 py-0.5 rounded font-mono font-bold tracking-widest uppercase
                                      ${act.defaultTier === 'vip' ? 'bg-themeCoral/20 text-themeCoral' :
                                        act.defaultTier === 'night' ? 'bg-indigo-500/20 text-indigo-300' :
                                        'bg-teal-500/20 text-teal-300'}`}>
                                      {act.defaultTier} Pass
                                    </span>
                                    <span className="text-[9px] text-[#f8a282] font-mono font-bold">${act.price}</span>
                                  </div>
                                  <span className="text-[10px] text-white/95 font-bold leading-none block">{act.title.toUpperCase()}</span>
                                  <p className="text-[8px] text-white/45 mt-1 font-sans font-normal normal-case leading-normal">{act.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="block text-[8px] text-white/35 uppercase tracking-widest mb-1 font-semibold">SCHEDULED DAY TYPE</span>
                          <span className="text-xs text-white/80 font-bold">Standard Open-Exploration Charter</span>
                          <p className="text-[8px] text-white/50 mt-1 font-sans font-light normal-case tracking-normal leading-relaxed">
                            No timed special activities scheduled. Full self-guided access across all premium indoor bio-domes and interactive exhibits.
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="block text-[8px] text-white/35 uppercase tracking-widest mb-1 font-semibold">VISITATION RANGE</span>
                        <span className="text-xs text-white/80">09:00 AM - 10:00 PM // CONTINUOUS</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[8px] text-white/35 uppercase tracking-widest">ADMISSION CATEGORY</span>
                        <span className="text-[11px] text-white/80 font-bold uppercase">
                          {ticketTier === 'standard' && 'Standard Sanctuary Access'}
                          {ticketTier === 'vip' && 'Deep Reserve Close-Up VIP'}
                          {ticketTier === 'night' && 'Midnight Bioluminescence'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-baseline">
                        <span className="text-[8px] text-white/35 uppercase tracking-widest">QUANTITY</span>
                        <span className="text-xs text-white/80 font-bold">{ticketCount} {ticketCount > 1 ? 'PASSES' : 'PASS'}</span>
                      </div>

                      <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-themeCoral/10">
                        <span className="text-[8px] text-themePeach/80 uppercase tracking-widest font-black">TOTAL VALUE</span>
                        <span className="text-md text-themeCoral font-black font-mono">
                          ${ticketCount * (ticketTier === 'standard' ? 45 : ticketTier === 'vip' ? 125 : 80)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Footer details with dynamic simulated barcode */}
                  <div className="relative z-10 text-left space-y-4 font-mono">
                    <div className="flex justify-between text-[7px] text-white/20 select-none">
                      <span>SEC_KEY: ZZ-REV-{bookingDay}026-X8</span>
                      <span>SYSTEM_SECURE_VERIFIER</span>
                    </div>

                    {/* Barcode representation */}
                    <div className="flex gap-[3px] h-10 w-full items-center justify-center opacity-65 bg-white/5 p-2 rounded-lg border border-themeCoral/15">
                      <div className="w-1.5 h-full bg-themePeach"></div>
                      <div className="w-[1px] h-full bg-themePeach"></div>
                      <div className="w-2.5 h-full bg-themePeach"></div>
                      <div className="w-[1px] h-full bg-themePeach"></div>
                      <div className="w-[3px] h-full bg-themePeach"></div>
                      <div className="w-1 h-full bg-themePeach"></div>
                      <div className="w-[2px] h-full bg-themePeach"></div>
                      <div className="w-[1px] h-full bg-themePeach"></div>
                      <div className="w-[4px] h-full bg-themePeach"></div>
                      <div className="w-[2px] h-full bg-themePeach"></div>
                      <div className="w-1.5 h-full bg-themePeach"></div>
                      <div className="w-[1px] h-full bg-themePeach"></div>
                      <div className="w-2 h-full bg-themePeach"></div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Interactive Selection form or success pass */}
                <div className="w-full md:w-[58%] p-8 md:p-12 flex flex-col justify-between overflow-y-auto bg-gradient-to-br from-themeNavy/50 to-themeDarkBase text-left">
                  <AnimatePresence mode="wait">
                    {!isBooked ? (
                      <motion.div 
                        key="booking-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 flex flex-col h-full justify-between"
                      >
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] bg-themeCoral/10 text-themePeach border border-themeCoral/30 px-2.5 py-0.5 rounded-full font-mono font-bold">STEP 01</span>
                              <span className="text-[10px] text-white/45 tracking-widest font-mono uppercase">CHOOSE ADMISSION TIER</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-black text-white uppercase tracking-tight">Select Experience Portal</h3>
                          </div>

                          {/* Tier selection cards */}
                          <div className="space-y-3">
                            {/* Standard tier */}
                            <div 
                              onClick={() => {
                                setTicketTier('standard');
                                playOscillator(320, 'triangle', 0.15, 0.05);
                              }}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                                ticketTier === 'standard' 
                                  ? 'bg-themeCoral/10 border-themeCoral' 
                                  : 'bg-white/5 border-themeCoral/15 hover:border-themeCoral/40 hover:bg-white/10'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="block text-xs font-bold text-white uppercase tracking-wide">Sanctuary Access Pass</span>
                                <span className="block text-[10px] text-white/50 leading-relaxed font-light">Access to primary biospheres & self-guided digital interactive logs.</span>
                              </div>
                              <span className="text-md font-mono font-black text-themePeach pl-4">$45</span>
                            </div>

                            {/* VIP tier */}
                            <div 
                              onClick={() => {
                                setTicketTier('vip');
                                playOscillator(380, 'triangle', 0.15, 0.05);
                              }}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                                ticketTier === 'vip' 
                                  ? 'bg-themeCoral/10 border-themeCoral' 
                                  : 'bg-white/5 border-themeCoral/15 hover:border-themeCoral/40 hover:bg-white/10'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="block text-xs font-bold text-white uppercase tracking-wide">Wild Reserve Close-Up VIP</span>
                                <span className="block text-[10px] text-white/50 leading-relaxed font-light">Close-up predator feeding observation & expert naturalist escort.</span>
                              </div>
                              <span className="text-md font-mono font-black text-themePeach pl-4">$125</span>
                            </div>

                            {/* Night Bioluminescence tier */}
                            <div 
                              onClick={() => {
                                setTicketTier('night');
                                playOscillator(440, 'triangle', 0.15, 0.05);
                              }}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                                ticketTier === 'night' 
                                  ? 'bg-themeCoral/10 border-themeCoral' 
                                  : 'bg-white/5 border-themeCoral/15 hover:border-themeCoral/40 hover:bg-white/10'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="block text-xs font-bold text-white uppercase tracking-wide">Midnight Bioluminescence</span>
                                <span className="block text-[10px] text-white/50 leading-relaxed font-light">Late admissions after 7 PM. Deep ocean glowing light guides.</span>
                              </div>
                              <span className="text-md font-mono font-black text-themePeach pl-4">$80</span>
                            </div>
                          </div>

                          {/* Quantity selectors & User Input Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div>
                              <div className="mb-2">
                                <span className="text-[10px] text-white/45 tracking-widest font-mono uppercase">QUANTITY TICKETS</span>
                              </div>
                              <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-themeCoral/15 w-fit">
                                <button 
                                  disabled={ticketCount <= 1}
                                  onClick={() => {
                                    setTicketCount(prev => Math.max(1, prev - 1));
                                    playOscillator(240, 'sine', 0.15, 0.05);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-themeDarkBase/60 hover:bg-themeCoral/15 border border-themeCoral/20 flex items-center justify-center font-bold text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                  -
                                </button>
                                <span className="font-mono text-sm px-3 font-bold text-white min-w-[20px] text-center">{ticketCount}</span>
                                <button 
                                  disabled={ticketCount >= 10}
                                  onClick={() => {
                                    setTicketCount(prev => Math.min(10, prev + 1));
                                    playOscillator(280, 'sine', 0.15, 0.05);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-themeDarkBase/60 hover:bg-themeCoral/15 border border-themeCoral/20 flex items-center justify-center font-bold text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div>
                              <div className="mb-2">
                                <span className="text-[10px] text-white/45 tracking-widest font-mono uppercase text-left block">PATRON IDENTIFICATION</span>
                              </div>
                              <div className="space-y-3 font-mono">
                                <input 
                                  type="text" 
                                  placeholder="Your Name" 
                                  value={visitorName}
                                  onChange={(e) => setVisitorName(e.target.value)}
                                  className="w-full bg-white/5 hover:bg-white/10 focus:bg-themeDarkBase/40 border border-themeCoral/15 focus:border-themeCoral/80 text-white placeholder-white/30 text-[11px] font-mono rounded-xl px-4 py-2.5 outline-none transition-all"
                                />
                                <input 
                                  type="email" 
                                  placeholder="Your Email Address" 
                                  value={visitorEmail}
                                  onChange={(e) => setVisitorEmail(e.target.value)}
                                  className="w-full bg-white/5 hover:bg-white/10 focus:bg-themeDarkBase/40 border border-themeCoral/15 focus:border-themeCoral/80 text-white placeholder-white/30 text-[11px] font-mono rounded-xl px-4 py-2.5 outline-none transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Secure Access CTA button elements */}
                        <div className="border-t border-themeCoral/15 pt-6 mt-8 flex flex-col sm:flex-row gap-3">
                          <button 
                            type="button"
                            onClick={() => {
                              playOscillator(200, 'sawtooth', 0.25);
                              setBookingDay(null);
                            }}
                            className="bg-white/5 border border-themeCoral/30 hover:bg-themeCoral/15 text-white/80 hover:text-white font-bold py-3.5 px-6 rounded-2xl text-[10px] tracking-widest font-mono uppercase transition-all duration-300 block text-center order-2 sm:order-1"
                          >
                            ← Cancel and Return
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              if (!visitorName.trim()) {
                                alert("Please enter your name.");
                                playOscillator(150, 'sawtooth', 0.3, 0.1);
                                return;
                              }
                              if (!visitorEmail.trim() || !visitorEmail.includes('@')) {
                                alert("Please enter a valid email address.");
                                playOscillator(150, 'sawtooth', 0.3, 0.1);
                                return;
                              }
                              playChords(440);
                              setIsBooked(true);
                            }}
                            className="flex-1 bg-gradient-to-r from-themeCoral to-themePeach hover:opacity-90 active:scale-[0.99] text-themeDarkBase font-bold py-3.5 px-6 rounded-2xl text-[10px] tracking-widest font-mono uppercase transition-all duration-305 block text-center shadow-lg order-1 sm:order-2"
                          >
                            🔒 Unlock Sanctuary Entry Pass
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="booking-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 flex flex-col justify-center items-center h-full text-center py-8"
                      >
                        {/* Success verification check badge */}
                        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500 flex items-center justify-center text-emerald-400 mb-2 relative">
                          <Sparkles className="w-8 h-8 animate-pulse" />
                          <span className="absolute inset-[-4px] rounded-full border border-emerald-500/20 animate-ping"></span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                            TRANSMISSION VERIFIED
                          </span>
                          <h3 className="text-2xl md:text-3xl font-serif font-black text-white uppercase tracking-tight">Access Locked</h3>
                          <p className="text-xs text-white/50 max-w-sm mx-auto font-light leading-relaxed">
                            Excellent choice, <span className="text-themePeach font-medium">{visitorName}</span>. Your ticket has been recorded on our digital logs. A confirmation email with NFC passcode has been routed to: <span className="text-themePeach font-mono">{visitorEmail}</span>.
                          </p>
                        </div>

                        {/* Interactive scanning detail receipt block */}
                        <div className="w-full max-w-sm bg-white/5 space-y-4 rounded-2xl p-5 border border-[#2a4585]/40 leading-normal text-left font-mono">
                          <div className="flex justify-between items-center text-[10px] pb-2 border-b border-themeCoral/15">
                            <span className="text-white/45 font-mono">VISITOR ID PASS</span>
                            <span className="text-themePeach font-bold">ZZ-ID-2605-{bookingDay}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-[10px]">
                            <div>
                              <span className="block text-white/35">PORTAL</span>
                              <span className="text-white/80 uppercase">{ticketTier} ACCESS</span>
                            </div>
                            <div>
                              <span className="block text-white/35">QUANTITY</span>
                              <span className="text-white/80">{ticketCount} VISITOR(S)</span>
                            </div>
                            <div>
                              <span className="block text-white/35">VERIFICATION CODE</span>
                              <span className="text-themeCoral font-bold animate-pulse">ZZ-{bookingDay}05-{Math.floor(1000 + Math.random() * 9000)}</span>
                            </div>
                            <div>
                              <span className="block text-white/35">EXCURSION FEE</span>
                              <span className="text-white/80">${ticketCount * (ticketTier === 'standard' ? 45 : ticketTier === 'vip' ? 125 : 80)} PAID</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-4">
                          <button 
                            onClick={() => {
                              playOscillator(261.63, 'triangle', 0.2, 0.05);
                              setIsBooked(false);
                            }}
                            className="flex-1 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-themeCoral/30 text-white py-3 px-6 rounded-xl font-bold text-[10px] uppercase font-mono tracking-wider transition-all"
                          >
                            Book Another Pass
                          </button>
                          <button 
                            onClick={() => {
                              playOscillator(220, 'sine', 0.15);
                              setBookingDay(null);
                            }}
                            className="flex-1 bg-gradient-to-r from-themeCoral to-themePeach text-themeDarkBase py-3 px-6 rounded-xl font-bold text-[10px] uppercase font-mono tracking-wider transition-all hover:opacity-90 active:scale-[0.98]"
                          >
                            Return to Wilderness
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Secondary Interface: Volunteer Registration Modal */}
        <AnimatePresence>
          {showVolunteerModal && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-themeDarkBase/90 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="max-w-xl w-full glass-panel bg-[#0d162a] border border-themeCoral/45 rounded-3xl p-6 md:p-8 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] font-mono"
              >
                {/* Close handle button */}
                <button 
                  onClick={() => {
                    playOscillator(200, 'sawtooth', 0.25);
                    setShowVolunteerModal(false);
                  }}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-themeCoral/20 hover:text-white text-white/70 flex items-center justify-center transition-all duration-300 z-50 group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
                  <Flame className="w-5 h-5 text-[#f8a282]" />
                  <div>
                    <h3 className="font-serif text-lg tracking-wider text-themePeach uppercase font-black">Patrol Registry Terminal</h3>
                    <p className="text-[7.5px] font-mono uppercase tracking-widest text-[#f8a282]/40">Active Bio-Dome Cadet Enlistment // 志愿者档案建册</p>
                  </div>
                </div>

                {!volunteerSubmitted ? (
                  <div className="flex-grow flex flex-col gap-5">
                    {/* Step 1: Track Selector */}
                    <div>
                      <label className="block text-[8px] font-mono text-white/30 uppercase tracking-[0.25em] mb-3">SELECT PATROL PATH</label>
                      <div className="flex flex-col gap-2.5 font-mono">
                        {[
                          { id: 'wildlife', name: '🐾 Wildlife Care', desc: 'Assist keepers with basic husbandry & behavior enrichment.' },
                          { id: 'educator', name: '🎓 Eco-Educator', desc: 'Conduct guided visual sessions for student collectives.' },
                          { id: 'nocturnal', name: '🌙 Night Patrol', desc: 'Monitor sleep patterns and nocturnal vital telemetries.' }
                        ].map((track) => {
                          const isActive = volunteerTrack === track.id;
                          return (
                            <button 
                              key={track.id}
                              onClick={() => {
                                playOscillator(300 + (track.id === 'wildlife' ? 50 : track.id === 'educator' ? 100 : 150), 'triangle', 0.18, 0.06);
                                setVolunteerTrack(track.id as any);
                              }}
                              className={`p-3 rounded-2xl border text-left transition-all duration-300 relative ${isActive ? 'bg-[#ee7752]/10 border-[#ee7752]/50 shadow-[0_0_12px_rgba(238,119,82,0.05)]' : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]'}`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className={`text-[9.5px] font-black uppercase tracking-widest ${isActive ? 'text-[#f8a282]' : 'text-white/80'}`}>{track.name}</span>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#ee7752] animate-ping" />}
                              </div>
                              <p className="text-[8px] text-blue-200/40 leading-relaxed font-sans uppercase tracking-[0.1em]">{track.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Inputs */}
                    <div className="flex flex-col gap-3 font-mono mt-auto">
                      <div>
                        <input 
                          type="text" 
                          placeholder="FULL REGISTER NAME..." 
                          value={volunteerName}
                          onChange={(e) => setVolunteerName(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 hover:border-white/20 focus:border-[#ee7752]/60 focus:bg-[#1a2d54]/25 text-white placeholder-white/25 text-[9.5px] tracking-widest px-4 py-2.5 rounded-xl transition-all font-mono outline-none text-center"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="email" 
                          placeholder="CONTACT EMAIL..." 
                          value={volunteerEmail}
                          onChange={(e) => setVolunteerEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 hover:border-white/20 focus:border-[#ee7752]/60 focus:bg-[#1a2d54]/25 text-white placeholder-white/25 text-[9.5px] tracking-widest px-4 py-2.5 rounded-xl transition-all font-mono outline-none text-center"
                        />
                        <input 
                          type="date" 
                          value={volunteerDate}
                          onChange={(e) => setVolunteerDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 hover:border-white/20 focus:border-[#ee7752]/60 focus:bg-[#1a2d54]/25 text-white text-[9.5px] tracking-widest px-4 py-2.5 rounded-xl transition-all font-mono outline-none text-center"
                        />
                      </div>

                      <button 
                        onClick={() => {
                          if (!volunteerName.trim() || !volunteerEmail.trim()) {
                            playOscillator(100, 'sawtooth', 0.2, 0.1);
                            return;
                          }
                          // Run telemetry security bio-scan
                          playOscillator(120, 'sawtooth', 0.3, 0.2);
                          setVolunteerScanning(true);
                          setTimeout(() => {
                            playOscillator(600, 'sine', 0.4, 0.1);
                            setVolunteerScanning(false);
                            setVolunteerSubmitted(true);
                          }, 1600);
                        }}
                        disabled={volunteerScanning}
                        className="w-full bg-white/5 hover:bg-[#ee7752]/10 hover:text-themePeach hover:border-themeCoral/40 hover:shadow-[0_0_15px_rgba(238,119,82,0.1)] border border-white/15 text-white/80 font-black tracking-[0.25em] text-[9.5px] py-3.5 rounded-xl transition-all uppercase flex items-center justify-center space-x-2"
                      >
                        {volunteerScanning ? (
                          <span className="flex items-center space-x-2 animate-pulse text-[#ee7752]">
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>🧬 BIOMETRIC BLUEPRINT SCANNING...</span>
                          </span>
                        ) : (
                          <span>⚡ BROADCAST ENLISTMENT DATA // 登记提交</span>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center font-mono text-emerald-400 p-4 border border-emerald-500/25 rounded-2xl bg-emerald-500/5 shadow-[rgba(16,185,129,0.05)_0_0_20px]"
                  >
                    <div className="w-12 h-12 rounded-full border border-emerald-500/40 flex items-center justify-center mb-4 relative">
                      <span className="text-xl">✓</span>
                      <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-ping" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black block mb-1">Reserve Broadcast Clear</span>
                    <span className="text-[7.5px] uppercase tracking-widest text-emerald-300/40 mb-6 font-bold">Security Node ID: VR-{Math.floor(1000 + Math.random() * 9000)}</span>
                    
                    <p className="text-[9px] text-[#fdfaf5]/70 leading-relaxed max-w-xs mb-8 uppercase tracking-wider">
                      Welcome, <span className="text-[#f8a282] font-black">{volunteerName}</span>! Your patrol reservation on <span className="text-[#f8a282] font-black">{volunteerDate || 'active roster'}</span> is locked. A telemetry officer will transmit deep instructions to your node terminal at <span className="text-[#f8a282] font-black">{volunteerEmail}</span>.
                    </p>

                    <div className="flex gap-4 w-full">
                      <button 
                        onClick={() => {
                          playOscillator(200, 'sine', 0.1, 0.05);
                          setVolunteerSubmitted(false);
                          setVolunteerName('');
                          setVolunteerEmail('');
                          setVolunteerDate('');
                        }}
                        className="flex-1 text-[8px] uppercase tracking-[0.2em] font-black text-white/50 hover:text-emerald-400 bg-white/5 hover:bg-emerald-500/10 py-2.5 border border-white/5 hover:border-emerald-500/30 rounded-lg transition-all"
                      >
                        ↩ New Registration
                      </button>
                      <button 
                        onClick={() => {
                          playOscillator(200, 'sine', 0.1, 0.05);
                          setShowVolunteerModal(false);
                        }}
                        className="flex-1 text-[8px] uppercase tracking-[0.2em] font-black bg-emerald-500 hover:bg-emerald-600 text-themeDarkBase py-2.5 rounded-lg transition-all font-black"
                      >
                        ✓ Close Terminal
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 6. High-end Premium Footer Section */}
      <footer className="w-full glass-panel border-t border-themeCoral/15 py-12 px-6 md:px-12 relative z-10 text-[10px] text-white/30 tracking-widest font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-themePeach text-xs tracking-widest uppercase font-bold text-center md:text-left">ZOE ZOO WILDERNESS INST.</span>
            <span className="text-[8px] text-white/20 mt-1 uppercase text-center md:text-left">Unified premium portfolio representing wildlife chronology and species Specimens</span>
          </div>
          
          <div className="flex gap-8 text-[9px] uppercase font-bold text-center md:text-left">
            <button onClick={() => jumpTo('home')} className="hover:text-themePeach transition-colors">THE SANCTUARY</button>
            <button onClick={() => jumpTo('calendar')} className="hover:text-themePeach transition-colors">ADVENT CALENDAR</button>
            <button onClick={() => jumpTo('map')} className="hover:text-themePeach transition-colors">INTERACTIVE MAP</button>
            <button onClick={() => jumpTo('encyclopedia')} className="hover:text-themePeach transition-colors">SPECIMENS ARCHIVE</button>
          </div>

          <div className="text-center md:text-right text-[8px] text-white/20 select-none">
            © 2026 ZOE ZOO WILDERNESS PORTFOLIO. SINGLE-O-DOOR STRUCTURE. <br />
            MADE WITH ORGANIC WEB AUDIO SYNTHESIS & FRAMER MOTION
          </div>
        </div>
      </footer>
    </div>
  );
}
