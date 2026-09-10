"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Feather,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  Compass,
  FileCheck,
} from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { api } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { theme, setTheme } = useTheme();

  // Mode: false = Sign In, true = Sign Up
  const isSignUp = true;

  // Sign In fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up extra fields
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [acceptedCharter, setAcceptedCharter] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showWantedPoster, setShowWantedPoster] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleDemoSignInFill = (demoEmail, demoName, demoRole) => {
    setEmail(demoEmail);
    setPassword("author-pass-2026");
    setErrorMessage("");
    setShowWantedPoster(false);
  };

  const handleDemoSignUpFill = (demoName, demoDept, demoEmail) => {
    setFullName(demoName);
    setDepartment(demoDept);
    setEmail(demoEmail);
    setPassword("passkey-fellow-2026");
    setAcceptedCharter(true);
    setErrorMessage("");
    setShowWantedPoster(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setShowWantedPoster(false);

    if (!email || !password) {
      setErrorMessage("Please furnish both contributor email and access passkey.");
      setShowWantedPoster(true);
      setShakeKey((prev) => prev + 1);
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setErrorMessage("Please furnish your full author name for the byline.");
      setShowWantedPoster(true);
      setShakeKey((prev) => prev + 1);
      return;
    }

    if (isSignUp && !acceptedCharter) {
      setErrorMessage("Please accept the Vichaar Editorial Charter before enrolling.");
      setShowWantedPoster(true);
      setShakeKey((prev) => prev + 1);
      return;
    }

    setIsLoading(true);

    try {
      const response = isSignUp
        ? await api.register({
            name: fullName.trim(),
            email: email.trim(),
            password,
            department,
            role: `${department} Contributor`,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
            bio: `${department} staff fellow at Vichaar Broadsheet.`,
          })
        : await api.login({
            email: email.trim(),
            password,
          });

      // Save user and token into persistent store (localStorage)
      login(response.user, response.token);

      setSuccessMessage(
        isSignUp
          ? `Accreditation Granted. Welcome to the Vichaar Syndicate, ${response.user.name}.`
          : `Clearance Verified. Welcome to the Editorial Desk, ${response.user.name}.`
      );

      setTimeout(() => {
        router.push("/admin");
      }, 700);
    } catch (err) {
      const errMsg = err?.message || "Registration failed. Please check your details.";
      setErrorMessage(errMsg);
      setShowWantedPoster(true);
      setShakeKey((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-6 sm:py-8 px-4 flex flex-col justify-between items-center bg-background overflow-x-hidden">
      {/* 1. Ambient Authentic Newspaper Collage Wallpaper */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 dark:opacity-20 dark:invert-[0.92] dark:contrast-125 transition-opacity duration-500"
          style={{ backgroundImage: "url('/newspaper_collage_bg.jpg')" }}
        />
        {/* Paper texture gradient overlay to preserve legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background/90" />
      </div>

      {/* 2. Minimal Top Corner Bar */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between py-2 border-b border-border/70 backdrop-blur-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-foreground hover:text-amber-800 dark:hover:text-amber-300 font-bold transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Front Page</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-sm tracking-wider text-foreground">
            VICHAAR &bull;{" "}
            <span className="font-normal italic text-muted-foreground text-xs">
              {isSignUp ? "New Fellow Registry" : "Author Sign-In"}
            </span>
          </span>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-xs border border-border/80 hover:bg-secondary text-foreground cursor-pointer transition-colors bg-background/80"
            title="Toggle edition theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Central Workspace with Pinned Newspaper Cutouts & Card */}
      <div className="relative z-10 w-full max-w-md my-auto py-6 sm:py-10">
        {/* Interactive Clickable Newspaper Cutout 1: Return to Front Page (Top Left) */}
        <Link
          href="/"
          className="hidden md:block absolute -top-8 -left-72 w-64 p-4 bg-[#f7f3ea] dark:bg-[#1a1714] border-2 border-foreground/50 hover:border-foreground dark:border-border shadow-[5px_5px_0px_0px_rgba(28,24,21,0.85)] dark:shadow-[5px_5px_0px_0px_rgba(237,231,220,0.2)] -rotate-3 hover:rotate-0 hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-left z-20"
          title="Click to return to Late City Front Page"
        >
          {/* Masking Tape strip */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/40 shadow-xs rotate-1 pointer-events-none" />

          <div className="flex items-center justify-between text-[9px] font-sans font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-400 border-b border-border/70 pb-1 mb-2">
            <span>The Daily Chronicle &bull; 1926</span>
            <span className="text-[8px] font-mono uppercase bg-amber-200/60 dark:bg-amber-900/60 px-1 py-0.2 rounded-xs text-amber-900 dark:text-amber-200">
              CLICK TO OPEN
            </span>
          </div>

          <h4 className="font-serif font-black text-sm text-foreground leading-snug mb-1.5 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors flex items-start gap-1">
            <ArrowLeft className="w-4 h-4 shrink-0 mt-0.5 text-amber-800 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Late City Front Page</span>
          </h4>

          <p className="text-[10px] font-serif text-muted-foreground leading-relaxed">
            Click to exit the editorial bureau and return to the main broadsheet journal, latest dispatches, and public archives.
          </p>

          <div className="mt-2.5 pt-1.5 border-t border-border/60 flex items-center justify-between text-[8px] font-sans uppercase font-bold tracking-widest text-muted-foreground group-hover:text-foreground">
            <span>Delhi Central Press</span>
            <span className="text-amber-800 dark:text-amber-400 font-extrabold flex items-center gap-0.5">
              Read Journal &rarr;
            </span>
          </div>
        </Link>

        {/* Interactive Clickable Newspaper Cutout 2: Switch Sign-In / Sign-Up (Top Right) */}
        <Link href="/login" className="hidden md:block absolute -top-8 -right-72 w-64 p-4 bg-[#f7f3ea] dark:bg-[#1a1714] border-2 border-foreground/50 hover:border-foreground dark:border-border shadow-[5px_5px_0px_0px_rgba(28,24,21,0.85)] dark:shadow-[5px_5px_0px_0px_rgba(237,231,220,0.2)] rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-left z-20">
          {/* Corner Masking Tape */}
          <div className="absolute -top-2 -right-2 w-14 h-4 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/40 shadow-xs rotate-45 pointer-events-none" />

          <div className="flex items-center justify-between border-b border-border/60 pb-1 mb-2">
            <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-foreground/80">
              Bureau Wire Service
            </span>
            <span className="text-[8px] font-mono uppercase bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 px-1 py-0.2 rounded-xs font-bold">
              CLICK TO SWITCH
            </span>
          </div>

          {/* Crimson Ink Rubber Stamp */}
          <div className="my-1.5 py-1 px-2 border-2 border-red-700 text-red-700 dark:text-red-400 font-sans font-black text-[11px] uppercase tracking-widest text-center -rotate-1 group-hover:rotate-0 transition-transform">
            {isSignUp ? "[ ✓ SWITCH TO SIGN IN ]" : "[ ✎ SWITCH TO SIGN UP ]"}
          </div>

          <h4 className="font-serif font-black text-xs text-foreground leading-snug my-1 group-hover:text-amber-800 dark:group-hover:text-amber-300">
            {isSignUp
              ? "Already accredited? Return to Contributor Sign-In."
              : "New author or researcher? Apply for Bureau Fellowship."}
          </h4>

          <p className="text-[10px] font-serif text-muted-foreground leading-relaxed">
            {isSignUp
              ? "Click to return to the Ed-25519 dispatch clearance terminal and enter your author writing desk."
              : "Register your byline, select your editorial department, and receive publishing privileges."}
          </p>

          <div className="mt-2.5 pt-1.5 border-t border-border/60 flex items-center justify-between text-[8px] font-sans uppercase font-bold tracking-widest text-muted-foreground group-hover:text-foreground">
            <span>Syndicate Protocol</span>
            <span className="text-red-700 dark:text-red-400 font-extrabold flex items-center gap-0.5">
              {isSignUp ? "Open Sign In &rarr;" : "Open Sign Up &rarr;"}
            </span>
          </div>
        </Link>

        {/* Top Wire Badge */}
        <div className="text-center mb-5 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e2137] text-stone-100 text-[10px] font-sans uppercase font-bold tracking-widest border-b-2 border-red-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>
              {isSignUp
                ? "NEW FELLOW REGISTRY &bull; AUTHOR ENROLLMENT"
                : "DISPATCH CLEARANCE REQUIRED &bull; AUTHOR DESK"}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {isSignUp ? "Contributor Fellowship" : "Editorial Guild Sign-In"}
          </h1>
          <p className="text-xs font-serif italic text-muted-foreground">
            {isSignUp
              ? "“पंजीकरण • Join the permanent archive of independent essayists & thinkers.”"
              : "“लेखक एवं संपादक प्रकोष्ठ • The author's gateway to the printing press.”"}
          </p>
        </div>

        {/* Broadsheet Parchment Card */}
        <div className="border-2 border-foreground/80 dark:border-border bg-background/95 backdrop-blur-xs p-6 sm:p-9 shadow-[8px_8px_0px_0px_rgba(28,24,21,0.9)] dark:shadow-[8px_8px_0px_0px_rgba(237,231,220,0.18)] relative">
          {/* Dual-Tab Header: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 border-2 border-foreground/70 dark:border-border mb-6">
            <Link
              href="/login"
              className="block text-center py-2 text-[11px] font-sans uppercase font-black tracking-wider transition-colors border-r border-foreground/70 dark:border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              1. Sign In &bull; प्रवेश
            </Link>
            <Link
              href="/signup"
              className="block text-center py-2 text-[11px] font-sans uppercase font-black tracking-wider transition-colors bg-foreground text-background"
            >
              2. Sign Up &bull; पंजीकरण
            </Link>
          </div>

          {/* Form Seal */}
          <div className="flex items-center justify-between pb-2.5 border-b border-newspaper-double mb-5">
            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              <span className="font-sans text-[11px] font-black uppercase tracking-widest text-foreground">
                {isSignUp ? "Registry Form 208-A" : "Bureau Registry Form 104-B"}
              </span>
            </div>
            <span className="text-[10px] font-serif italic text-muted-foreground">
              Vol. IV &bull; 2026
            </span>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-600 text-emerald-900 dark:text-emerald-200 text-xs font-serif flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Hilarious Wanted Monkey Poster Animation for Registration / Passkey Errors */}
          {showWantedPoster && (
            <div
              key={shakeKey}
              className="mb-6 p-4 sm:p-5 bg-[#fff8e7] dark:bg-[#201a14] border-3 border-stone-900 dark:border-amber-400/90 shadow-[6px_6px_0px_0px_rgba(180,40,20,0.9)] dark:shadow-[6px_6px_0px_0px_rgba(251,191,36,0.3)] relative animate-in zoom-in-95 duration-200 text-center"
              style={{
                animation: "wantedShake 0.5s cubic-bezier(.36,.07,.19,.97) both",
              }}
            >
              <style>{`
                @keyframes wantedShake {
                  10%, 90% { transform: translate3d(-2px, 0, 0) rotate(-1deg); }
                  20%, 80% { transform: translate3d(3px, 0, 0) rotate(1.5deg); }
                  30%, 50%, 70% { transform: translate3d(-4px, 0, 0) rotate(-2deg); }
                  40%, 60% { transform: translate3d(4px, 0, 0) rotate(2deg); }
                }
              `}</style>

              {/* Dismiss X button */}
              <button
                type="button"
                onClick={() => setShowWantedPoster(false)}
                className="absolute top-2 right-2 text-stone-700 dark:text-stone-300 hover:text-red-700 font-sans font-black text-sm p-1 cursor-pointer"
                title="Dismiss"
              >
                &times;
              </button>

              {/* Wanted Header */}
              <div className="text-[10px] font-sans font-black uppercase tracking-[0.25em] text-red-700 dark:text-red-400 border-b-2 border-stone-900 dark:border-amber-400/80 pb-1 mb-2.5">
                ★ ★ ★ WANTED BY BUREAU POLICE ★ ★ ★
              </div>

              <h3 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-amber-100 tracking-tight leading-none mb-3 uppercase">
                WANTED: ENROLLMENT ERROR!
              </h3>

              {/* Authentic Vintage Newspaper Monkey Mugshot Plate */}
              <div className="relative mx-auto w-40 h-40 border-2 border-stone-900 dark:border-stone-200 bg-stone-100 dark:bg-stone-900 p-1 mb-3 shadow-[4px_4px_0px_0px_rgba(28,24,21,0.85)] dark:shadow-[4px_4px_0px_0px_rgba(251,191,36,0.3)] overflow-hidden">
                {/* Rubber Stamp */}
                <div className="absolute top-1 right-1 px-2 py-0.5 bg-red-700 text-white font-sans font-black text-[9px] uppercase tracking-wider -rotate-12 shadow-xs border border-white/50 z-20 animate-pulse">
                  ALERT! 🚨
                </div>

                {/* Newspaper Woodcut Engraving Image */}
                <div className="relative w-full h-full overflow-hidden bg-[#e8dec8]">
                  <Image
                    src="/wanted_monkey.jpg"
                    alt="Wanted Monkey Registration Error"
                    fill
                    className="object-cover contrast-125 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300 mb-2">
                EVIDENCE EXHIBIT &bull; MUGSHOT #9413-B
              </div>

              {/* Funny Warning Text */}
              <div className="space-y-1.5 mb-3">
                <div className="font-sans font-black text-xs uppercase tracking-wider text-red-800 dark:text-red-300">
                  🚨 CAUGHT YA! {errorMessage || "SOMETHING IS WRONG WITH YOUR DETAILS!"} 🚨
                </div>
                <p className="font-serif text-xs text-stone-800 dark:text-stone-300 leading-relaxed max-w-sm mx-auto">
                  The Bureau&apos;s security monkeys stopped this dispatch. Please verify your author byline, email, and passkey!
                </p>
                <p className="font-serif italic text-[11px] text-stone-600 dark:text-stone-400">
                  Did a monkey scramble your keyboard? 🍌 Please double check your entries.
                </p>
              </div>

              {/* Reward Banner */}
              <div className="py-1 px-3 bg-amber-200 dark:bg-amber-950/80 border border-amber-600/60 dark:border-amber-500/40 text-[10px] font-sans font-black uppercase tracking-widest text-amber-950 dark:text-amber-200 mb-3 flex items-center justify-center gap-1.5">
                <span>🍌 REWARD: 10,000 BANANAS FOR ACCREDITED FELLOWS 🍌</span>
              </div>

              {/* Dismiss / Retry Button */}
              <button
                type="button"
                onClick={() => setShowWantedPoster(false)}
                className="w-full py-1.5 px-3 bg-stone-900 dark:bg-amber-400 text-amber-200 dark:text-stone-950 hover:bg-red-800 hover:text-white dark:hover:bg-amber-300 transition-colors font-sans text-[10px] font-extrabold uppercase tracking-widest cursor-pointer shadow-xs"
              >
                [ 🍌 I WILL FIX IT — TRY AGAIN ]
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-foreground mb-1.5">
                  Full Contributor Name (For Byline)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Devendra Joshi"
                    className="w-full pl-9 pr-3 py-2 text-sm font-serif bg-secondary/30 border border-border focus:border-foreground focus:bg-background focus:outline-none transition-colors"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            {/* Department (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-foreground mb-1.5">
                  Primary Editorial Bureau
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm font-serif bg-secondary/30 border border-border focus:border-foreground focus:bg-background focus:outline-none transition-colors"
                  >
                    <option value="Engineering">Engineering (Systems & Architecture)</option>
                    <option value="Design & Craft">Design & Craft (Typography & CSS)</option>
                    <option value="Perspectives">Perspectives (Computational Philosophy)</option>
                    <option value="AI & Neural">AI & Neural Systems</option>
                    <option value="Culture & Society">Culture & Society</option>
                  </select>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-foreground mb-1.5">
                {isSignUp ? "Official Contributor Email" : "Contributor Address / ID"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@vichaar.journal"
                  className="w-full pl-9 pr-3 py-2 text-sm font-serif bg-secondary/30 border border-border focus:border-foreground focus:bg-background focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Passkey */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-foreground">
                  {isSignUp ? "Create Dispatch Passkey" : "Registry Passkey"}
                </label>
                <span className="text-[10px] font-serif italic text-muted-foreground">
                  Secured by Ed-25519
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-9 pr-10 py-2 text-sm font-serif bg-secondary/30 border border-border focus:border-foreground focus:bg-background focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-muted-foreground hover:text-foreground absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  aria-label={showPassword ? "Hide passkey" : "Show passkey"}
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox (Remember me on Sign In, or Charter on Sign Up) */}
            <div className="flex items-center justify-between pt-1">
              {isSignUp ? (
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptedCharter}
                    onChange={(e) => setAcceptedCharter(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 accent-amber-800 rounded-xs"
                  />
                  <span className="text-[11px] font-serif text-muted-foreground leading-snug">
                    I pledge to uphold the Vichaar Editorial Charter: <em>Depth Over Velocity</em>.
                  </span>
                </label>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-amber-800 rounded-xs"
                  />
                  <span className="text-[11px] font-serif text-muted-foreground">
                    Remember author session on this terminal
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-foreground text-background hover:bg-amber-800 dark:hover:bg-amber-700 hover:text-white transition-colors font-sans text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <span>
                    {isSignUp ? "Issuing Fellowship Clearance..." : "Verifying Credentials..."}
                  </span>
                ) : (
                  <>
                    <span>
                      {isSignUp ? "Register & Enter Writing Desk" : "Enter Author Desk"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Mobile / Tablet Responsive Switching Cutouts */}
        <div className="md:hidden flex flex-col gap-3 text-center mt-6">
          {/* Mobile Switch Cutout */}
          <Link href="/login" className="block p-3 bg-[#f7f3ea] dark:bg-[#1a1714] border-2 border-foreground/60 shadow-[4px_4px_0px_0px_rgba(28,24,21,0.85)] relative rotate-1 text-left">
            <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-0.5">
              Bureau Wire &bull; Switch Portal
            </div>
            <div className="font-serif font-bold text-xs text-foreground flex items-center justify-between">
              <span>{isSignUp ? "Already Accredited? Sign In" : "New Fellow? Sign Up Here"}</span>
              <span className="text-amber-800 font-sans font-extrabold text-[10px]">TAP &rarr;</span>
            </div>
          </Link>

          {/* Mobile Return Cutout */}
          <Link
            href="/"
            className="p-3 bg-[#f7f3ea] dark:bg-[#1a1714] border-2 border-foreground/60 shadow-[4px_4px_0px_0px_rgba(28,24,21,0.85)] relative -rotate-1 text-left"
          >
            <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-0.5">
              The Daily Chronicle &bull; Front Page
            </div>
            <div className="font-serif font-bold text-xs text-foreground flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Return to Late City Front Page &rarr;</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Footer Colophon */}
      <footer className="relative z-10 w-full max-w-5xl py-3 border-t border-border/60 text-center text-[10px] font-sans uppercase tracking-widest text-muted-foreground backdrop-blur-xs">
        The Vichaar Publishing Syndicate &bull; Secure Editorial Terminal &bull; MMXXVI
      </footer>
    </div>
  );
}
