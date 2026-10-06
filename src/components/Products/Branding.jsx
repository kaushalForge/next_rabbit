"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const Branding = () => {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .nepstyle-float { animation: float 4s ease-in-out infinite; }
        .spin-slow    { animation: spin-slow 18s linear infinite; }
      `}</style>

      <section className="mx-auto container">
        <div className="relative overflow-hidden bg-[#0e0e0e] min-h-[520px] flex flex-col lg:flex-row items-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[100px]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="spin-slow absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full border border-white/5" />
            <div className="spin-slow absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full border border-orange-500/10" />
          </div>

          <div className="relative z-10 flex-1 p-10 md:p-16 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-[11px] text-white/50 uppercase tracking-[0.2em] font-medium">
                NepStyle - Dress well, live better
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              Dressed for
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #f97316, #fb923c, #fdba74)",
                }}
              >
                every moment.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/40 text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0 mb-10"
            >
              NepStyle brings you high-quality, comfortable clothing that
              effortlessly blends fashion and function, designed to make you
              look and feel great every single day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center lg:justify-start gap-8 mb-10"
            >
              {[
                { value: "500+", label: "Styles" },
                { value: "4.9★", label: "Rating" },
                { value: "Fast", label: "Delivery" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <Link
                href="/"
                className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-200"
              >
                Shop Collection
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
              <Link
                href="/"
                className="text-white/40 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                View Lookbook
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 flex-1 flex items-center justify-center p-10 lg:p-16"
          >
            <div className="absolute w-72 h-72 rounded-full bg-orange-500/20 blur-[60px]" />

            <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-4 rounded-full border border-orange-500/10" />

              <div className="nepstyle-float relative w-52 h-52 md:w-64 md:h-64">
                <Image
                  src="/images/RabbitHouseLogo.png"
                  alt="NepStyle"
                  fill
                  unoptimized
                  className="object-contain select-none drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white/10 text-xs uppercase tracking-[0.4em] font-bold">
                NepStyle © 2025
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Branding;
