"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight, RotateCw, Layers, Compass, ArrowDown } from "lucide-react";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

export interface MorphCardItem {
    src: string;
    title?: string;
    category?: string;
    metric?: string;
}

interface FlipCardProps {
    src: string;
    title?: string;
    category?: string;
    metric?: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 70;
const IMG_HEIGHT = 100;

function FlipCard({
    src,
    title,
    category,
    metric,
    index,
    total,
    phase,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            // Smoothly animate to coordinates
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 45,
                damping: 16,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.55, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180, scale: 1.08 }}
            >
                {/* Front Face: Modern obsidian glass card with crisp highlight border */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-2xl bg-[#111317] border border-white/20 transition-all duration-300 group-hover:border-white/50 group-hover:shadow-[0_0_25px_rgba(52,211,153,0.2)]"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={title || `card-${index}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/10 group-hover:opacity-40 transition-opacity" />
                    
                    {metric && (
                        <div className="absolute bottom-1.5 right-1.5 left-1.5 flex justify-between items-center">
                            <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-emerald-400 border border-emerald-500/30 font-semibold truncate max-w-full">
                                {metric}
                            </span>
                        </div>
                    )}
                </div>

                {/* Back Face: Deep obsidian glass card revealing telemetry breakdown */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-2xl bg-[#0c0d12]/95 flex flex-col items-center justify-between p-2.5 border border-emerald-500/40 backdrop-blur-md"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="w-full text-left">
                        <span className="text-[7px] font-mono font-bold text-emerald-400 uppercase tracking-widest block truncate">
                            {category || "INTEL"}
                        </span>
                    </div>
                    
                    <div className="text-center px-0.5 my-auto">
                        <p className="text-[9px] font-medium text-white line-clamp-3 leading-snug">
                            {title || "Signal Metric"}
                        </p>
                    </div>

                    <div className="w-full flex items-center justify-between border-t border-white/10 pt-1">
                        <span className="text-[6.5px] font-mono text-emerald-300/80 font-bold">{metric || "VERIFIED"}</span>
                        <span className="text-[6.5px] font-mono text-zinc-400">#{index + 1}</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Card Dataset for Content Intelligence Swarm ---
const DEFAULT_CARD_ITEMS: MorphCardItem[] = [
    {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        title: "3s Hook Retention",
        category: "Content DNA",
        metric: "+3.1x",
    },
    {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        title: "Neural Flow",
        category: "AI Swarm",
        metric: "LLM-4",
    },
    {
        src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
        title: "Pacing & BPM",
        category: "Audio Intel",
        metric: "144 BPM",
    },
    {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        title: "Growth Blueprint",
        category: "Attribution",
        metric: "98.4%",
    },
    {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
        title: "Audience Persona",
        category: "Brand Brain",
        metric: "100% Fit",
    },
    {
        src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
        title: "Opportunity Radar",
        category: "Velocity",
        metric: "+142%",
    },
    {
        src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&auto=format&fit=crop&q=80",
        title: "Viral Vector",
        category: "Analysis",
        metric: "2.4x",
    },
    {
        src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        title: "Contrast Hook",
        category: "Pattern",
        metric: "Reel #1",
    },
    {
        src: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80",
        title: "Script Generator",
        category: "Studio",
        metric: "5 Angles",
    },
    {
        src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        title: "Public Signals",
        category: "Extraction",
        metric: "Safe API",
    },
    {
        src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
        title: "Weekly Sprint",
        category: "Planning",
        metric: "7-Day",
    },
    {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        title: "Median Baseline",
        category: "Scoring",
        metric: "8.4% ER",
    },
    {
        src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
        title: "Critic Agent",
        category: "Compliance",
        metric: "Passed",
    },
    {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
        title: "Visual Framing",
        category: "Aesthetics",
        metric: "Golden",
    },
    {
        src: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80",
        title: "Signal Forest",
        category: "Radar",
        metric: "+88%",
    },
    {
        src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
        title: "Market Gap",
        category: "Discovery",
        metric: "Uncut",
    },
    {
        src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80",
        title: "Audio Emotion",
        category: "Sonic",
        metric: "Chill",
    },
    {
        src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop&q=80",
        title: "Visual Balance",
        category: "Framing",
        metric: "Rule of 3",
    },
    {
        src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=80",
        title: "Pacing Sync",
        category: "Tempo",
        metric: "Adaptive",
    },
    {
        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80",
        title: "Creative Synthesis",
        category: "Synthesis",
        metric: "Final",
    },
];

const TOTAL_IMAGES = 20;
const MAX_SCROLL = 2400;

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export interface ScrollMorphHeroProps {
    items?: MorphCardItem[];
    backgroundImage?: string;
    onExploreClick?: () => void;
    className?: string;
}

export default function ScrollMorphHero({
    items = DEFAULT_CARD_ITEMS,
    backgroundImage,
    onExploreClick,
    className,
}: ScrollMorphHeroProps) {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Virtual Scroll Logic ---
    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // Keep wheel event responsive inside hero
            if (e.deltaY > 0 && scrollRef.current >= MAX_SCROLL) {
                return; // Let user naturally scroll page
            }
            if (e.deltaY < 0 && scrollRef.current <= 0) {
                return;
            }

            e.preventDefault();
            const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;

            const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll]);

    // 1. Morph Progress: 0 (Circle around glowing core) -> 1 (Bottom Rainbow Arc)
    const morphProgress = useTransform(virtualScroll, [0, 500], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    // 2. Scroll Rotation
    const scrollRotate = useTransform(virtualScroll, [500, 2400], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    // --- Mouse Parallax ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 80);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence (Scatter -> Line -> Circle) ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 400);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 1800);
        return () => { 
            clearTimeout(timer1); 
            clearTimeout(timer2); 
        };
    }, []);

    // --- Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return items.map(() => ({
            x: (Math.random() - 0.5) * 1400,
            y: (Math.random() - 0.5) * 900,
            rotation: (Math.random() - 0.5) * 160,
            scale: 0.5,
            opacity: 0,
        }));
    }, [items]);

    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    const contentOpacity = useTransform(smoothMorph, [0.75, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.75, 1], [15, 0]);

    // Manual quick toggle for users without scroll wheels
    const toggleMorphState = () => {
        if (scrollRef.current > 300) {
            scrollRef.current = 0;
            virtualScroll.set(0);
        } else {
            scrollRef.current = 1200;
            virtualScroll.set(1200);
        }
    };

    const shuffleCards = () => {
        const next = (scrollRef.current + 450) % MAX_SCROLL;
        scrollRef.current = Math.max(next, 600);
        virtualScroll.set(scrollRef.current);
    };

    return (
        <div 
            ref={containerRef} 
            className={cn("relative w-full h-[640px] sm:h-[700px] lg:h-[740px] overflow-hidden select-none bg-[#09090b]", className)}
        >
            {/* Optional background image support if explicitly passed */}
            {backgroundImage && (
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 pointer-events-none opacity-40"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Ambient High-Tech Atmospheric Backdrop */}
            {/* 1. Subtle Dot-Matrix Grid with radial vignette mask */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                    backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                    maskImage: "radial-gradient(ellipse 70% 65% at 50% 48%, black 20%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 48%, black 20%, transparent 80%)",
                }}
            />

            {/* 2. Soft Atmospheric Glow Spheres */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 blur-[110px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* 3. Top and Bottom Fade Gradients */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent pointer-events-none z-10" />

            {/* Container */}
            <div className="relative z-20 flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Central Glowing AI Core (Visible in Circle Phase) */}
                <motion.div
                    style={{
                        opacity: useTransform(smoothMorph, [0, 0.35], [1, 0]),
                        scale: useTransform(smoothMorph, [0, 0.45], [1, 0.75]),
                    }}
                    className="absolute z-0 flex flex-col items-center justify-center pointer-events-none"
                >
                    <div className="relative flex items-center justify-center">
                        {/* Outer pulsating concentric ring */}
                        <div className="absolute w-56 h-56 rounded-full border border-white/5 animate-ping opacity-20" />
                        <div className="absolute w-44 h-44 rounded-full border border-emerald-500/15 animate-pulse" />
                        <div className="w-24 h-24 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.15)]">
                            <div className="w-14 h-14 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Initial Intro Text Floating Above the Sphere */}
                <div className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none top-[16%] sm:top-[18%] -translate-y-1/2 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0 } : { opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-2"
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            ContentOS Intelligence Swarm
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight drop-shadow-sm">
                            Reverse-Engineer What Goes Viral
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.85 - morphValue * 1.5 } : { opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-3 flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-400 bg-black/60 px-3.5 py-1 rounded-full border border-white/10 backdrop-blur-md"
                    >
                        <ArrowDown className="w-3 h-3 text-emerald-400 animate-bounce" />
                        <span>SCROLL OR CLICK SHUFFLE TO MORPH</span>
                    </motion.div>
                </div>

                {/* Arc Active Content (Fades in when scrolling) */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-[6%] sm:top-[8%] z-30 flex flex-col items-center justify-center text-center px-4 max-w-2xl pointer-events-auto"
                >
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10.5px] font-mono text-emerald-300 uppercase tracking-wider mb-2 backdrop-blur-md">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        Public Telemetry Reverse-Engineered
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                        Deconstruct What Wins
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-lg leading-relaxed bg-black/50 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                        Hover any card in the arc to flip & inspect hook formulas, audio BPM, and viral growth blueprints synthesized from public signals.
                    </p>

                    <div className="mt-3.5 flex items-center gap-3">
                        {onExploreClick && (
                            <button
                                onClick={onExploreClick}
                                className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
                            >
                                <span>Analyze Competitor URL</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button
                            onClick={shuffleCards}
                            className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-mono font-medium transition-all active:scale-95 flex items-center gap-1.5 backdrop-blur-md"
                        >
                            <RotateCw className="w-3 h-3 text-emerald-400" />
                            <span>Shuffle Arc</span>
                        </button>
                    </div>
                </motion.div>

                {/* Main Card Ring & Morph Rainbow Arc */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {items.slice(0, TOTAL_IMAGES).map((item, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i] || { x: 0, y: 0, rotation: 0, scale: 0.5, opacity: 0 };
                        } else if (introPhase === "line") {
                            const lineSpacing = 72;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 0.85, opacity: 1 };
                        } else {
                            // 2. Circle Phase (Orbiting around the luminous central core)
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            const circleRadius = Math.min(minDimension * 0.32, 260);
                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius - 10,
                                rotation: circleAngle + 90,
                            };

                            // Bottom Rainbow Arc:
                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.4);
                            const arcRadius = baseRadius * (isMobile ? 1.3 : 1.05);

                            const arcApexY = containerSize.height * (isMobile ? 0.38 : 0.28);
                            const arcCenterY = arcApexY + arcRadius;

                            const spreadAngle = isMobile ? 100 : 124;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                            const maxRotation = spreadAngle * 0.75;
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.25 : 1.5,
                            };

                            // Interpolate (Circle -> Rainbow Arch)
                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={item.src}
                                title={item.title}
                                category={item.category}
                                metric={item.metric}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase}
                                target={target}
                            />
                        );
                    })}
                </div>

                {/* Bottom Interactive Quick Controls Bar */}
                <div className="absolute bottom-3 z-30 flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-400">
                    <button
                        onClick={toggleMorphState}
                        className="hover:text-white transition-colors flex items-center gap-1.5"
                    >
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{morphValue > 0.5 ? "Reset Orbit" : "Expand Arc"}</span>
                    </button>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <button
                        onClick={shuffleCards}
                        className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                    >
                        <RotateCw className="w-3 h-3" />
                        <span>Shuffle</span>
                    </button>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span className="text-[10px] text-zinc-500">
                        {Math.round(morphValue * 100)}% morphed
                    </span>
                </div>
            </div>
        </div>
    );
}

// Named alias for flexibility
export { ScrollMorphHero, ScrollMorphHero as IntroAnimation };
