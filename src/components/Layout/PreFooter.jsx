"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const PreFooter = () => {
  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }

        @keyframes floatLogo {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%       { transform: translateY(-10px) rotate(2deg); }
        }
        .logo-float { animation: floatLogo 5s ease-in-out infinite; }
      `}</style>

      <section className="overflow-hidden border-t border-gray-100">
        {/* ── Marquee ticker ── */}
        <div className="border-y border-gray-200 py-3 mb-16 overflow-hidden bg-white">
          <div className="marquee-track select-none">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="flex items-center gap-6 px-6 text-[11px] font-bold uppercase tracking-[0.25em] text-black whitespace-nowrap"
              >
                NepStyle
                <span className="text-orange-400">✦</span>
                Free Shipping
                <span className="text-orange-400">✦</span>
                New Arrivals
                <span className="text-orange-400">✦</span>
                45-Day Returns
                <span className="text-orange-400">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Main block ── */}
        <div className="mx-auto max-w-7xl px-4 md:px-8 pb-12">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-[0_8px_60px_rgba(0,0,0,0.06)] p-10 md:p-16">
            {/* Subtle orange glow top-right */}
            <div className="absolute -top-24 -right-24 w-100 h-100 rounded-full bg-orange-100 blur-[100px] pointer-events-none opacity-60" />
            <div className="absolute -bottom-16 -left-16 w-75 h-75 rounded-full bg-amber-50 blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-14">
              {/* Left — Logo */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="logo-float shrink-0 w-36 h-36 md:w-52 md:h-52 lg:mr-12"
              >
                <Image
                  src="/images/NepStyleLogo.png"
                  alt="NepStyle"
                  width={208}
                  height={208}
                  unoptimized
                  className="object-contain drop-shadow-[0_12px_32px_rgba(249,115,22,0.18)]"
                />
              </motion.div>

              {/* Center — Text */}
              <div className="flex-1 text-center lg:text-left">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="text-orange-400 text-[11px] uppercase tracking-[0.3em] font-bold mb-4"
                >
                  Premium Fashion · Nepal
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-5"
                >
                  Wear it with
                  <br />
                  <span
                    className="text-transparent bg-clip-text"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #f97316, #f59e0b)",
                    }}
                  >
                    intention.
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                  className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0 mb-10"
                >
                  At NepStyle, we believe clothing is more than a fabric, it&apos;s a
                  silent language that speaks before you do. Every piece we
                  craft carries its own story, connecting with the person who
                  wears it. Designed to move with your life, built to express
                  who you are, and made to last beyond the moment.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.22 }}
                >
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold px-8 py-4 rounded-full transition-all duration-200 group"
                  >
                    Explore Collection
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </Link>
                </motion.div>
              </div>

              {/* Right — Trust badges */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="shrink-0 flex flex-row lg:flex-col gap-3 lg:ml-12"
              >
                {[
                  {
                    icon: "🚚",
                    label: "Free Shipping",
                    sub: "Orders over Rs.999",
                  },
                  { icon: "↩", label: "45-Day Returns", sub: "Hassle free" },
                  { icon: "🔒", label: "Secure Pay", sub: "100% encrypted" },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 min-w-37.5 hover:border-orange-100 hover:bg-orange-50/50 transition-all duration-200"
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <p className="text-gray-800 text-[11px] font-bold leading-none mb-0.5">
                        {badge.label}
                      </p>
                      <p className="text-gray-400 text-[10px]">{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PreFooter;
