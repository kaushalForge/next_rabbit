"use client";
import { Dancing_Script } from "next/font/google";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../Resuables/Button";

const dancingFont = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
});

const Hero = () => {
  return (
    <>
      <section className="relative overflow-hidden h-100 md:h-150 lg:h-185">
        <Image
          src="/assets/hero-banner.jpg"
          alt="Rabbit"
          fill
          priority
          quality={85}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-opacity-5 flex items-center justify-center">
          <div className="text-center p-6">
            <h1 className="hero-text-stroke text-6xl md:text-9xl font-bold tracking-wider uppercase text-[#cc9317]">
              <span className={`${dancingFont.className}`}>Pure</span>
              <br />
              <span className={`${dancingFont.className}`}>Style</span>
            </h1>
            <p
              className="text-lg font-medium md:text-2xl mb-6 whitespace-nowrap text-[#f0f0f0]"
              style={{
                textShadow: `
      0 0 4px rgba(255,69,0,0.6),    /* lighter red-orange */
      0 0 8px rgba(255,69,0,0.4),
      0 0 12px rgba(0,200,255,0.3),  /* soft modern blue */
      0 0 16px rgba(0,200,255,0.2)
    `,
              }}
            >
              Explore our vacation-ready outfits with fast worldwide shipping
            </p>
            <Link
              href="/collections/all"
              // prefetch={true}
              className="inline-block outline-none"
            >
              <Button />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
