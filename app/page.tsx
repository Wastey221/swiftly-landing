"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Timer,
  LayoutGrid,
  Tag,
  Mail,
  ChevronRight,
  X,
} from "lucide-react";

const JOB_TAGS = [
  // Solid tech tags (Indigo)
  { name: "React", color: "bg-indigo-600 text-slate-50 border border-indigo-500/30" },
  { name: "Typescript", color: "bg-indigo-600 text-slate-50 border border-indigo-500/30" },
  // Solid work condition tags (Mint/Green)
  {
    name: "Remote",
    color: "bg-[#10B981] text-slate-900 border border-[#10B981]/30",
  },
  {
    name: "Full-time",
    color: "bg-[#10B981] text-slate-900 border border-[#10B981]/30",
  },
];

export default function Home() {
  const [hovered, setHovered] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [confettiBlastKey, setConfettiBlastKey] = useState(0);
  const [waitlistIsSubmitting, setWaitlistIsSubmitting] = useState(false);

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const footerEmailInputRef = useRef<HTMLInputElement | null>(null);

  const isValidEmail = (value: string) => {
    // Simple, readable email validation for a landing page.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const openWaitlist = (initialEmail = "") => {
    setIsWaitlistOpen(true);
    setWaitlistEmail(initialEmail);
    setWaitlistError(null);
    setWaitlistSuccess(false);
  };

  const closeWaitlist = () => {
    setIsWaitlistOpen(false);
  };

  const submitWaitlist = async (email: string) => {
    const next = email.trim();
    if (!isValidEmail(next)) {
      setWaitlistError("Please enter a valid email address.");
      return;
    }

    setWaitlistError(null);
    setWaitlistIsSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: next,
        }),
      });

      if (res.ok) {
        setWaitlistSuccess(true);
        setConfettiBlastKey((k) => k + 1);
      } else {
        setWaitlistError("Something went wrong. Please try again.");
      }
    } catch {
      setWaitlistError("Something went wrong. Please try again.");
    } finally {
      setWaitlistIsSubmitting(false);
    }
  };

  const onNotifyMe = async () => {
    await submitWaitlist(waitlistEmail);
  };

  useEffect(() => {
    if (!isWaitlistOpen) return;
    // Autofocus for nicer UX.
    emailInputRef.current?.focus();
  }, [isWaitlistOpen]);

  useEffect(() => {
    if (!isWaitlistOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWaitlist();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isWaitlistOpen]);

  function Confetti() {
    // Generate pieces once per success open.
    const pieces = useMemo(() => {
      const colors = ["#4F46E5", "#10B981", "#22C55E", "#60A5FA", "#A78BFA"];
      return Array.from({ length: 28 }).map((_, idx) => {
        const left = Math.random() * 100; // %
        const delay = Math.random() * 0.25;
        const duration = 0.9 + Math.random() * 0.5;
        const rotate = -180 + Math.random() * 360;
        const xDrift = -40 + Math.random() * 80; // px
        const size = 6 + Math.random() * 8; // px
        const color = colors[idx % colors.length];

        return { idx, left, delay, duration, rotate, xDrift, size, color };
      });
    }, []);

    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((p) => (
          <motion.span
            key={p.idx}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
            }}
            initial={{ y: -20, opacity: 0, rotate: p.rotate }}
            animate={{ y: 140, opacity: 1, rotate: p.rotate + 220, x: p.xDrift }}
            transition={{
              delay: p.delay,
              duration: p.duration,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black font-sans text-slate-800">
      {/* Navigation */}
      <header className="w-full flex items-center justify-between px-6 py-5 bg-white/80 dark:bg-black/80 border-b border-slate-100 dark:border-slate-800 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="font-extrabold text-2xl tracking-tighter text-slate-900 dark:text-slate-50 select-none">
            Swiftly<span className="text-[#10B981]">.</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => openWaitlist()}
          className="hidden sm:inline-block 
            px-5 py-2 rounded-full bg-emerald-400 hover:bg-emerald-500 text-white font-semibold transition-colors
            focus:ring-2 focus:ring-emerald-200 focus:outline-none text-base shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          Join Waitlist
        </button>
      </header>

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 md:px-0">
        <section className="w-full max-w-4xl flex flex-col items-center justify-center py-20 relative">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-slate-50 mb-8 leading-tight"
          >
            Hire in a Swipe.{" "}
            <span className="bg-indigo-600 dark:bg-indigo-600 rounded-2xl px-4 py-1 text-slate-50">
              Try in a Day.
            </span>
          </motion.h1>
          {/* Profile card (hover-bound badge) */}
          <div className="relative z-0">
            <motion.div
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 28px 0 rgba(80,88,159,0.13)" }}
              className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl shadow-lg mx-auto px-7 py-8 w-[335px] md:w-[410px] border border-slate-100 dark:border-slate-800 cursor-pointer transition-all duration-200"
              tabIndex={0}
              aria-label="Demo Job Card"
            >
              {/* Hover-bound Test-Drive badge */}
              <motion.div
                className="absolute -top-3 -right-3 z-20 opacity-100 bg-white/90 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 rounded-full px-3 py-1.5 shadow-sm pointer-events-none"
                animate={{ opacity: 1, scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                aria-label="1-3 Day Paid Trial"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  1-3 Day Paid Trial
                </span>
              </motion.div>

              {/* Card header & avatar */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-xl flex items-center justify-center">
                  <img
                    src="https://i.pravatar.cc/150?u=alex"
                    alt="Candidate photo"
                    width={32}
                    height={32}
                    className="rounded-full"
                    loading="eager"
                  />
                </div>
                <div>
                  <span className="font-medium text-lg text-slate-900 dark:text-slate-100">
                    Alex Johnson
                  </span>
                  <div className="text-slate-500 text-sm">Frontend Engineer</div>
                </div>
              </div>
              {/* Card body */}
              <div className="mt-4 flex flex-wrap gap-3 px-1.5 py-1">
                {JOB_TAGS.map((tag, i) => (
                  <motion.span
                    key={tag.name}
                    className={`
                      rounded-full px-3 py-2 text-xs font-semibold border transition-all duration-200 inline-flex items-center gap-2 whitespace-nowrap
                      ${tag.color}
                      relative z-10 hover:z-50 hover:scale-105
                    `}
                  >
                    <Tag size={24} className="text-current" />
                    {tag.name}
                  </motion.span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-slate-500 text-xs">
                <div>🗓️ Available tomorrow</div>
                <div className="flex items-center gap-2">
                  <BadgeCheck size={24} className="text-slate-600" />
                  Vetted
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features: Bento Grid */}
        <section className="py-20 w-full max-w-5xl px-0 md:px-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center p-7 transition-all hover:-translate-y-1 duration-150">
            <div className="mb-3">
              <BadgeCheck size={24} className="text-slate-600" />
            </div>
            <span className="font-semibold text-lg md:text-xl text-slate-900 dark:text-slate-50">
              Smart Tag Matching
            </span>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-base">
              Instant, intelligent matching with candidate tags and roles.
            </p>
          </div>
          {/* Card 2 */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center p-7 transition-all hover:-translate-y-1 duration-150">
            <div className="mb-3">
              <Timer size={24} className="text-slate-600" />
            </div>
            <span className="font-semibold text-lg md:text-xl text-slate-900 dark:text-slate-50">
              1-3 Day Test-Drive
            </span>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-base">
              See candidates in action—hire only after a 1-3 day paid trial.
            </p>
          </div>
          {/* Card 3 */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center p-7 transition-all hover:-translate-y-1 duration-150">
            <div className="mb-3">
              <LayoutGrid size={24} className="text-slate-600" />
            </div>
            <span className="font-semibold text-lg md:text-xl text-slate-900 dark:text-slate-50">
              Zero-Clutter UI
            </span>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-base">
              No noise. Just a focused, modern workspace for fast hiring.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-black/90 py-20">
        <div className="max-w-5xl mx-auto flex flex-col-reverse sm:flex-row sm:justify-between items-center sm:items-end px-6 gap-8 sm:gap-0">
          {/* Footer Nav */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-slate-500 mb-6 sm:mb-0">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#demo" className="hover:text-indigo-600 transition-colors">Demo</a>
            <a href="#waitlist" className="hover:text-indigo-600 transition-colors">Waitlist</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          {/* Newsletter */}
          <form className="flex items-center gap-2 w-full sm:w-auto max-w-md"
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = footerEmailInputRef.current?.value ?? "";
                  if (!isValidEmail(email)) {
                    openWaitlist(email);
                    setWaitlistError("Please enter a valid email address.");
                    return;
                  }

                  openWaitlist(email);
                  void submitWaitlist(email);
                }}
                >
            <label htmlFor="newsletter" className="sr-only">
              Email
            </label>
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail size={24} className="text-slate-600" />
              </div>
              <input
                type="email"
                id="newsletter"
                required
                ref={footerEmailInputRef}
                placeholder="Your email"
                className="pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 shadow-inner text-slate-800 dark:text-slate-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-600/20 placeholder:text-slate-400"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={waitlistIsSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-full transition-all flex items-center gap-1 focus:ring-2 focus:ring-indigo-600/30 focus:outline-none"
            >
              {waitlistIsSubmitting ? "Sending..." : "Join"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>
        <div className="mt-5 text-center text-slate-400 text-xs select-none">
          &copy; {new Date().getFullYear()} Swiftly. All rights reserved.
        </div>
      </footer>

      {/* Waitlist Modal */}
      {isWaitlistOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-6"
          onClick={closeWaitlist}
          role="dialog"
          aria-modal="true"
          aria-label="Waitlist modal"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-lg rounded-3xl border border-indigo-500/20 bg-slate-950/95 backdrop-blur px-6 py-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-50">
                  Join the Future of Hiring
                </h2>
                <p className="mt-2 text-slate-300">
                  Be the first to know when <span className="text-[#10B981]">Swiftly.</span> launches.
                </p>
              </div>

              <button
                type="button"
                onClick={closeWaitlist}
                className="inline-flex items-center justify-center rounded-full p-2 border border-white/10 hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} className="text-slate-300" />
              </button>
            </div>

            <div className="mt-5 relative">
              {waitlistSuccess ? (
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                  <Confetti key={confettiBlastKey} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <p className="text-lg font-semibold text-slate-50">
                      You’re on the list! 🎉 We’ll reach out soon.
                    </p>
                  </motion.div>
                </div>
              ) : (
                <form
                  className="rounded-2xl border border-white/10 bg-slate-900/40 p-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void onNotifyMe();
                  }}
                >
                  <label htmlFor="waitlist-email" className="sr-only">
                    Email address
                  </label>

                  <div className="flex flex-col gap-2">
                    <input
                      ref={emailInputRef}
                      id="waitlist-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={waitlistEmail}
                      onChange={(e) => {
                        setWaitlistEmail(e.target.value);
                        if (waitlistError) setWaitlistError(null);
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                      aria-invalid={waitlistError ? "true" : "false"}
                      required
                    />

                    {waitlistError && (
                      <p className="text-sm text-rose-300">{waitlistError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={waitlistIsSubmitting}
                      className="mt-1 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    >
                      {waitlistIsSubmitting ? "Sending..." : "Notify Me"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
